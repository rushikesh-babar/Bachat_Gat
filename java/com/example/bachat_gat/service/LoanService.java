package com.example.bachat_gat.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.example.bachat_gat.dao.LoanDao;
import com.example.bachat_gat.model.ActiveLoanDetailResponseDTO;
import com.example.bachat_gat.model.ActiveLoanMemberDTO;
import com.example.bachat_gat.model.EmiDTO;
import com.example.bachat_gat.model.Loan;
import com.example.bachat_gat.model.LoanClosureSummaryDTO;
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

	}
	
	public List<ActiveLoanMemberDTO> getActiveLoanMembers() {
        try {
            return loanDao.getActiveLoanMembers();
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error fetching active loans: " + e.getMessage());
            // Optionally rethrow a custom exception
            throw new RuntimeException("Failed to retrieve active loans. Please try again later.");
        }
    }
	
	// ✅ New method: Get full loan + EMI details by loanId
    public ActiveLoanDetailResponseDTO getLoanDetailWithEmis(int loanId) {
        try {
            ActiveLoanMemberDTO loanDetails = loanDao.getLoanSummaryByLoanId(loanId);
            List<EmiDTO> emis = loanDao.getPaidEmisByLoanId(loanId);

            return new ActiveLoanDetailResponseDTO(loanDetails, emis);
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("Loan not found for loan ID = " + loanId);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching loan details: " + e.getMessage(), e);
        }
    }
    
    
 // At the end of your existing LoanService class
    public void closeLoan(int loanId, java.time.LocalDate closeDate) {
        try {
            loanDao.closeLoan(loanId, closeDate);
        } catch (Exception e) {
            throw new RuntimeException("Failed to close loan with ID " + loanId + ": " + e.getMessage(), e);
        }
    }
    
    
    public LoanClosureSummaryDTO getLoanClosureSummary(int loanId) {
        // Fetch loan and EMI details
        ActiveLoanMemberDTO loanDetails = loanDao.getLoanSummaryByLoanId(loanId);
        List<EmiDTO> paidEmis = loanDao.getPaidEmisByLoanId(loanId);

        // ✅ Step 1: Calculate total EMI paid (excluding fine)
        BigDecimal totalEmiPaid = paidEmis.stream()
                .map(emi -> BigDecimal.valueOf(emi.getEmiAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // ✅ Optional: Calculate total fine paid (just for info)
        BigDecimal totalFinePaid = paidEmis.stream()
                .map(emi -> BigDecimal.valueOf(emi.getFineAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Step 2: Calculate total loan payable with flat interest
        BigDecimal loanAmount = BigDecimal.valueOf(loanDetails.getLoanAmount());
        BigDecimal interestRate = BigDecimal.valueOf(loanDetails.getInterestRate()); // % per annum
        int duration = loanDetails.getDuration(); // months

        // Interest = (P * R * T) / 1200
        BigDecimal interest = loanAmount.multiply(interestRate)
                .multiply(BigDecimal.valueOf(duration))
                .divide(BigDecimal.valueOf(1200), 2, RoundingMode.HALF_UP);

        BigDecimal totalLoanPayable = loanAmount.add(interest);

        // ✅ Step 3: Calculate closing amount (don't subtract fine)
        BigDecimal closingAmount = totalLoanPayable.subtract(totalEmiPaid).max(BigDecimal.ZERO);

        // Step 4: Return DTO (you may include totalFinePaid in DTO if needed)
        return new LoanClosureSummaryDTO(loanDetails, paidEmis, closingAmount);
    }



	}
