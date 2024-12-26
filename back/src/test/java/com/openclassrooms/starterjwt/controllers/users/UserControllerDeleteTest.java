package com.openclassrooms.starterjwt.controllers.users;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

public class UserControllerDeleteTest {
    private SecurityContext securityContext;
    private UserMapper userMapper;
    private UserService userService;
    private UserController userController;

    public UserControllerDeleteTest() {
        userMapper = Mockito.mock(UserMapper.class);
        userService = Mockito.mock(UserService.class);
        userController = new UserController(userService, userMapper);
    }

    @BeforeEach
    public void init() {
        this.securityContext = Mockito.mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void canDeleteUser() {
        // Arrange
        String userID = "1";
        User user = Mockito.mock(User.class);
        UserDetails userDetails = Mockito.mock(UserDetails.class);
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(userService.findById(Mockito.any(Long.class))).thenReturn(user);
        Mockito.when(securityContext.getAuthentication()).thenReturn(auth);
        Mockito.when(auth.getPrincipal()).thenReturn(userDetails);
        Mockito.when(user.getEmail()).thenReturn("user@example.net");
        Mockito.when(userDetails.getUsername()).thenReturn("user@example.net");

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = userController.save(userID);

        // Act
        Mockito.verify(userService).findById(Mockito.any(Long.class));
        Mockito.verify(securityContext).getAuthentication();
        Mockito.verify(auth).getPrincipal();
        Mockito.verify(user).getEmail();
        Mockito.verify(userDetails).getUsername();
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing user can be retrieved from the controller");
    }

    @Test
    public void userCannotDeleteInexistingAccount() {
        // Arrange
        String userID = "1";
        Mockito.when(userService.findById(Mockito.any(Long.class))).thenReturn(null);

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = userController.save(userID);

        // Act
        Mockito.verify(userService).findById(Mockito.any(Long.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(404)
                .as("A user cannot delete a missing user account");
    }

    @Test
    public void userCannotDeleteSomeoneElsesAccount() {
        // Arrange
        String userID = "1";
        User user = Mockito.mock(User.class);
        UserDetails userDetails = Mockito.mock(UserDetails.class);
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(userService.findById(Mockito.any(Long.class))).thenReturn(user);
        Mockito.when(securityContext.getAuthentication()).thenReturn(auth);
        Mockito.when(auth.getPrincipal()).thenReturn(userDetails);
        Mockito.when(user.getEmail()).thenReturn("user@example.net");
        Mockito.when(userDetails.getUsername()).thenReturn("anotheruser@example.net");

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = userController.save(userID);

        // Act
        Mockito.verify(userService).findById(Mockito.any(Long.class));
        Mockito.verify(securityContext).getAuthentication();
        Mockito.verify(auth).getPrincipal();
        Mockito.verify(user).getEmail();
        Mockito.verify(userDetails).getUsername();
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(401)
                .as("A user cannot delete another user account");
    }

    @Test
    public void canRemoveUserWouldBeRejectedOnBadInput() {
        // Arrange
        String userID = "1invalidID";

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = userController.save(userID);

        // Act
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(400)
                .as("A bad request is given if the asked user id is invalid");
    }
}
