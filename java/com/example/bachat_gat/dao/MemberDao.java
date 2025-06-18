package com.example.bachat_gat.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.example.bachat_gat.model.Member;

@Repository
public class MemberDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Member> memberRowMapper = (ResultSet rs, int rowNum) -> {
        Member member = new Member();
        member.setMemberId(rs.getInt("member_id"));
        member.setFirstName(rs.getString("first_name"));
        member.setMiddleName(rs.getString("middle_name"));
        member.setLastName(rs.getString("last_name"));
        member.setDob(rs.getDate("dob"));
        member.setGender(rs.getString("gender"));
        member.setMaritalStatus(rs.getString("marital_status"));
        member.setEducation(rs.getString("education"));
        member.setContactNo(rs.getString("contact_no"));
        member.setEmail(rs.getString("email"));
        member.setAddress(rs.getString("address"));
        member.setPanCardNo(rs.getString("pan_card_no"));
        member.setAadharNo(rs.getString("aadhar_no"));
        member.setNomineeName(rs.getString("nominee_name"));
        member.setNomineeRelation(rs.getString("nominee_relation"));
        member.setRole(rs.getString("role"));
        member.setPassword(rs.getString("password"));
        try {
            member.setCreatedAt(rs.getTimestamp("created_at"));
            member.setUpdatedAt(rs.getTimestamp("updated_at"));
        } catch (SQLException e) {
        }
        return member;
    };

    // --- Duplicate Check Methods ---
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM members WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    public boolean existsByContactNo(String contactNo) {
        String sql = "SELECT COUNT(*) FROM members WHERE contact_no = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, contactNo);
        return count != null && count > 0;
    }

    public boolean existsByPanCardNo(String panCardNo) {
        String sql = "SELECT COUNT(*) FROM members WHERE pan_card_no = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, panCardNo);
        return count != null && count > 0;
    }

    public boolean existsByAadharNo(String aadharNo) {
        String sql = "SELECT COUNT(*) FROM members WHERE aadhar_no = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, aadharNo);
        return count != null && count > 0;
    }
    // --- End duplicate check ---

    public int addMember(Member member) {
        String sql = "INSERT INTO members (member_id, first_name, middle_name, last_name, dob, gender, marital_status, education, contact_no, email, address, pan_card_no, aadhar_no, nominee_name, nominee_relation, role, password) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                member.getMemberId(),
                member.getFirstName(),
                member.getMiddleName(),
                member.getLastName(),
                member.getDob(),
                member.getGender(),
                member.getMaritalStatus(),
                member.getEducation(),
                member.getContactNo(),
                member.getEmail(),
                member.getAddress(),
                member.getPanCardNo(),
                member.getAadharNo(),
                member.getNomineeName(),
                member.getNomineeRelation(),
                member.getRole(),
                member.getPassword()
        );
    }

    public int updateMember(Member member) {
        String sql = "UPDATE members SET first_name = ?, middle_name = ?, last_name = ?, dob = ?, gender = ?, marital_status = ?, education = ?, contact_no = ?, email = ?, address = ?, pan_card_no = ?, aadhar_no = ?, nominee_name = ?, nominee_relation = ?, role = ?, password = ? " +
                     "WHERE member_id = ?";
        return jdbcTemplate.update(sql,
                member.getFirstName(),
                member.getMiddleName(),
                member.getLastName(),
                member.getDob(),
                member.getGender(),
                member.getMaritalStatus(),
                member.getEducation(),
                member.getContactNo(),
                member.getEmail(),
                member.getAddress(),
                member.getPanCardNo(),
                member.getAadharNo(),
                member.getNomineeName(),
                member.getNomineeRelation(),
                member.getRole(),
                member.getPassword(),
                member.getMemberId()
        );
    }

    public List<Member> getAllMembers() {
        String sql = "SELECT * FROM members";
        return jdbcTemplate.query(sql, memberRowMapper);
    }

    public Member getMemberById(int id) {
        String sql = "SELECT * FROM members WHERE member_id = ?";
        List<Member> members = jdbcTemplate.query(sql, memberRowMapper, id);
        return members.isEmpty() ? null : members.get(0);
    }

    public Integer getLastMemberId() {
        String sql = "SELECT member_id FROM members ORDER BY member_id DESC LIMIT 1";
        try {
            return jdbcTemplate.queryForObject(sql, Integer.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Member getMemberByEmail(String email) {
        String sql = "SELECT * FROM members WHERE email = ?";
        List<Member> members = jdbcTemplate.query(sql, memberRowMapper, email);
        return members.isEmpty() ? null : members.get(0);
    }
}
