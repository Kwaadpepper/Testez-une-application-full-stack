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

public class SessionControllerFindAllTest {
    private SessionMapper sessionMapper;
    private SessionService sessionService;
    private SessionController sessionController;

    public SessionControllerFindAllTest() {
        sessionMapper = Mockito.mock(SessionMapper.class);
        sessionService = Mockito.mock(SessionService.class);
        sessionController = new SessionController(sessionService, sessionMapper);
    }

    @Test
    public void canFindAll() {
        // Arrange
        Session session = Mockito.mock(Session.class);
        SessionDto sessionDto = Mockito.mock(SessionDto.class);
        Mockito.when(sessionService.findAll()).thenReturn(List.of(session));
        Mockito.when(sessionMapper.toDto(Mockito.anyList())).thenReturn(new ArrayList<>(List.of(sessionDto)));

        // Act
        ResponseEntity<?> output = sessionController.findAll();

        // Act
        Mockito.verify(sessionService).findAll();
        Mockito.verify(sessionMapper).toDto(Mockito.anyList());
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing user can be retrieved from the controller");
    }
}
