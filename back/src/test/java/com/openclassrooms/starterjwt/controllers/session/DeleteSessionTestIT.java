package com.openclassrooms.starterjwt.controllers.session;

import org.assertj.core.api.Assertions;
import org.json.JSONException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.services.SessionService;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DeleteSessionTestIT {

    private static final String BASE_URL = "/api/session";

    @Autowired
    private SessionService sessionService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @LocalServerPort
    private int port;

    String jwt;

    @BeforeEach
    public void init() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = this.port;

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("yoga@studio.com", "password"));
        jwt = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    void canDeleteSessionFromEndpoint() throws JSONException {
        Session session = sessionService.getById(2L);
        Assertions.assertThat(session).isNotNull();

        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().delete(BASE_URL + "/2")
                .then()
                .log().status()
                .log().body()
                .statusCode(200);

        session = sessionService.getById(2L);
        Assertions.assertThat(session).isNull();
    }

    @Test
    void cannotDeleteSessionFromEndpointThatDoesNotExists() throws JSONException {
        Long sessionId = 999999L;
        Session session = sessionService.getById(sessionId);
        Assertions.assertThat(session).isNull();

        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().delete(BASE_URL + "/" + sessionId)
                .then()
                .log().status()
                .log().body()
                .statusCode(404);
    }

    @Test
    void cannotDeleteSessionFromEndpointWithWrongId() throws JSONException {
        String sessionId = "Not an Id";

        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().delete(BASE_URL + "/" + sessionId)
                .then()
                .log().status()
                .log().body()
                .statusCode(400);
    }
}
