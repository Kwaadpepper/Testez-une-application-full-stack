package com.openclassrooms.starterjwt.security.jwt;

import java.util.concurrent.TimeUnit;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

public class JwtUtilsTest {

    @Test
    public void canGenerateJwtToken() {
        // Arrange
        // See: generateJwtTokenFrom

        // Act
        String output = generateJwtTokenFrom("user@example.net");

        // Assert
        Assertions.assertThat(output).isNotNull().isNotBlank()
                .as("A JWT token has to be generated");
    }

    @Test
    public void canGetUserNameFromJwtToken() {
        // Arrange
        String userName = "some.user@example.net";
        JwtUtils jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "SOMESECRET");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 250000);
        String jwtToken = generateJwtTokenFrom(userName);

        // Act
        String output = jwtUtils.getUserNameFromJwtToken(jwtToken);

        Assertions.assertThat(output).isEqualTo(userName)
                .as("Extracted user name from JWT token should be the same as the one used for its generation");
    }

    @Test
    public void canValidateJwtToken() {
        // Arrange
        String userName = "some.user@example.net";
        JwtUtils jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "SOMESECRET");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 250000);
        String jwtToken = generateJwtTokenFrom(userName);

        // Act
        Boolean output = jwtUtils.validateJwtToken(jwtToken);

        // Assert
        Assertions.assertThat(output).isEqualTo(true);
    }

    @Test
    public void canValidateWrongJwtToken() {
        // Arrange
        JwtUtils jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "SOMESECRET");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 250000);

        // Act
        Boolean output = jwtUtils.validateJwtToken("scramble");

        // Assert
        Assertions.assertThat(output).isEqualTo(false);
    }

    @Test
    public void canValidateNullJwtToken() {
        // Arrange
        JwtUtils jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "SOMESECRET");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 250000);

        // Act
        Boolean output = jwtUtils.validateJwtToken(null);

        // Assert
        Assertions.assertThat(output).isEqualTo(false);
    }

    @Test
    public void canValidateMissSignedJwtToken() {
        // Arrange
        String userName = "some.user@example.net";
        JwtUtils jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "SOMESECRET");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 250000);
        String jwtToken = generateJwtTokenFrom(userName);
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "ANOTHERSECRET");

        // Act
        Boolean output = jwtUtils.validateJwtToken(jwtToken);

        // Assert
        Assertions.assertThat(output).isEqualTo(false);
    }

    @Test
    public void canValidateOldJwtToken() throws InterruptedException {
        // Arrange
        String userName = "some.user@example.net";
        JwtUtils jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "SOMESECRET");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 0);
        String jwtToken = generateJwtTokenFrom(userName, 0);

        TimeUnit.MILLISECONDS.sleep(1000);

        // Act
        Boolean output = jwtUtils.validateJwtToken(jwtToken);

        // Assert
        Assertions.assertThat(output).isEqualTo(false);
    }

    private String generateJwtTokenFrom(String userName) {
        return generateJwtTokenFrom(userName, 250000);
    }

    private String generateJwtTokenFrom(String userName, Integer expiration) {
        // Arrange
        JwtUtils jwtUtils = new JwtUtils();
        Authentication authentication = Mockito.mock(Authentication.class);
        UserDetails userPrincipal = Mockito.mock(UserDetailsImpl.class);

        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "SOMESECRET");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", expiration);
        Mockito.when(authentication.getPrincipal()).thenReturn(userPrincipal);
        Mockito.when(userPrincipal.getUsername()).thenReturn(userName);

        // Act
        return jwtUtils.generateJwtToken(authentication);
    }
}
