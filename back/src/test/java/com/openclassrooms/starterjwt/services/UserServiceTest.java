package com.openclassrooms.starterjwt.services;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

import io.jsonwebtoken.lang.Assert;

public class UserServiceTest {
    private final UserRepository userRepository;

    public UserServiceTest() {
        this.userRepository = Mockito.mock(UserRepository.class);
    }

    @Test
    public void canFindById() {
        // Arrange
        UserService userService = new UserService(userRepository);
        User user = getNewUser();
        Mockito.when(userRepository.findById(Mockito.any(Long.class)))
                .thenReturn(Optional.of(user));

        // Act
        final User output = userService.findById(user.getId());

        // Assert
        Mockito.verify(userRepository).findById(Mockito.any(Long.class));
        Assert.isTrue(output.equals(user), "The user found on the repository should be returned");
    }

    @Test
    public void canMissUserWhenFindById() {
        // Arrange
        UserService userService = new UserService(userRepository);
        User user = getNewUser();
        Mockito.when(userRepository.findById(Mockito.any(Long.class)))
                .thenReturn(Optional.empty());

        // Act
        final User output = userService.findById(user.getId());

        // Assert
        Mockito.verify(userRepository).findById(Mockito.any(Long.class));
        Assert.isNull(output, "Null should be returned if the user is missing");
    }

    @Test
    public void canDeleteUser() {
        // Arrange
        UserService userService = new UserService(userRepository);
        User user = getNewUser();
        Mockito.doNothing().when(userRepository).deleteById(Mockito.any(Long.class));

        // Act
        userService.delete(user.getId());

        // Assert
        Mockito.verify(userRepository).deleteById(Mockito.any(Long.class));
    }

    private User getNewUser() {
        return Mockito.mock(User.class);
    }
}
