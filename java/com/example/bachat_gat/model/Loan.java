package com.example.bachat_gat.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Loan {
    private int loanId;
    private int memberId;
    private int loanTypeId;           // ✅ Added
    private BigDecimal loanAmount;
    private LocalDate loanDate;
    private BigDecimal interestRate;
    private int durationMonths;
    private String loanStatus;
    private LocalDate closeDate;

    // ====== Getters and Setters ======

    public int getLoanId() {
        return loanId;
    }

    public void setLoanId(int loanId) {
        this.loanId = loanId;
    }

    public int getMemberId() {
        return memberId;
    }

    public void setMemberId(int memberId) {
        this.memberId = memberId;
    }

    public int getLoanTypeId() {
        return loanTypeId;
    }

    public void setLoanTypeId(int loanTypeId) {
        this.loanTypeId = loanTypeId;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public LocalDate getLoanDate() {
        return loanDate;
    }

    public void setLoanDate(LocalDate loanDate) {
        this.loanDate = loanDate;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public int getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(int durationMonths) {
        this.durationMonths = durationMonths;
    }

    public String getLoanStatus() {
        return loanStatus;
    }

    public void setLoanStatus(String loanStatus) {
        this.loanStatus = loanStatus;
    }

	public LocalDate getCloseDate() {
		return closeDate;
	}

	public void setCloseDate(LocalDate closeDate) {
		this.closeDate = closeDate;
	}
    
}
