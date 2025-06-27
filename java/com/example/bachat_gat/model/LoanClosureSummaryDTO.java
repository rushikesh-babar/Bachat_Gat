package com.example.bachat_gat.model;

import java.math.BigDecimal;
import java.util.List;

public class LoanClosureSummaryDTO {
    private ActiveLoanMemberDTO loanDetails;
    private List<EmiDTO> paidEmis;
    private BigDecimal closingAmount;

    public LoanClosureSummaryDTO() {}

    public LoanClosureSummaryDTO(ActiveLoanMemberDTO loanDetails, List<EmiDTO> paidEmis, BigDecimal closingAmount) {
        this.loanDetails = loanDetails;
        this.paidEmis = paidEmis;
        this.closingAmount = closingAmount;
    }

    public ActiveLoanMemberDTO getLoanDetails() {
        return loanDetails;
    }

    public void setLoanDetails(ActiveLoanMemberDTO loanDetails) {
        this.loanDetails = loanDetails;
    }

    public List<EmiDTO> getPaidEmis() {
        return paidEmis;
    }

    public void setPaidEmis(List<EmiDTO> paidEmis) {
        this.paidEmis = paidEmis;
    }

    public BigDecimal getClosingAmount() {
        return closingAmount;
    }

    public void setClosingAmount(BigDecimal closingAmount) {
        this.closingAmount = closingAmount;
    }
}
