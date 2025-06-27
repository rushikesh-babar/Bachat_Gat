package com.example.bachat_gat.model;

import java.math.BigDecimal;

public class PendingEmiDTO {
    private int memberId;
    private String memberName;
    private int loanId;
    private BigDecimal emiAmount;


    public PendingEmiDTO() {}

    public PendingEmiDTO(int memberId, String memberName, int loanId) {
        this.memberId = memberId;
        this.memberName = memberName;
        this.loanId = loanId;
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

    public int getLoanId() {
        return loanId;
    }

    public void setLoanId(int loanId) {
        this.loanId = loanId;
    }

	public BigDecimal getEmiAmount() {
		return emiAmount;
	}

	public void setEmiAmount(BigDecimal emiAmount) {
		this.emiAmount = emiAmount;
	}

   
}
