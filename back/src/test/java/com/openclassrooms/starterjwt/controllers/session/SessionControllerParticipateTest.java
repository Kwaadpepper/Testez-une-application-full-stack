package com.openclassrooms.starterjwt.controllers.session;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.services.SessionService;

public class SessionControllerParticipateTest {
    private SessionMapper sessionMapper;
    private SessionService sessionService;
    private SessionController sessionController;

    public SessionControllerParticipateTest() {
        sessionMapper = Mockito.mock(SessionMapper.class);
        sessionService = Mockito.mock(SessionService.class);
        sessionController = new SessionController(sessionService, sessionMapper);
    }

    @Test
    public void canCancelParticipation() {
        // Arrange
        String sessionID = "1";
        String userID = "2";
        Mockito.doNothing().when(sessionService).participate(Mockito.any(Long.class), Mockito.any(Long.class));

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = sessionController.participate(sessionID, userID);

        // Act

        Mockito.doNothing().when(sessionService).participate(Mockito.any(Long.class), Mockito.any(Long.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing session participation can be suscribed");
    }

    @Test
    public void cannotParticipateOnBadInput() {
        // Arrange
        String sessionID = "badId";
        String userID = "2";

        // Act
        // Oups wrong method name from the original dev..
        ResponseEntity<?> output = sessionController.participate(sessionID, userID);

        // Act
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(400)
                .as("An existing session participation cannot be suscribed on bad user input");
    }
}
