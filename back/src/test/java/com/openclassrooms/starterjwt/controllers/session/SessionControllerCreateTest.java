package com.openclassrooms.starterjwt.controllers.session;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

public class SessionControllerCreateTest {
    private SessionMapper sessionMapper;
    private SessionService sessionService;
    private SessionController sessionController;

    public SessionControllerCreateTest() {
        sessionMapper = Mockito.mock(SessionMapper.class);
        sessionService = Mockito.mock(SessionService.class);
        sessionController = new SessionController(sessionService, sessionMapper);
    }

    @Test
    public void canCreateParticipation() {
        // Arrange
        SessionDto sessionDto = Mockito.mock(SessionDto.class);
        Session session = Mockito.mock(Session.class);
        Mockito.when(sessionService.create(Mockito.any(Session.class))).thenReturn(session);
        Mockito.when(sessionMapper.toEntity(Mockito.any(SessionDto.class))).thenReturn(session);

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = sessionController.create(sessionDto);

        // Act
        Mockito.verify(sessionService).create(Mockito.any(Session.class));
        Mockito.verify(sessionMapper).toEntity(Mockito.any(SessionDto.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing session participation can be created");
    }
}
