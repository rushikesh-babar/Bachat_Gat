package com.example.bachat_gat.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bachat_gat.model.Emi;
import com.example.bachat_gat.model.PaidEmiDTO;
import com.example.bachat_gat.model.PendingEmiDTO;
import com.example.bachat_gat.service.EmiService;

@RestController
@RequestMapping("/api/emis")
public class EmiController {

    @Autowired
    private EmiService emiService;

    @GetMapping("/paid")
    public ResponseEntity<List<PaidEmiDTO>> getPaidEmis(
        @RequestParam String month,
        @RequestParam int year) {
        return ResponseEntity.ok(emiService.getPaidEmis(month, year));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PendingEmiDTO>> getPendingEmis(
        @RequestParam String month,
        @RequestParam int year) {
        return ResponseEntity.ok(emiService.getPendingEmis(month, year));
    }

    @PostMapping("/pay")
    public ResponseEntity<String> payEmi(@RequestBody Emi emi) {
        emiService.payEmi(emi);
        return ResponseEntity.ok("EMI Paid Successfully");
    }
    
    @GetMapping("/calculate/{loanId}")
    public ResponseEntity<BigDecimal> getEmiAmount(@PathVariable int loanId) {
        BigDecimal emi = emiService.calculateEmiAmountByLoanId(loanId);
        return ResponseEntity.ok(emi);
    }
}
