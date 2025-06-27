package com.example.bachat_gat.model;

import java.util.List;

public class ActiveLoanDetailResponseDTO {

    private ActiveLoanMemberDTO loanDetails;
    private List<EmiDTO> paidEmis;

    public ActiveLoanDetailResponseDTO() {
    }

    public ActiveLoanDetailResponseDTO(ActiveLoanMemberDTO loanDetails, List<EmiDTO> paidEmis) {
        this.loanDetails = loanDetails;
        this.paidEmis = paidEmis;
    }

    public ActiveLoanMemberDTO getLoanDetails() {
        return loanDetails;
    }

    public void setLoanDetails(ActiveLoanMemberDTO loanDetails) {
        this.loanDetails = loanDetails;
    }

    public List<EmiDTO> getPaidEmis() {
        return paidEmis;
    }

    public void setPaidEmis(List<EmiDTO> paidEmis) {
        this.paidEmis = paidEmis;
    }
}
