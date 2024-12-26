package com.openclassrooms.starterjwt.controllers.session;

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

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ParticipateSessionTestIT {

    private static final String BASE_URL = "/api/session";

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
    void canParticipateToSessionFromEndpoint() throws JSONException {
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().post(BASE_URL + "/1/participate/3")
                .then()
                .log().status()
                .log().body()
                .statusCode(200);
    }

    @Test
    void canParticipateToSessionFromEndpointIfUserDoesNotExists() throws JSONException {
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().post(BASE_URL + "/1/participate/99999")
                .then()
                .log().status()
                .log().body()
                .statusCode(404);
    }

    @Test
    void canParticipateToSessionFromEndpointIfSessionDoesNotExists() throws JSONException {
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().post(BASE_URL + "/99999/participate/3")
                .then()
                .log().status()
                .log().body()
                .statusCode(404);
    }

    @Test
    void cannotParticipateToSessionFromEndpointWithWrongId() throws JSONException {
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().post(BASE_URL + "/NotAnId/participate/3")
                .then()
                .log().status()
                .log().body()
                .statusCode(400);
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().post(BASE_URL + "/1/participate/NotAnId")
                .then()
                .log().status()
                .log().body()
                .statusCode(400);
    }
}
