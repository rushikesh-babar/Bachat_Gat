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
		    // Step 1: Generate unique member ID
		    int newMemberId = generateNewMemberId(); // generate based on last member_id
		    member.setMemberId(newMemberId);

		    // Step 2: Encode password securely
		    member.setPassword(passwordEncoder.encode(member.getPassword()));

	
		    int result = memberDao.addMember(member);

		    return result > 0 ? "Member added successfully with ID: " + newMemberId : "Failed to add member";
		}
	 catch (DuplicateKeyException e) {
	        return "PAN or Aadhar number already exists.";
	    } catch (DataAccessException e) {
	        return "Database error occurred.";
	    } catch (Exception e) {
	        return "Something went wrong: " + e.getMessage();
	    }

	 }

	 public boolean updateMember(Member member) {
		    // Encrypt password before saving
		    String encodedPassword = passwordEncoder.encode(member.getPassword());
		    member.setPassword(encodedPassword);
		    return memberDao.updateMember(member) > 0;
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

