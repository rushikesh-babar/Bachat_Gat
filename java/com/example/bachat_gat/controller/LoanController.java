package com.example.bachat_gat.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bachat_gat.model.ActiveLoanDetailResponseDTO;
import com.example.bachat_gat.model.ActiveLoanMemberDTO;
import com.example.bachat_gat.model.Loan;
import com.example.bachat_gat.model.LoanClosureSummaryDTO;
import com.example.bachat_gat.model.LoanType;
import com.example.bachat_gat.service.LoanService;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

	@Autowired
    private LoanService loanService;

    @PostMapping("/add")
    public ResponseEntity<?> addLoan(@RequestBody Loan loan) {
        try {
            BigDecimal emi = loanService.addLoan(loan);
            return ResponseEntity.ok("Loan added successfully. EMI per month: ₹" + emi);
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(500)
                    .body("Failed to add loan: " + ex.getMessage());
        }
    }
    
    @GetMapping("/loan-types")
    public ResponseEntity<List<LoanType>> getAllLoanTypes() {
        List<LoanType> loanTypes = loanService.getAllLoanTypes();
        return new ResponseEntity<>(loanTypes, HttpStatus.OK);
    }
    
    @GetMapping("/loan-types/{id}")
    public ResponseEntity<LoanType> getLoanTypeById(@PathVariable Long id) {
        LoanType loanType = loanService.getLoanTypeById(id);
        if (loanType != null) {
            return new ResponseEntity<>(loanType, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
    }
    
    @GetMapping("/active-loans")
    public ResponseEntity<List<ActiveLoanMemberDTO>> getActiveLoans() {
        List<ActiveLoanMemberDTO> activeLoans = loanService.getActiveLoanMembers();
        return ResponseEntity.ok(activeLoans);
    }
    
    @GetMapping("/active-loans/{loanId}")
    public ResponseEntity<ActiveLoanDetailResponseDTO> getLoanDetails(@PathVariable int loanId) {
        ActiveLoanDetailResponseDTO response = loanService.getLoanDetailWithEmis(loanId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{loanId}/close")
    public ResponseEntity<String> closeLoan(@PathVariable int loanId) {
        try {
            loanService.closeLoan(loanId, LocalDate.now()); 
            return ResponseEntity.ok("Loan closed successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to close loan: " + ex.getMessage());
        }
    }
    
    @GetMapping("/{loanId}/closure-summary")
    public ResponseEntity<?> getLoanClosureSummary(@PathVariable int loanId) {
        try {
            LoanClosureSummaryDTO summary = loanService.getLoanClosureSummary(loanId);
            return ResponseEntity.ok(summary);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to fetch closure summary: " + ex.getMessage());
        }
    }


}
