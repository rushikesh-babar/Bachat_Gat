package com.example.bachat_gat.controller;
import com.example.bachat_gat.model.MemberwiseCollectionDTO;
import com.example.bachat_gat.model.MonthlySavings;
import com.example.bachat_gat.service.MonthlySavingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/savings")
public class MonthlySavingsController {

    @Autowired
    private MonthlySavingsService savingsService;

    @PostMapping("/add")
    public ResponseEntity<String> addSavings(@RequestBody MonthlySavings savings) {
        String result = savingsService.addSavings(savings);
        if (result.startsWith("Savings record added successfully")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } else if (result.startsWith("Failed")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<MonthlySavings>> getAllSavings() {
        try {
            List<MonthlySavings> list = savingsService.getAllSavings();
            if (list.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(list);
            }
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/paid-unpaid/{month}/{year}")
    public ResponseEntity<Map<String, List<?>>> getPaidAndUnpaid(
            @PathVariable String month,
            @PathVariable Integer year) {
        try {
            Map<String, List<?>> result = savingsService.getPaidAndUnpaidMembersByMonthYear(month, year);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/memberwise-collection")
    public ResponseEntity<Map<String, Object>> getMemberwiseCollection() {
        List<MemberwiseCollectionDTO> memberwise = savingsService.fetchMemberwiseCollectionSummary();
        double totalSHGCollection = savingsService.fetchTotalSHGCollection();

        Map<String, Object> response = new HashMap<>();
        response.put("memberwise", memberwise);
        response.put("totalSHGCollection", totalSHGCollection);

        return ResponseEntity.ok(response);
    }

}
