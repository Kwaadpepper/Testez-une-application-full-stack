package com.openclassrooms.starterjwt.controllers.users;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

public class UserControllerFindByIdTest {
    private UserMapper userMapper;
    private UserService userService;
    private UserController userController;

    public UserControllerFindByIdTest() {
        userMapper = Mockito.mock(UserMapper.class);
        userService = Mockito.mock(UserService.class);
        userController = new UserController(userService, userMapper);
    }

    @Test
    public void canFindUserById() {
        // Arrange
        String userID = "1";
        User user = Mockito.mock(User.class);
        UserDto userDto = Mockito.mock(UserDto.class);
        Mockito.when(userService.findById(Mockito.any(Long.class))).thenReturn(user);
        Mockito.when(userMapper.toDto(Mockito.any(User.class))).thenReturn(userDto);

        // Act
        ResponseEntity<?> output = userController.findById(userID);

        // Act
        Mockito.verify(userService).findById(Mockito.any(Long.class));
        Mockito.verify(userMapper).toDto(Mockito.any(User.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing user can be retrieved from the controller");
    }

    @Test
    public void canFindUserByIdCanBeMissing() {
        // Arrange
        String userID = "1";
        Mockito.when(userService.findById(Mockito.any(Long.class))).thenReturn(null);

        // Act
        ResponseEntity<?> output = userController.findById(userID);

        // Act
        Mockito.verify(userService).findById(Mockito.any(Long.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(404)
                .as("A bad request is given if the user is missing");
    }

    @Test
    public void canFindUserByIdWouldBeRejectedOnBadInput() {
        // Arrange
        String userID = "badNumber";

        // Act
        ResponseEntity<?> output = userController.findById(userID);

        // Act
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(400)
                .as("A bad request is given if the asked user id is invalid");
    }
}
