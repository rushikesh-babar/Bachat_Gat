package com.example.bachat_gat.model;

import java.time.LocalDate;

public class PaidEmiDTO {
    private int memberId;
    private String memberName;
    private LocalDate emiDate;
    private double emiAmount;
    private double fineAmount;
    private String paymentStatus;

    public PaidEmiDTO() {}

    public PaidEmiDTO(int memberId, String memberName, LocalDate emiDate, double emiAmount, double fineAmount, String paymentStatus) {
        this.memberId = memberId;
        this.memberName = memberName;
        this.emiDate = emiDate;
        this.emiAmount = emiAmount;
        this.fineAmount = fineAmount;
        this.paymentStatus = paymentStatus;
    }

    // Getters and Setters

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

    public LocalDate getEmiDate() {
        return emiDate;
    }

    public void setEmiDate(LocalDate emiDate) {
        this.emiDate = emiDate;
    }

    public double getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(double emiAmount) {
        this.emiAmount = emiAmount;
    }

    public double getFineAmount() {
        return fineAmount;
    }

    public void setFineAmount(double fineAmount) {
        this.fineAmount = fineAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
