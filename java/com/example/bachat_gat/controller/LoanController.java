package com.example.bachat_gat.controller;

import java.math.BigDecimal;
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

import com.example.bachat_gat.model.Loan;
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
        // Returns HTTP 200 OK with the list of loan types (can be empty if none exist)
        return new ResponseEntity<>(loanTypes, HttpStatus.OK);
    }
    
    @GetMapping("/loan-types/{id}")
    public ResponseEntity<LoanType> getLoanTypeById(@PathVariable Long id) {
        LoanType loanType = loanService.getLoanTypeById(id);
        if (loanType != null) {
            // If the service returned a LoanType (meaning it was found)
            return new ResponseEntity<>(loanType, HttpStatus.OK);
        } else {
            // If the service returned null (meaning no loan type was found for the ID)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Return 404 Not Found
        }
    }
}
