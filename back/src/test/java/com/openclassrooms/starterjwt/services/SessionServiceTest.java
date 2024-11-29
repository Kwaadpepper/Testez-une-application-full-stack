package com.openclassrooms.starterjwt.services;

import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

import io.jsonwebtoken.lang.Assert;

public class SessionServiceTest {
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public SessionServiceTest() {
        this.sessionRepository = Mockito.mock(SessionRepository.class);
        this.userRepository = Mockito.mock(UserRepository.class);
    }

    @Test
    public void canCreateSession() {
        // Arrange
        SessionService sessionService = new SessionService(sessionRepository, userRepository);
        Session session = getNewSession();
        Mockito.when(sessionRepository.save(Mockito.any(Session.class)))
                .thenReturn(session);

        // Act
        sessionService.create(session);

        // Assert
        Mockito.verify(sessionRepository).save(Mockito.any(Session.class));
    }

    @Test
    public void canDeleteSession() {
        // Arrange
        SessionService sessionService = new SessionService(sessionRepository, userRepository);
        Session session = getNewSession();
        Mockito.doNothing().when(sessionRepository).deleteById(Mockito.any(Long.class));

        // Act
        sessionService.delete(session.getId());

        // Assert
        Mockito.verify(sessionRepository).deleteById(Mockito.any(Long.class));
    }

    @Test
    public void canFindAll() {
        // Arrange
        SessionService sessionService = new SessionService(sessionRepository, userRepository);
        Session session = getNewSession();
        Mockito.when(sessionRepository.findAll()).thenReturn(List.of(session));

        // Act
        final List<Session> output = sessionService.findAll();

        // Assert
        Mockito.verify(sessionRepository).findAll();
        Assertions.assertThat(output)
                .as("Check SessionService findAll returns a list of sessions that is given by the repository")
                .hasSize(1)
                .first()
                .isEqualTo(session);
    }

    @Test
    public void canGetById() {
        // Arrange
        SessionService sessionService = new SessionService(sessionRepository, userRepository);
        Session session = getNewSession();
        Mockito.when(sessionRepository.findById(Mockito.any(Long.class)))
                .thenReturn(Optional.of(session));

        // Act
        final Session output = sessionService.getById(session.getId());

        // Assert
        Mockito.verify(sessionRepository).findById(Mockito.any(Long.class));
        Assertions.assertThat(output)
                .as("The session found on the repository should be returned")
                .isEqualTo(session);
    }

    @Test
    public void canMissUserWhenGetById() {
        // Arrange
        SessionService sessionService = new SessionService(sessionRepository, userRepository);
        Session session = getNewSession();
        Mockito.when(sessionRepository.findById(Mockito.any(Long.class)))
                .thenReturn(Optional.empty());

        // Act
        final Session output = sessionService.getById(session.getId());

        // Assert
        Mockito.verify(sessionRepository).findById(Mockito.any(Long.class));
        Assert.isNull(output, "Null should be returned if the teacher is missing");
        Assertions.assertThat(output)
                .as("Null should be returned if the teacher is missing")
                .isNull();
    }

    @Test
    public void canUpdateSession() {
        // Arrange
        SessionService sessionService = new SessionService(sessionRepository, userRepository);
        Session session = Mockito.spy(new Session());
        Mockito.when(sessionRepository.save(Mockito.any(Session.class))).thenReturn(session);
        Mockito.doCallRealMethod().when(session).setId(Mockito.any(Long.class));
        final Long newId = 3L;

        // Act
        final Session output = sessionService.update(newId, session);

        // Assert
        Mockito.verify(session).setId(Mockito.any(Long.class));
        Mockito.verify(sessionRepository).save(Mockito.any(Session.class));
        Assertions.assertThat(output)
                .as("The session updated has a correct id")
                .isEqualTo(session)
                .returns(newId, Session::getId);
    }

    private Session getNewSession() {
        return Mockito.mock(Session.class);
    }
}
