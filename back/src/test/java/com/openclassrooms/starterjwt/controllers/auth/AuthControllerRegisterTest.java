package com.openclassrooms.starterjwt.controllers.auth;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.controllers.AuthController;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;

public class AuthControllerRegisterTest {
    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;
    private JwtUtils jwtUtils;
    private UserRepository userRepository;
    private AuthController authController;

    public AuthControllerRegisterTest() {
        authenticationManager = Mockito.mock(AuthenticationManager.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        jwtUtils = Mockito.mock(JwtUtils.class);
        userRepository = Mockito.mock(UserRepository.class);
        authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils, userRepository);
    }

    @Test
    public void canRegisterUser() {
        // Arrange
        String email = "user@example.net";
        String firstName = "firstName";
        String lastName = "lastName";
        String password = "Som3.P4ssw0rd";
        SignupRequest signupRequest = Mockito.mock(SignupRequest.class);
        Mockito.when(signupRequest.getEmail()).thenReturn(email);
        Mockito.when(signupRequest.getFirstName()).thenReturn(firstName);
        Mockito.when(signupRequest.getLastName()).thenReturn(lastName);
        Mockito.when(signupRequest.getPassword()).thenReturn(password);
        Mockito.when(passwordEncoder.encode(Mockito.any(CharSequence.class))).thenReturn(password);
        Mockito.when(userRepository.existsByEmail(Mockito.any(String.class))).thenReturn(false);
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(Mockito.mock(User.class));

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = authController.registerUser(signupRequest);

        // Act
        Mockito.verify(userRepository).existsByEmail(Mockito.any(String.class));
        Mockito.verify(userRepository).save(Mockito.any(User.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An new user can be registered");
    }

    @Test
    public void cannotRegisterUserIfAlreadyExists() {
        // Arrange
        String email = "user@example.net";
        String firstName = "firstName";
        String lastName = "lastName";
        String password = "Som3.P4ssw0rd";
        SignupRequest signupRequest = Mockito.mock(SignupRequest.class);
        Mockito.when(signupRequest.getEmail()).thenReturn(email);
        Mockito.when(signupRequest.getFirstName()).thenReturn(firstName);
        Mockito.when(signupRequest.getLastName()).thenReturn(lastName);
        Mockito.when(signupRequest.getPassword()).thenReturn(password);
        Mockito.when(passwordEncoder.encode(Mockito.any(CharSequence.class))).thenReturn(password);
        Mockito.when(userRepository.existsByEmail(Mockito.any(String.class))).thenReturn(true);

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = authController.registerUser(signupRequest);

        // Act
        Mockito.verify(userRepository).existsByEmail(Mockito.any(String.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(400)
                .as("An new user cannot be registered if it already exists");
    }
}
