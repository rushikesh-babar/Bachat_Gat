package com.example.bachat_gat.service;

import com.example.bachat_gat.dao.EmiDao;
import com.example.bachat_gat.dao.LoanDao;
import com.example.bachat_gat.model.PaidEmiDTO;
import com.example.bachat_gat.model.PendingEmiDTO;
import com.example.bachat_gat.model.ActiveLoanMemberDTO;
import com.example.bachat_gat.model.Emi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;

@Service
public class EmiService {

    @Autowired
    private EmiDao emiDao;
    @Autowired
    private LoanDao loanDao;
    
    

    public List<PaidEmiDTO> getPaidEmis(String month, int year) {
        try {
            return emiDao.getPaidEmisByMonthYear(month, year);
        } catch (Exception e) {
            System.err.println("Error fetching paid EMIs: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<PendingEmiDTO> getPendingEmis(String month, int year) {
        try {
            List<PendingEmiDTO> pendingList = emiDao.getPendingEmisByMonthYear(month, year);

            for (PendingEmiDTO pending : pendingList) {
                BigDecimal emiAmount = calculateEmiAmountByLoanId(pending.getLoanId());
                pending.setEmiAmount(emiAmount);
            }

            return pendingList;
        } catch (Exception e) {
            System.err.println("Error fetching pending EMIs: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public void payEmi(Emi emi) {
        try {
            emiDao.insertEmi(emi);
        } catch (Exception e) {
            System.err.println("Error while paying EMI: " + e.getMessage());
            throw new RuntimeException("Failed to insert EMI payment.");
        }
    }
    
    public BigDecimal calculateEmiAmountByLoanId(int loanId) {
        ActiveLoanMemberDTO loan = loanDao.getLoanSummaryByLoanId(loanId);

        BigDecimal principal = BigDecimal.valueOf(loan.getLoanAmount());
        BigDecimal rate = BigDecimal.valueOf(loan.getInterestRate()); // % per annum
        int duration = loan.getDuration(); // in months

        // Flat interest = (P × R × T) / 1200
        BigDecimal interest = principal.multiply(rate)
                .multiply(BigDecimal.valueOf(duration))
                .divide(BigDecimal.valueOf(1200), 2, RoundingMode.HALF_UP);

        BigDecimal totalPayable = principal.add(interest);

        // EMI = Total Payable / Duration
        return totalPayable.divide(BigDecimal.valueOf(duration), 2, RoundingMode.HALF_UP);
    }

}
