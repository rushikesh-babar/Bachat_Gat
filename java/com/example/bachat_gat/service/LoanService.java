package com.example.bachat_gat.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.example.bachat_gat.dao.LoanDao;
import com.example.bachat_gat.model.Loan;
import com.example.bachat_gat.model.LoanType;

@Service
public class LoanService {

	@Autowired
    private LoanDao loanDao;

	public BigDecimal addLoan(Loan loan) {
	    try {
	        // 1. Generate new loan ID
	        int newLoanId = loanDao.getLastLoanId() + 1;
	        loan.setLoanId(newLoanId);

	        // ✅ 2. Get loanTypeId from the passed loan object
	        int loanTypeId = loan.getLoanTypeId();  // ✅ use what's passed in

	        // 3. Get interest rate for that loanTypeId
	        BigDecimal interestRate = loanDao.getInterestRateByLoanTypeId(loanTypeId);
	        if (interestRate == null) {
	            throw new RuntimeException("Interest rate not found for loan_type_id = " + loanTypeId);
	        }

	        // ✅ Set interest rate but DON'T override loanTypeId anymore
	        loan.setInterestRate(interestRate);

	        // 4. Save the loan
	        loanDao.saveLoan(loan, loanTypeId);

	        // 5. Calculate EMI
	        BigDecimal emi = loan.getLoanAmount()
	                             .multiply(interestRate)
	                             .divide(new BigDecimal("100"));

	        return emi;

	    } catch (DataAccessException dae) {
	        throw new RuntimeException("Database error occurred while adding the loan: " + dae.getMessage(), dae);

	    } catch (Exception ex) {
	        throw new RuntimeException("Unexpected error while adding loan: " + ex.getMessage(), ex);
	    }
	}
	
	public List<LoanType> getAllLoanTypes() {
        return loanDao.findAllLoanTypes();
    }

	public LoanType getLoanTypeById(Long id) {
        try {
            return loanDao.findLoanTypeById(id);
        } catch (EmptyResultDataAccessException e) {
            System.err.println("LoanType with ID " + id + " not found: " + e.getMessage());
            return null; 
        }

	}}
