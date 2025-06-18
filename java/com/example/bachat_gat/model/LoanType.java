package com.example.bachat_gat.model;

import java.math.BigDecimal;

public class LoanType {

    private Long loanTypeId; 
    private BigDecimal interestRate;

    // Constructors
    public LoanType() {
    }

    public LoanType(Long loanTypeId, BigDecimal interestRate) {
        this.loanTypeId = loanTypeId;
        this.interestRate = interestRate;
    }

    // Getters and Setters
    public Long getLoanTypeId() {
        return loanTypeId;
    }

    public void setLoanTypeId(Long loanTypeId) {
        this.loanTypeId = loanTypeId;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    @Override
    public String toString() {
        return "LoanType{" +
               "loanTypeId=" + loanTypeId +
               ", interestRate=" + interestRate +
               '}';
    }
}