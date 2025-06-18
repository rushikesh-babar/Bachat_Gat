package com.example.bachat_gat.service;

import com.example.bachat_gat.dao.MonthlySavingsDao;
import com.example.bachat_gat.model.MemberwiseCollectionDTO;
import com.example.bachat_gat.model.MonthlySavings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MonthlySavingsService {

    @Autowired
    private MonthlySavingsDao savingsDao;
    
    public int generateNewSavingsId() {
        Integer lastId = savingsDao.getLastSavingsId();
        if (lastId == null) {
            return 1;
        }
        return lastId + 1;
    }

    public String addSavings(MonthlySavings savings) {
        try {
            // Generate new ID using DAO
            int newId = generateNewSavingsId();
            savings.setId(newId);

            int rowsInserted = savingsDao.addSavings(savings);
            if (rowsInserted > 0) {
                return "Savings record added successfully with ID: " + newId;
            } else {
                return "Failed to add savings record.";
            }
        } catch (DataAccessException e) {
            return "Database error while adding savings: " + e.getMessage();
        } catch (Exception e) {
            return "Unexpected error: " + e.getMessage();
        }
    }

    public List<MonthlySavings> getAllSavings() {
        try {
            return savingsDao.getAllSavings();
        } catch (DataAccessException e) {
            throw new RuntimeException("Error fetching savings list: " + e.getMessage());
        }
    }

    public Map<String, List<?>> getPaidAndUnpaidMembersByMonthYear(String month, Integer year) {
        return savingsDao.getPaidAndUnpaidMembersByMonthYear(month, year);
    }
    
    public List<MemberwiseCollectionDTO> fetchMemberwiseCollectionSummary() {
        return savingsDao.getMemberwiseCollectionSummary();
    }

    public double fetchTotalSHGCollection() {
        return savingsDao.getTotalSHGCollectionIncludingFine();
    }

   
}
