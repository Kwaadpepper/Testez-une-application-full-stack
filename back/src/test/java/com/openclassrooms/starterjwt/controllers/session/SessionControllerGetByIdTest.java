package com.openclassrooms.starterjwt.controllers.session;

import java.util.ArrayList;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

public class SessionControllerGetByIdTest {
    private SessionMapper sessionMapper;
    private SessionService sessionService;
    private SessionController sessionController;

    public SessionControllerGetByIdTest() {
        sessionMapper = Mockito.mock(SessionMapper.class);
        sessionService = Mockito.mock(SessionService.class);
        sessionController = new SessionController(sessionService, sessionMapper);
    }

    @Test
    public void canFindSessionById() {
        // Arrange
        String sessionID = "1";
        Session session = Mockito.mock(Session.class);
        SessionDto sessionDto = Mockito.mock(SessionDto.class);
        Mockito.when(sessionService.getById(Mockito.any(Long.class))).thenReturn(session);
        Mockito.when(sessionMapper.toDto(Mockito.anyList())).thenReturn(new ArrayList<>(List.of(sessionDto)));

        // Act
        ResponseEntity<?> output = sessionController.findById(sessionID);

        // Act
        Mockito.verify(sessionService).getById(Mockito.any(Long.class));
        Mockito.verify(sessionMapper).toDto(Mockito.any(Session.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing user can be retrieved from the controller");
    }

    @Test
    public void canFindSessionByIdCanBeMissing() {
        // Arrange
        String sessionID = "1";
        Mockito.when(sessionService.getById(Mockito.any(Long.class))).thenReturn(null);

        // Act
        ResponseEntity<?> output = sessionController.findById(sessionID);

        // Act
        Mockito.verify(sessionService).getById(Mockito.any(Long.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(404)
                .as("A bad request is given if the session is missing");
    }

    @Test
    public void canFindSessionByIdWouldBeRejectedOnBadInput() {
        // Arrange
        String sessionID = "badNumber";

        // Act
        ResponseEntity<?> output = sessionController.findById(sessionID);

        // Act
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(400)
                .as("A bad request is given if the asked session id is invalid");
    }
}
