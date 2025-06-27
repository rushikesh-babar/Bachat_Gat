package com.example.bachat_gat.model;

import java.time.LocalDate;

public class Emi {

    private int emiId;
    private int loanId;
    private LocalDate emiDate;
    private double emiAmount;
    private double fineAmount;
    private String paymentStatus;
    private String emiMonth;  // Changed from int to String
    private int emiYear;

    // Constructors
    public Emi() {}

    public Emi(int emiId, int loanId, LocalDate emiDate, double emiAmount,
               double fineAmount, String paymentStatus, String emiMonth, int emiYear) {
        this.emiId = emiId;
        this.loanId = loanId;
        this.emiDate = emiDate;
        this.emiAmount = emiAmount;
        this.fineAmount = fineAmount;
        this.paymentStatus = paymentStatus;
        this.emiMonth = emiMonth;
        this.emiYear = emiYear;
    }

    // Getters and Setters

    public int getEmiId() {
        return emiId;
    }

    public void setEmiId(int emiId) {
        this.emiId = emiId;
    }

    public int getLoanId() {
        return loanId;
    }

    public void setLoanId(int loanId) {
        this.loanId = loanId;
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

    public String getEmiMonth() {
        return emiMonth;
    }

    public void setEmiMonth(String emiMonth) {
        this.emiMonth = emiMonth;
    }

    public int getEmiYear() {
        return emiYear;
    }

    public void setEmiYear(int emiYear) {
        this.emiYear = emiYear;
    }
}
