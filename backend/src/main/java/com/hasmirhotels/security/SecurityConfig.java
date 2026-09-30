package com.hasmirhotels.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Role names exactly as stored in the "role" claim of issued JWTs.
    private static final String ADMIN = "ADMIN";
    private static final String MANAGER = "MANAGER";
    private static final String SECRETARY = "SECRETARY";
    private static final String ACCOUNTANT = "ACCOUNTANT";
    private static final String HOUSEKEEPER = "HOUSEKEEPER";
    private static final String HOUSEKEEPING_STAFF = "HOUSEKEEPING_STAFF";
    private static final String MAINTENANCE = "MAINTENANCE";
    private static final String MAINTENANCE_STAFF = "MAINTENANCE_STAFF";
    private static final String GUEST = "GUEST";

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // ---------- Public endpoints ----------
                .requestMatchers("/error").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/guest-auth/login", "/api/guest-auth/register").permitAll()
                .requestMatchers("/api/visitor/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/rooms", "/api/rooms/**").permitAll()   // public room browsing
                .requestMatchers(HttpMethod.GET, "/api/reservations/track/**").permitAll()    // public booking lookup
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()                 // public contact form (controller pending)

                // ---------- Admin only ----------
                .requestMatchers("/api/audit/**").hasRole(ADMIN)
                .requestMatchers("/api/settings/**").hasRole(ADMIN)
                .requestMatchers("/api/auth/register").hasRole(ADMIN)
                .requestMatchers("/api/auth/users/**").hasRole(ADMIN)
                .requestMatchers("/api/auth/me").authenticated()

                // ---------- Rooms ----------
                .requestMatchers(HttpMethod.POST, "/api/rooms").hasAnyRole(ADMIN, MANAGER)
                .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasAnyRole(ADMIN, MANAGER, SECRETARY)
                .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").hasAnyRole(ADMIN, MANAGER)

                // ---------- Reservations ----------
                .requestMatchers(HttpMethod.POST, "/api/reservations").hasAnyRole(ADMIN, MANAGER, SECRETARY)
                .requestMatchers(HttpMethod.PUT, "/api/reservations/**").hasAnyRole(ADMIN, MANAGER, SECRETARY)
                .requestMatchers(HttpMethod.DELETE, "/api/reservations/**").hasAnyRole(ADMIN, MANAGER)

                // ---------- Guests ----------
                .requestMatchers("/api/guests/me", "/api/guests/me/**")
                        .hasAnyRole(ADMIN, MANAGER, SECRETARY, GUEST)
                .requestMatchers(HttpMethod.GET, "/api/guests", "/api/guests/**")
                        .hasAnyRole(ADMIN, MANAGER, SECRETARY)
                .requestMatchers(HttpMethod.POST, "/api/guests").hasAnyRole(ADMIN, MANAGER, SECRETARY)
                .requestMatchers(HttpMethod.PUT, "/api/guests/**").hasAnyRole(ADMIN, MANAGER, SECRETARY)
                .requestMatchers(HttpMethod.DELETE, "/api/guests/**").hasAnyRole(ADMIN, MANAGER)

                // ---------- Payments ----------
                .requestMatchers(HttpMethod.POST, "/api/payments").hasAnyRole(ADMIN, ACCOUNTANT, SECRETARY)
                .requestMatchers(HttpMethod.PUT, "/api/payments/**").hasAnyRole(ADMIN, ACCOUNTANT, SECRETARY)
                .requestMatchers(HttpMethod.DELETE, "/api/payments/**").hasAnyRole(ADMIN, ACCOUNTANT)
                .requestMatchers(HttpMethod.GET, "/api/payments", "/api/payments/**")
                        .hasAnyRole(ADMIN, MANAGER, ACCOUNTANT, SECRETARY)

                // ---------- Expenses ----------
                .requestMatchers(HttpMethod.POST, "/api/expenses").hasAnyRole(ADMIN, ACCOUNTANT)
                .requestMatchers(HttpMethod.PUT, "/api/expenses/**").hasAnyRole(ADMIN, ACCOUNTANT)
                .requestMatchers(HttpMethod.DELETE, "/api/expenses/**").hasAnyRole(ADMIN, ACCOUNTANT)
                .requestMatchers(HttpMethod.GET, "/api/expenses", "/api/expenses/**")
                        .hasAnyRole(ADMIN, MANAGER, ACCOUNTANT)

                // ---------- Invoices ----------
                .requestMatchers(HttpMethod.POST, "/api/invoices").hasAnyRole(ADMIN, ACCOUNTANT)
                .requestMatchers(HttpMethod.PUT, "/api/invoices/**").hasAnyRole(ADMIN, ACCOUNTANT)
                .requestMatchers(HttpMethod.DELETE, "/api/invoices/**").hasAnyRole(ADMIN, ACCOUNTANT)
                .requestMatchers(HttpMethod.GET, "/api/invoices", "/api/invoices/**")
                        .hasAnyRole(ADMIN, MANAGER, ACCOUNTANT)

                // ---------- Housekeeping ----------
                .requestMatchers("/api/housekeeping/**")
                        .hasAnyRole(ADMIN, MANAGER, HOUSEKEEPER, HOUSEKEEPING_STAFF)

                // ---------- Maintenance ----------
                .requestMatchers("/api/maintenance/**")
                        .hasAnyRole(ADMIN, MANAGER, MAINTENANCE, MAINTENANCE_STAFF)

                // ---------- Staff management ----------
                .requestMatchers("/api/staff/**").hasAnyRole(ADMIN, MANAGER)

                // ---------- Everything else under /api requires a valid token ----------
                .requestMatchers("/api/**").authenticated()

                .anyRequest().denyAll()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json");
                    response.getWriter().write(
                            "{\"success\":false,\"message\":\"Unauthorized: authentication required\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.setContentType("application/json");
                    response.getWriter().write(
                            "{\"success\":false,\"message\":\"Forbidden: insufficient permissions\"}");
                })
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
