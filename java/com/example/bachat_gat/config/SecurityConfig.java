package com.example.bachat_gat.config;

import com.example.bachat_gat.service.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtFilter jwtFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService, JwtFilter jwtFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
            	    // Allow public access to React app and static files
            	    .requestMatchers(
            	        "/", "/index.html", "/login",
            	        "/favicon.ico", "/logo*", "/manifest.json",
            	        "/static/**", "/assets/**", 
            	        "/*.js", "/*.css", "/**/*.svg",
            	        "/dashboards/**", "/memberform", "/update-members", "/view-members", 
            	        "/member-details/**","/update-member/**","/select-month","/collection-summary",
            	        "/add-collection-list/**","/memberwise-collection","/monthwise-collection/**",
            	        "/select-member-loan","/add-loan/**","add-loan-details/**"
            	    ).permitAll()

            	    .requestMatchers("/api/login").permitAll()
            	    .requestMatchers("/api/list","/api/memberwise-collection").hasAnyAuthority("Admin", "Member")
            	    .requestMatchers("/api/add", "/api/member/update/**").hasAuthority("Admin")
            	    .requestMatchers("/savings/add","/savings/list").hasAnyAuthority("Admin")
            	    .requestMatchers("/savings/paid-unpaid").hasAnyAuthority("Admin","Member")
            	    .requestMatchers("/api/loans/add","/api/loans/loan-types").hasAuthority("Admin")
            	    .anyRequest().authenticated()
            	)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, ex1) -> 
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
            );
 
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
