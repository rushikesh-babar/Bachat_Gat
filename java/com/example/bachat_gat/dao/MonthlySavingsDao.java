package com.example.bachat_gat.dao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.bachat_gat.model.MemberwiseCollectionDTO;
import com.example.bachat_gat.model.MonthlySavings;
import com.example.bachat_gat.model.PaidMemberDTO;
import com.example.bachat_gat.model.UnpaidMemberDTO;

@Repository
public class MonthlySavingsDao {

	 @Autowired
	    private JdbcTemplate jdbcTemplate;

	    public int addSavings(MonthlySavings savings) {
	        String sql = "INSERT INTO monthly_savings (id, member_id, savings_month, savings_year, amount, fine_amount, payment_date) " +
	                     "VALUES (?, ?, ?, ?, ?, ?, ?)";

	        return jdbcTemplate.update(sql,
	                savings.getId(),
	                savings.getMemberId(),
	                savings.getSavingsMonth(),
	                savings.getSavingsYear(),
	                savings.getAmount(),
	                savings.getFineAmount(),
	                savings.getPaymentDate()
	        );
	    }
	    public List<MonthlySavings> getAllSavings() {
	        String sql = "SELECT * FROM monthly_savings";

	        return jdbcTemplate.query(sql, (rs, rowNum) -> {
	            MonthlySavings s = new MonthlySavings();
	            s.setId(rs.getInt("id"));
	            s.setMemberId(rs.getObject("member_id", Integer.class));
	            s.setSavingsMonth(rs.getString("savings_month"));
	            s.setSavingsYear(rs.getObject("savings_year", Integer.class));
	            s.setAmount(rs.getBigDecimal("amount"));
	            s.setFineAmount(rs.getBigDecimal("fine_amount"));
	            s.setPaymentDate(rs.getDate("payment_date"));
	            return s;
	        });
	    }
	    public Integer getLastSavingsId() {
	        String sql = "SELECT MAX(id) FROM monthly_savings";
	        return jdbcTemplate.queryForObject(sql, Integer.class);
	    }
	    
	    public Map<String, List<?>> getPaidAndUnpaidMembersByMonthYear(String month, Integer year) {
	        Map<String, List<?>> result = new HashMap<>();

	        // Fetch paid members with savings data
	        String paidSql = "SELECT m.member_id, m.first_name, m.middle_name, m.last_name, " +
	                         "s.payment_date, s.amount, s.fine_amount " +
	                         "FROM members m " +
	                         "JOIN monthly_savings s ON m.member_id = s.member_id " +
	                         "WHERE s.savings_month = ? AND s.savings_year = ?";

	        List<PaidMemberDTO> paidMembers = jdbcTemplate.query(paidSql, (rs, rowNum) -> {
	            int memberId = rs.getInt("member_id");
	            String name = rs.getString("first_name") + " " +
	                          rs.getString("middle_name") + " " +
	                          rs.getString("last_name");
	            LocalDate paymentDate = rs.getDate("payment_date").toLocalDate();
	            BigDecimal amount = rs.getBigDecimal("amount");
	            BigDecimal fineAmount = rs.getBigDecimal("fine_amount");

	            return new PaidMemberDTO(memberId, name, paymentDate, amount, fineAmount);
	        }, month, year);

	     // Unpaid members using UnpaidMemberDTO
	        String unpaidSql = "SELECT m.member_id, m.first_name, m.middle_name, m.last_name, m.email " +
	                           "FROM members m " +
	                           "WHERE m.member_id NOT IN (" +
	                           "  SELECT member_id FROM monthly_savings WHERE savings_month = ? AND savings_year = ?" +
	                           ")";

	        List<UnpaidMemberDTO> unpaidMembers = jdbcTemplate.query(unpaidSql, (rs, rowNum) -> {
	            String fullName = rs.getString("first_name") + " " +
	                              rs.getString("middle_name") + " " +
	                              rs.getString("last_name");

	            return new UnpaidMemberDTO(
	                rs.getInt("member_id"),
	                fullName.trim(),
	                rs.getString("email")
	            );
	        }, month, year);

	        result.put("paid", paidMembers);       // List<PaidMemberDTO>
	        result.put("unpaid", unpaidMembers);   // List<UnpaidMemberDTO>

	        return result;
	    }
	    
	    public List<MemberwiseCollectionDTO> getMemberwiseCollectionSummary() {
	        String sql = """
	            SELECT m.member_id,
	                   CONCAT(m.first_name, ' ', m.middle_name, ' ', m.last_name) AS name,
	                   COALESCE(SUM(s.amount), 0) AS total_contribution,
	                   COALESCE(SUM(s.fine_amount), 0) AS total_fine
	            FROM members m
	            LEFT JOIN monthly_savings s ON m.member_id = s.member_id
	            GROUP BY m.member_id, name
	        """;

	        return jdbcTemplate.query(sql, (rs, rowNum) -> {
	            return new MemberwiseCollectionDTO(
	                rs.getInt("member_id"),
	                rs.getString("name"),
	                rs.getDouble("total_contribution"),
	                rs.getDouble("total_fine")
	            );
	        });
	    }

	    public double getTotalSHGCollectionIncludingFine() {
	        String sql = "SELECT COALESCE(SUM(amount + fine_amount), 0) FROM monthly_savings";
	        return jdbcTemplate.queryForObject(sql, Double.class);
	    }

}