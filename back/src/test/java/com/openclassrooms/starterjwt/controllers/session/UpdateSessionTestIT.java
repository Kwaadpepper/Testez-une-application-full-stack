package com.openclassrooms.starterjwt.controllers.session;

import java.text.SimpleDateFormat;

import org.assertj.core.api.Assertions;
import org.hamcrest.Matchers;
import org.json.JSONException;
import org.json.JSONObject;
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
public class UpdateSessionTestIT {

    private static final String BASE_URL = "/api/session";

    @Autowired
    private SessionService sessionService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @LocalServerPort
    private int port;

    private String jwt;

    @BeforeEach
    public void init() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = this.port;

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("yoga@studio.com", "password"));
        jwt = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    void canUpdateSessionFromEndpoint() throws JSONException {
        // Arrange
        Long sessionId = 3L;
        Session session = sessionService.getById(sessionId);
        Assertions.assertThat(session).isNotNull();
        String newSessionName = "newSessionName";

        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .body(
                        (new JSONObject())
                                .put("name", newSessionName)
                                .put("description", session.getDescription())
                                .put("date", new SimpleDateFormat("yyyy-MM-dd").format(session.getDate()))
                                .put("teacher_id", session.getTeacher().getId())
                                .toString())
                .log().uri()
                .log().method()
                .when().put(BASE_URL + "/" + sessionId)
                .then()
                .log().status()
                .log().body()
                .statusCode(200)
                .body("name", Matchers.equalTo(newSessionName));
    }

    @Test
    void cannotUpdateSessionFromEndpointUsingWrongID() throws JSONException {
        // Arrange
        Long sessionId = 3L;
        Session session = sessionService.getById(sessionId);
        Assertions.assertThat(session).isNotNull();
        String newSessionName = "newSessionName";

        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .body(
                        (new JSONObject())
                                .put("name", newSessionName)
                                .put("description", session.getDescription())
                                .put("date", new SimpleDateFormat("yyyy-MM-dd").format(session.getDate()))
                                .put("teacher_id", session.getTeacher().getId())
                                .toString())
                .log().uri()
                .log().method()
                .when().put(BASE_URL + "/notanId")
                .then()
                .log().status()
                .log().body()
                .statusCode(400);
    }
}
