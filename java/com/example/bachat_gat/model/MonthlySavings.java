package com.example.bachat_gat.model;
import java.math.BigDecimal;
import java.sql.Date;

public class MonthlySavings {

    private int id;
    private Integer memberId;
    private String savingsMonth;
    private Integer savingsYear;
    private BigDecimal amount;
    private BigDecimal fineAmount;
    private Date paymentDate;

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getMemberId() {
        return memberId;
    }

    public void setMemberId(Integer memberId) {
        this.memberId = memberId;
    }

    public String getSavingsMonth() {
        return savingsMonth;
    }

    public void setSavingsMonth(String savingsMonth) {
        this.savingsMonth = savingsMonth;
    }

    public Integer getSavingsYear() {
        return savingsYear;
    }

    public void setSavingsYear(Integer savingsYear) {
        this.savingsYear = savingsYear;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getFineAmount() {
        return fineAmount;
    }

    public void setFineAmount(BigDecimal fineAmount) {
        this.fineAmount = fineAmount;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }
}
