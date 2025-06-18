package com.example.bachat_gat.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.bachat_gat.dao.MemberDao;
import com.example.bachat_gat.model.Member;

@Service
public class MemberService {

    @Autowired
    private MemberDao memberDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public int generateNewMemberId() {
        Integer lastId = memberDao.getLastMemberId();
        if (lastId == null) {
            return 1;
        }
        return lastId + 1;
    }

    public String addMember(Member member) {
        try {
            // Check duplicates first
            if (memberDao.existsByEmail(member.getEmail())) {
                return "Email already exists.";
            }
            if (memberDao.existsByContactNo(member.getContactNo())) {
                return "Mobile number already exists.";
            }
            if (memberDao.existsByPanCardNo(member.getPanCardNo())) {
                return "PAN number already exists.";
            }
            if (memberDao.existsByAadharNo(member.getAadharNo())) {
                return "Aadhar number already exists.";
            }

            // Generate unique member ID
            int newMemberId = generateNewMemberId();
            member.setMemberId(newMemberId);

            // Encode password securely
            member.setPassword(passwordEncoder.encode(member.getPassword()));

            int result = memberDao.addMember(member);
            return result > 0 ? "Member added successfully with ID: " + newMemberId : "Failed to add member";

        } catch (DuplicateKeyException e) {
            return "PAN or Aadhar number already exists.";
        } catch (DataAccessException e) {
            return "Database error occurred.";
        } catch (Exception e) {
            return "Something went wrong: " + e.getMessage();
        }
    }

    public boolean updateMember(Member member) {
        try {
            if (member.getPassword() != null && !member.getPassword().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(member.getPassword());
                member.setPassword(encodedPassword);
            } else {
                Member existingMember = memberDao.getMemberById(member.getMemberId());
                if (existingMember == null) {
                    throw new IllegalArgumentException("Member not found with ID: " + member.getMemberId());
                }
                member.setPassword(existingMember.getPassword());
            }

            return memberDao.updateMember(member) > 0;

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Validation error: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Error while updating member: " + e.getMessage());
            e.printStackTrace();
        }

        return false; 
    }

    public List<Member> getAllMembers() {
        return memberDao.getAllMembers();
    }

    public Member getMemberById(int id) {
        return memberDao.getMemberById(id);
    }

    public Member getMemberByEmail(String email) {
        return memberDao.getMemberByEmail(email);
    }
}
