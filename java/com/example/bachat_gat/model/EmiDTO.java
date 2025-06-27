package com.example.bachat_gat.model;

import java.time.LocalDate;

public class EmiDTO {

    private LocalDate emiDate;
    private double emiAmount;
    private double fineAmount;

    public EmiDTO() {
    }

    public EmiDTO(LocalDate emiDate, double emiAmount, double fineAmount) {
        this.emiDate = emiDate;
        this.emiAmount = emiAmount;
        this.fineAmount = fineAmount;
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
}
