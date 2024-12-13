package com.openclassrooms.starterjwt.controllers.session;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

public class SessionControllerDeleteTest {
    private SessionMapper sessionMapper;
    private SessionService sessionService;
    private SessionController sessionController;

    public SessionControllerDeleteTest() {
        sessionMapper = Mockito.mock(SessionMapper.class);
        sessionService = Mockito.mock(SessionService.class);
        sessionController = new SessionController(sessionService, sessionMapper);
    }

    @Test
    public void canDeleteParticipation() {
        // Arrange
        String sessionID = "1";
        Session session = Mockito.mock(Session.class);
        Mockito.when(sessionService.getById(Mockito.any(Long.class))).thenReturn(session);
        Mockito.doNothing().when(sessionService).delete(Mockito.any(Long.class));

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = sessionController.save(sessionID);

        // Act
        Mockito.verify(sessionService).getById(Mockito.any(Long.class));
        Mockito.verify(sessionService).delete(Mockito.any(Long.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing session participation can be deleted");
    }

    @Test
    public void cannotDeleteParticipationIfDoesNotExists() {
        // Arrange
        String sessionID = "1";
        Mockito.when(sessionService.getById(Mockito.any(Long.class))).thenReturn(null);

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = sessionController.save(sessionID);

        // Act
        Mockito.verify(sessionService).getById(Mockito.any(Long.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(404)
                .as("An existing session participation cannot be deleted if it does not exist");
    }

    @Test
    public void cannotDeleteParticipationOnBadInput() {
        // Arrange
        String sessionID = "badID";

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = sessionController.save(sessionID);

        // Act
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(400)
                .as("An existing session participation cannot be deleted with bad Id");
    }
}
