package com.openclassrooms.starterjwt.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

import io.jsonwebtoken.lang.Assert;

public class SessionServiceTest {
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private SessionService sessionService;

    public SessionServiceTest() {
        this.sessionRepository = Mockito.mock(SessionRepository.class);
        this.userRepository = Mockito.mock(UserRepository.class);
    }

    @BeforeEach
    public void init() {
        sessionService = new SessionService(sessionRepository, userRepository);
    }

    @Test
    public void canCreateSession() {
        // Arrange
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

    @Test
    public void canParticipate() {
        // Arrange
        Session session = new Session();
        List<User> userList = new ArrayList<>();
        session.setUsers(userList);
        User user = getNewUser();
        Long sessionId = 3L;
        Long userId = 4L;

        Mockito.when(user.getId()).thenReturn(userId);
        Mockito.when(sessionRepository.findById(Mockito.any(Long.class)))
                .thenReturn(Optional.of(session));
        Mockito.when(userRepository.findById(Mockito.any(Long.class))).thenReturn(Optional.of(user));
        Mockito.when(sessionRepository.save(session)).thenReturn(session);

        // Act
        sessionService.participate(sessionId, userId);

        // Assert
        Mockito.verify(sessionRepository).save(Mockito.any(Session.class));
        Assertions.assertThat(session.getUsers()).size().isEqualTo(1)
                .as("Participation should add user to the participation list");
    }

    @Test
    public void cannotParticipateTwice() {
        // Assert
        Assertions.assertThatCode(() -> {
            // Arrange
            Session session = new Session();
            List<User> userList = new ArrayList<>();
            User user = getNewUser();
            Long sessionId = 3L;
            Long userId = 4L;
            userList.add(user);
            session.setUsers(userList);

            Mockito.when(user.getId()).thenReturn(userId);
            Mockito.when(sessionRepository.findById(Mockito.any(Long.class)))
                    .thenReturn(Optional.of(session));
            Mockito.when(userRepository.findById(Mockito.any(Long.class))).thenReturn(Optional.of(user));
            Mockito.when(sessionRepository.save(session)).thenReturn(session);

            // Act
            sessionService.participate(sessionId, userId);
        }).isInstanceOf(BadRequestException.class)
                .as("A user that already participate should not be able to participate again");
    }

    @Test
    public void canCancelParticipation() {
        // Arrange
        Session session = new Session();
        User user = getNewUser();
        User anotherUser = getNewUser();
        session.setUsers(List.of(user, anotherUser));

        Long sessionId = 3L;
        Long userId = 4L;
        Long anotherUserId = 5L;
        Mockito.when(sessionRepository.findById(Mockito.any(Long.class)))
                .thenReturn(Optional.of(session));
        Mockito.when(sessionRepository.save(Mockito.any(Session.class))).thenReturn(session);
        Mockito.when(user.getId()).thenReturn(userId);
        Mockito.when(anotherUser.getId()).thenReturn(anotherUserId);

        // Act
        sessionService.noLongerParticipate(sessionId, userId);

        // Assert
        Mockito.verify(sessionRepository).save(Mockito.any(Session.class));
        Assertions.assertThat(session.getUsers()).size().isEqualTo(1)
                .as("Cancelling participation should remove the use from the session");
    }

    @Test
    public void canCancelParticipationIfNotParticipating() {
        // Assert
        Assertions.assertThatCode(() -> {
            // Arrange
            Session session = new Session();
            session.setUsers(List.of());

            Long sessionId = 3L;
            Long userId = 4L;
            Mockito.when(sessionRepository.findById(Mockito.any(Long.class)))
                    .thenReturn(Optional.of(session));

            // Act
            sessionService.noLongerParticipate(sessionId, userId);
        }).isInstanceOf(BadRequestException.class)
                .as("A user that does not participate cannot cancel his participation");
    }

    private User getNewUser() {
        return Mockito.mock(User.class);
    }

    private Session getNewSession() {
        return Mockito.mock(Session.class);
    }
}
