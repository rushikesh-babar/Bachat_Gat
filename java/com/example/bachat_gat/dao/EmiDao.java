package com.example.bachat_gat.dao;

import com.example.bachat_gat.model.PaidEmiDTO;
import com.example.bachat_gat.model.PendingEmiDTO;
import com.example.bachat_gat.model.Emi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Repository
public class EmiDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public int getNextEmiId() {
        String sql = "SELECT COALESCE(MAX(emi_id), 0) + 1 FROM emis";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }


    public List<PaidEmiDTO> getPaidEmisByMonthYear(String month, int year) {
        String sql = """
            SELECT m.member_id,
                   CONCAT(m.first_name, ' ', m.middle_name, ' ', m.last_name) AS member_name,
                   e.emi_date, e.emi_amount, e.fine_amount, e.payment_status
            FROM emis e
            JOIN loans l ON e.loan_id = l.loan_id
            JOIN members m ON l.member_id = m.member_id
            WHERE e.emi_month = ? AND e.emi_year = ? AND e.payment_status = 'PAID'
        """;

        return jdbcTemplate.query(sql, ps -> {
            ps.setString(1, month);
            ps.setInt(2, year);
        }, (rs, rowNum) -> new PaidEmiDTO(
            rs.getInt("member_id"),
            rs.getString("member_name"),
            rs.getDate("emi_date").toLocalDate(),
            rs.getDouble("emi_amount"),
            rs.getDouble("fine_amount"),
            rs.getString("payment_status")
        ));
    }

    public List<PendingEmiDTO> getPendingEmisByMonthYear(String month, int year) {
        String sql = """
            SELECT m.member_id,
                   CONCAT_WS(' ', m.first_name, m.middle_name, m.last_name) AS member_name,
                   l.loan_id
            FROM loans l
            JOIN members m ON l.member_id = m.member_id
            WHERE l.loan_status = 'active'
              AND NOT EXISTS (
                  SELECT 1 FROM emis e
                  WHERE e.loan_id = l.loan_id AND e.emi_month = ? AND e.emi_year = ?
              )
        """;

        return jdbcTemplate.query(sql, ps -> {
            ps.setString(1, month);
            ps.setInt(2, year);
        }, (rs, rowNum) -> new PendingEmiDTO(
            rs.getInt("member_id"),
            rs.getString("member_name"),
            rs.getInt("loan_id")
        ));
    }


    public void insertEmi(Emi emi) {
        int nextEmiId = getNextEmiId();

        String sql = """
            INSERT INTO emis (emi_id, loan_id, emi_date, emi_amount, fine_amount, payment_status, emi_month, emi_year)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;

        jdbcTemplate.update(sql, ps -> {
            ps.setInt(1, nextEmiId);
            ps.setInt(2, emi.getLoanId());
            ps.setDate(3, java.sql.Date.valueOf(emi.getEmiDate()));
            ps.setDouble(4, emi.getEmiAmount());
            ps.setDouble(5, emi.getFineAmount());
            ps.setString(6, emi.getPaymentStatus());
            ps.setString(7, emi.getEmiMonth());
            ps.setInt(8, emi.getEmiYear());
        });
    }

}
