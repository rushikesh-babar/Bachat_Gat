package com.example.bachat_gat.dao;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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
        // JdbcTemplate will throw EmptyResultDataAccessException if no row is found
        return jdbcTemplate.queryForObject(SQL, (rs, rowNum) -> {
            LoanType loanType = new LoanType();
            loanType.setLoanTypeId(rs.getLong("loan_type_id"));
            loanType.setInterestRate(rs.getBigDecimal("interest_rate"));
            return loanType;
        }, id);
    }
    
}
