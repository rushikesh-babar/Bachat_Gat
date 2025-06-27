package com.example.bachat_gat.model;

import java.time.LocalDate;

public class ActiveLoanMemberDTO {
    private int memberId;
    private String memberName;
    private int loanId;
    private double loanAmount;
    private LocalDate loanDate;
    private int duration;           
    private double interestRate;    

    public ActiveLoanMemberDTO() {}

    public ActiveLoanMemberDTO(int memberId, String memberName, int loanId, double loanAmount, LocalDate loanDate, int duration, double interestRate) {
        this.memberId = memberId;
        this.memberName = memberName;
        this.loanId = loanId;
        this.loanAmount = loanAmount;
        this.loanDate = loanDate;
        this.duration = duration;
        this.interestRate = interestRate;
    }

    public int getMemberId() {
        return memberId;
    }

    public void setMemberId(int memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public int getLoanId() {
        return loanId;
    }

    public void setLoanId(int loanId) {
        this.loanId = loanId;
    }

    public double getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(double loanAmount) {
        this.loanAmount = loanAmount;
    }

    public LocalDate getLoanDate() {
        return loanDate;
    }

    public void setLoanDate(LocalDate loanDate) {
        this.loanDate = loanDate;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }
}
