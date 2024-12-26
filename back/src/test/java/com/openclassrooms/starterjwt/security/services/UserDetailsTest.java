package com.openclassrooms.starterjwt.security.services;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

public class UserDetailsTest {

    public void canInstanciateUserDetails() {
        Assertions.assertThatNoException().isThrownBy(() -> {
            // Arrange
            Long userID = 1L;
            String userName = "user@example.net";
            String firstName = "firstName";
            String lastName = "lastName";
            Boolean isAdmin = false;
            String password = "password";

            // Act
            new UserDetailsImpl(
                    userID,
                    userName,
                    firstName,
                    lastName,
                    isAdmin,
                    password);
        });
    }

    public void canGetProperties() {
        // Arrange
        Long userID = 1L;
        String userName = "user@example.net";
        String firstName = "firstName";
        String lastName = "lastName";
        Boolean isAdmin = false;
        String password = "password";
        UserDetails userDetails = new UserDetailsImpl(
                userID,
                userName,
                firstName,
                lastName,
                isAdmin,
                password);

        // Assert
        Assertions.assertThat(userDetails).extracting(UserDetails::getUsername).isEqualTo(userName);
        Assertions.assertThat(userDetails).extracting(UserDetails::getPassword).isEqualTo(password);
    }

    @Test
    public void canGetCheckEquality() {
        // Arrange
        Long userID = 1L;
        String userName = "user@example.net";
        String firstName = "firstName";
        String lastName = "lastName";
        Boolean isAdmin = false;
        String password = "password";
        UserDetails userDetails = new UserDetailsImpl(
                userID,
                userName,
                firstName,
                lastName,
                isAdmin,
                password);
        UserDetails anotherUserDetails = new UserDetailsImpl(
                userID,
                userName,
                firstName,
                lastName,
                isAdmin,
                password);
        UserDetails andAnotherUserDetails = new UserDetailsImpl(
                2L,
                userName,
                firstName,
                lastName,
                isAdmin,
                password);

        // Assert
        Assertions.assertThat(userDetails).isEqualTo(userDetails);
        Assertions.assertThat(userDetails).isEqualTo(anotherUserDetails);
        Assertions.assertThat(userDetails).isNotEqualTo(andAnotherUserDetails);
        Assertions.assertThat(userDetails).isNotEqualTo(null);
    }
}
