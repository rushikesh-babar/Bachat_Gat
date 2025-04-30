package com.example.bachat_gat.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.bachat_gat.model.Member;
import com.example.bachat_gat.service.JWTService;
import com.example.bachat_gat.service.MemberService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")

public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Add Member
    @PostMapping("/add")
    public ResponseEntity<String> addMember(@RequestBody Member member) {
        String response = memberService.addMember(member);
        if (response.startsWith("Member added successfully")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // ✅ Update Member
    @PutMapping("/member/update/{id}")
    public ResponseEntity<?> updateMember(@PathVariable int id, @RequestBody Member member) {
        member.setMemberId(id);
        boolean updated = memberService.updateMember(member);
        if (updated) {
            return ResponseEntity.ok("Member updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("Member with ID " + id + " not found.");
        }
    }

    // ✅ Get All Members
    @GetMapping("/list")
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // ✅ Get Member by ID
    @GetMapping("/member/id/{id}")
    public ResponseEntity<?> getMemberById(@PathVariable int id) {
        Member member = memberService.getMemberById(id);
        if (member != null) {
            member.setPassword(null); // remove password before sending
            return ResponseEntity.ok(member);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("Member with ID " + id + " not found");
        }
    }

    // ✅ Get Member by Email (safe path to avoid conflict)
    @GetMapping("/member/email/{email}")
    public Member getMemberByEmail(@PathVariable String email) {
        return memberService.getMemberByEmail(email);
    }

    // ✅ Member Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member member) {
        System.out.println("Login attempt for member email: " + member.getEmail());

        Member foundMember = memberService.getMemberByEmail(member.getEmail());

        if (foundMember == null || !passwordEncoder.matches(member.getPassword(), foundMember.getPassword())) {
            System.out.println("❌ Invalid member credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        System.out.println("✅ Member found: " + foundMember.getEmail() + ", Role: " + foundMember.getRole());

        String token = jwtService.generateToken(foundMember);

        System.out.println("🔐 Generated Token: " + token);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "role", foundMember.getRole()
        ));
    }
}
