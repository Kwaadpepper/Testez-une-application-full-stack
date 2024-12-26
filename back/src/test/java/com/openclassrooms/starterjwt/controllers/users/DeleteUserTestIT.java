package com.openclassrooms.starterjwt.controllers.users;

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

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.services.UserService;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DeleteUserTestIT {

    private static final String BASE_URL = "/api/user";

    @Autowired
    private UserService userService;

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
                new UsernamePasswordAuthenticationToken("delete@example.net", "password"));
        jwt = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    void canDeleteUserFromEndpoint() throws JSONException {
        User user = userService.findById(4L);
        Assertions.assertThat(user).isNotNull();

        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().delete(BASE_URL + "/4")
                .then()
                .log().status()
                .log().body()
                .statusCode(200);

        user = userService.findById(4L);
        Assertions.assertThat(user).isNull();
    }

    @Test
    void cannotDeleteAnotherUserFromEndpoint() throws JSONException {
        User user = userService.findById(2L);
        Assertions.assertThat(user).isNotNull();

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
                .statusCode(401);
    }

    @Test
    void cannotDeleteUserFromEndpointThatDoesNotExists() throws JSONException {
        Long userId = 999999L;
        User user = userService.findById(userId);
        Assertions.assertThat(user).isNull();

        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().delete(BASE_URL + "/" + userId)
                .then()
                .log().status()
                .log().body()
                .statusCode(404);
    }

    @Test
    void cannotDeleteUserFromEndpointWithWrongId() throws JSONException {
        String userId = "Not an Id";

        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().delete(BASE_URL + "/" + userId)
                .then()
                .log().status()
                .log().body()
                .statusCode(400);
    }
}
