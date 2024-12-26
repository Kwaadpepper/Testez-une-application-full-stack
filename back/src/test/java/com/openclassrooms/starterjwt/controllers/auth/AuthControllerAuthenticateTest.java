package com.openclassrooms.starterjwt.controllers.auth;

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.controllers.AuthController;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

public class AuthControllerAuthenticateTest {
    private SecurityContext securityContext;
    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;
    private JwtUtils jwtUtils;
    private UserRepository userRepository;
    private AuthController authController;

    public AuthControllerAuthenticateTest() {
        authenticationManager = Mockito.mock(AuthenticationManager.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        jwtUtils = Mockito.mock(JwtUtils.class);
        userRepository = Mockito.mock(UserRepository.class);
        authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils, userRepository);
    }

    @BeforeEach
    public void init() {
        this.securityContext = Mockito.mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void canAuthenticateUser() {
        // Arrange
        String jwt = "JWT_TOKEN";
        String email = "user@example.net";
        String password = "Som3.P4ssw0rd";
        UserDetails userDetails = getNewUserDetails();
        LoginRequest loginRequest = Mockito.mock(LoginRequest.class);
        Authentication authentication = Mockito.mock(Authentication.class);
        User user = Mockito.mock(User.class);
        Mockito.when(loginRequest.getEmail()).thenReturn(email);
        Mockito.when(loginRequest.getPassword()).thenReturn(password);
        Mockito.when(authenticationManager.authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        Mockito.doNothing().when(securityContext).setAuthentication(Mockito.any(Authentication.class));
        Mockito.when(jwtUtils.generateJwtToken(Mockito.any(Authentication.class))).thenReturn(jwt);
        Mockito.when(authentication.getPrincipal()).thenReturn(userDetails);
        Mockito.when(userRepository.findByEmail(Mockito.any(String.class))).thenReturn(Optional.of(user));
        Mockito.when(user.isAdmin()).thenReturn(false);

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = authController.authenticateUser(loginRequest);

        // Act
        Mockito.verify(authenticationManager).authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class));
        Mockito.verify(userRepository).findByEmail(Mockito.any(String.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing user account can be authenticated");
    }

    private UserDetails getNewUserDetails() {
        return new UserDetailsImpl(
                1L,
                "username",
                "firstName",
                "lastName",
                false,
                "password");
    }
}
