package com.openclassrooms.starterjwt.mapper;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;

@ActiveProfiles("test")
@SpringBootTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
public class SessionMapperTest {

    @Autowired
    private SessionMapper sessionMapper;

    @Test
    public void canConvertToEntityList() {
        // Arrange
        Session session = getNewSession();
        SessionDto sessionDto = getNewSessionDto();
        List<SessionDto> sessionDtoList = List.of(sessionDto);

        // Act
        List<Session> output = sessionMapper.toEntity(sessionDtoList);

        // Assert
        Assertions.assertThat(output.get(0))
                .returns(session.getId(), Assertions.from(Session::getId))
                .returns(session.getName(), Assertions.from(Session::getName))
                .returns(session.getTeacher(), Assertions.from(Session::getTeacher))
                .returns(session.getDescription(), Assertions.from(Session::getDescription));
    }

    @Test
    public void canConvertToEntityListOfNull() {
        // Arrange
        List<SessionDto> sessionDtoList = null;

        // Act
        List<Session> output = sessionMapper.toEntity(sessionDtoList);

        // Assert
        Assertions.assertThat(output).isNull();
    }

    @Test
    public void canConvertToEntityOfNull() {
        // Arrange
        SessionDto sessionDto = null;

        // Act
        Session output = sessionMapper.toEntity(sessionDto);

        // Assert
        Assertions.assertThat(output).isNull();
    }

    @Test
    public void canConvertFromEntityList() {
        // Arrange
        Session session = getNewSession();
        SessionDto sessionDto = getNewSessionDto();
        List<Session> sessionList = List.of(session);

        // Act
        List<SessionDto> output = sessionMapper.toDto(sessionList);

        // Assert
        Assertions.assertThat(output.get(0))
                .returns(sessionDto.getId(), Assertions.from(SessionDto::getId))
                .returns(sessionDto.getName(), Assertions.from(SessionDto::getName))
                .returns(sessionDto.getTeacher_id(), Assertions.from(SessionDto::getTeacher_id))
                .returns(sessionDto.getDescription(), Assertions.from(SessionDto::getDescription));
    }

    @Test
    public void canConvertFromNullEntityList() {
        // Arrange
        List<Session> sessionList = null;

        // Act
        List<SessionDto> output = sessionMapper.toDto(sessionList);

        // Assert
        Assertions.assertThat(output).isNull();
    }

    @Test
    public void canConvertToDtoOfNullable() {
        // Arrange
        Session session = null;

        // Act
        SessionDto output = sessionMapper.toDto(session);

        // Assert
        Assertions.assertThat(output).isNull();
    }

    private SessionDto getNewSessionDto() {
        return new SessionDto(
                1L,
                "Super session",
                new Date(),
                1L,
                "Super description",
                List.of(1L, 2L),
                LocalDateTime.now(),
                LocalDateTime.now());
    }

    private Session getNewSession() {
        return new Session(
                1L,
                "Super session",
                new Date(),
                "Super description",
                getNewTeacher(1L),
                List.of(getNewUser(1L)),
                LocalDateTime.now(),
                LocalDateTime.now());
    }

    private Teacher getNewTeacher(Long id) {
        return new Teacher(
                id,
                "LastName",
                "FirstName",
                LocalDateTime.now(),
                LocalDateTime.now());
    }

    private User getNewUser(Long id) {
        return new User(
                id,
                "user@example.net",
                "LastName",
                "FirstName",
                "password",
                false,
                LocalDateTime.now(),
                LocalDateTime.now());
    }
}
