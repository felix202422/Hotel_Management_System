package com.fizzohotels.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Fails application startup with a clear message when required configuration
 * is missing. Runs via META-INF/spring.factories before any bean is created,
 * so it fires before Hikari/JWT touch the missing values.
 */
public class RequiredConfigEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public int getOrder() {
        // Run after the config-data (.env import) phase so values are already loaded.
        return Ordered.LOWEST_PRECEDENCE;
    }

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        List<String> problems = new ArrayList<>();

        String dbPassword = environment.getProperty("spring.datasource.password");
        if (isBlank(dbPassword)) {
            problems.add("DB_PASSWORD is not set (database password)");
        }

        String jwtSecret = environment.getProperty("app.jwt.secret");
        if (isBlank(jwtSecret)) {
            problems.add("JWT_SECRET is not set (JWT signing key)");
        } else if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            problems.add("JWT_SECRET must be at least 32 characters for HS256 (generate one with: openssl rand -base64 48)");
        }

        if (!problems.isEmpty()) {
            throw new IllegalStateException(
                    "Application startup aborted — missing required configuration:\n  - "
                            + String.join("\n  - ", problems)
                            + "\nCopy backend/.env.example to backend/.env and fill in real values, "
                            + "or set the environment variables directly.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
