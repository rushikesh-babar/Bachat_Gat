package com.example.bachat_gat.service;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.bachat_gat.model.Member;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class JWTService {

    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey key;

    @PostConstruct
    public void init() {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(secretKey);
            key = Keys.hmacShaKeyFor(keyBytes);
            System.out.println("✅ JWT Secret Key initialized");
        } catch (Exception e) {
            System.err.println("❌ Error initializing JWT secret key: " + e.getMessage());
        }
    }

    public String generateToken(Member member) {
        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", member.getRole()); 
            claims.put("name", member.getFirstName()); 


            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(member.getEmail()) // Use email as subject
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                    .signWith(key)
                    .compact();
        } catch (Exception e) {
            System.out.println("❌ Error generating token: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("role", String.class);
        } catch (Exception e) {
            System.out.println("❌ Failed to extract role from token: " + e.getMessage());
            return null;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
