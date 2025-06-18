package com.example.bachat_gat.model;

public class MemberwiseCollectionDTO {
    private int memberId;
    private String name;
    private double totalContribution;
    private double totalFine;

    // Constructors
    public MemberwiseCollectionDTO() {}

    public MemberwiseCollectionDTO(int memberId, String name, double totalContribution, double totalFine) {
        this.memberId = memberId;
        this.name = name;
        this.totalContribution = totalContribution;
        this.totalFine = totalFine;
    }

    // Getters and Setters
    public int getMemberId() {
        return memberId;
    }

    public void setMemberId(int memberId) {
        this.memberId = memberId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getTotalContribution() {
        return totalContribution;
    }

    public void setTotalContribution(double totalContribution) {
        this.totalContribution = totalContribution;
    }

    public double getTotalFine() {
        return totalFine;
    }

    public void setTotalFine(double totalFine) {
        this.totalFine = totalFine;
    }

	@Override
	public String toString() {
		return "MemberwiseCollectionDTO [memberId=" + memberId + ", name=" + name + ", totalContribution="
				+ totalContribution + ", totalFine=" + totalFine + "]";
	}
    
}
