package com.example.bachat_gat.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PaidMemberDTO {
    private int memberId;
    private String memberName;
    private LocalDate contributionDate;
    private BigDecimal amount;
    private BigDecimal fineAmount;

    public PaidMemberDTO() {}

    public PaidMemberDTO(int memberId, String memberName, LocalDate contributionDate, BigDecimal amount, BigDecimal fineAmount) {
        this.memberId = memberId;
        this.memberName = memberName;
        this.contributionDate = contributionDate;
        this.amount = amount;
        this.fineAmount = fineAmount;
    }

    // Getters and setters
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

    public LocalDate getContributionDate() {
        return contributionDate;
    }
    public void setContributionDate(LocalDate contributionDate) {
        this.contributionDate = contributionDate;
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
}