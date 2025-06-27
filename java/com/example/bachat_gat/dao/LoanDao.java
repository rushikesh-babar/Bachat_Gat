package com.example.bachat_gat.dao;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.bachat_gat.model.ActiveLoanMemberDTO;
import com.example.bachat_gat.model.EmiDTO;
import com.example.bachat_gat.model.Loan;
import com.example.bachat_gat.model.LoanType;

@Repository
public class LoanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Get last loan ID
    public int getLastLoanId() {
        String sql = "SELECT MAX(loan_id) FROM loans";
        Integer lastId = jdbcTemplate.queryForObject(sql, Integer.class);
        return (lastId != null) ? lastId : 0;
    }

    public BigDecimal getInterestRateByLoanTypeId(int loanTypeId) {
        String sql = "SELECT interest_rate FROM loan_types WHERE loan_type_id = ?";
        return jdbcTemplate.queryForObject(sql, BigDecimal.class, loanTypeId);
    }

    // Insert loan record
    public int saveLoan(Loan loan, int loanTypeId) {
        String sql = "INSERT INTO loans (loan_id, member_id, loan_type_id, loan_amount, loan_date, interest_rate, duration_months, loan_status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        return jdbcTemplate.update(sql,
                loan.getLoanId(),
                loan.getMemberId(),
                loanTypeId,
                loan.getLoanAmount(),
                Date.valueOf(loan.getLoanDate()),
                loan.getInterestRate(),
                loan.getDurationMonths(),
                loan.getLoanStatus()
        );
    }

    public List<LoanType> findAllLoanTypes() {
        final String SQL = "SELECT loan_type_id, interest_rate FROM loan_types";
        return jdbcTemplate.query(SQL, (rs, rowNum) -> {
            LoanType loanType = new LoanType();
            loanType.setLoanTypeId(rs.getLong("loan_type_id"));
            loanType.setInterestRate(rs.getBigDecimal("interest_rate"));
            return loanType;
        });
    }

    public LoanType findLoanTypeById(Long id) {
        final String SQL = "SELECT loan_type_id, interest_rate FROM loan_types WHERE loan_type_id = ?";
        return jdbcTemplate.queryForObject(SQL, (rs, rowNum) -> {
            LoanType loanType = new LoanType();
            loanType.setLoanTypeId(rs.getLong("loan_type_id"));
            loanType.setInterestRate(rs.getBigDecimal("interest_rate"));
            return loanType;
        }, id);
    }

    // Active loans list
    public List<ActiveLoanMemberDTO> getActiveLoanMembers() {
        String sql = """
            SELECT 
                m.member_id,
                CONCAT(m.first_name, ' ', COALESCE(m.middle_name, ''), ' ', m.last_name) AS member_name,
                l.loan_id,
                l.loan_amount,
                l.loan_date,
                l.duration_months,
                l.interest_rate
            FROM loans l
            JOIN members m ON l.member_id = m.member_id
            WHERE l.loan_status = 'active'
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new ActiveLoanMemberDTO(
            rs.getInt("member_id"),
            rs.getString("member_name").trim(),
            rs.getInt("loan_id"),
            rs.getDouble("loan_amount"),
            rs.getDate("loan_date").toLocalDate(),
            rs.getInt("duration_months"),
            rs.getDouble("interest_rate")
        ));
    }

    // Loan summary by loanId
    public ActiveLoanMemberDTO getLoanSummaryByLoanId(int loanId) {
        String sql = """
            SELECT 
                l.loan_id,
                l.member_id,
                CONCAT(m.first_name, ' ', COALESCE(m.middle_name, ''), ' ', m.last_name) AS member_name,
                l.loan_amount,
                l.loan_date,
                l.duration_months,
                l.interest_rate
            FROM loans l
            JOIN members m ON l.member_id = m.member_id
            WHERE l.loan_id = ?
        """;

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
            new ActiveLoanMemberDTO(
                rs.getInt("member_id"),
                rs.getString("member_name").trim(),
                rs.getInt("loan_id"),
                rs.getDouble("loan_amount"),
                rs.getDate("loan_date").toLocalDate(),
                rs.getInt("duration_months"),
                rs.getDouble("interest_rate")
            ), loanId);
    }

    // Paid EMIs for a loan
    public List<EmiDTO> getPaidEmisByLoanId(int loanId) {
        String sql = """
            SELECT emi_date, emi_amount, fine_amount
            FROM emis
            WHERE loan_id = ? AND payment_status = 'Paid'
            ORDER BY emi_date ASC
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new EmiDTO(
                rs.getDate("emi_date").toLocalDate(),
                rs.getDouble("emi_amount"),
                rs.getDouble("fine_amount")
            ), loanId);
    }
    
    public int closeLoan(int loanId, java.time.LocalDate closeDate) {
        String sql = "UPDATE loans SET loan_status = 'closed', close_date = ? WHERE loan_id = ?";
        return jdbcTemplate.update(sql, Date.valueOf(closeDate), loanId);
    }

}
