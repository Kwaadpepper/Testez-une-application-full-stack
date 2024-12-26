package com.openclassrooms.starterjwt.security.services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

public class UserDetailsServiceTest {
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    public UserDetailsServiceTest() {
        this.userRepository = Mockito.mock(UserRepository.class);
        this.userDetailsService = new UserDetailsServiceImpl(userRepository);
    }

    @Test
    public void canLoadUserByUsername() {
        Assertions.assertThatCode(() -> {
            // Arrange
            User user = getNewUser();
            String userName = user.getEmail();
            Mockito.when(userRepository.findByEmail(Mockito.any(String.class))).thenReturn(Optional.of(user));

            // Act
            UserDetails output = userDetailsService.loadUserByUsername(userName);

            // Assert
            Assertions.assertThat(output).isNotNull();
        }).doesNotThrowAnyException();
    }

    @Test
    public void cannotLoadUserByUsernameIfMissing() {
        Assertions.assertThatCode(() -> {
            // Arrange
            User user = getNewUser();
            String userName = user.getEmail();
            Mockito.when(userRepository.findByEmail(Mockito.any(String.class))).thenReturn(Optional.empty());

            // Act
            UserDetails output = userDetailsService.loadUserByUsername(userName);

            // Assert
            Assertions.assertThat(output).isNotNull();
        }).isInstanceOf(UsernameNotFoundException.class)
                .as("Exception is thrown when the user is not found");
    }

    private User getNewUser() {
        return new User(
                1L,
                "user@example.net",
                "LastName",
                "FirstName",
                "password",
                false,
                LocalDateTime.now(),
                LocalDateTime.now());
    }
}
