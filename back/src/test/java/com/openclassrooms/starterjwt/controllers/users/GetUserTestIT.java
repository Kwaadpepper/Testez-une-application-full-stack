package com.openclassrooms.starterjwt.controllers.users;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasEntry;

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
public class GetUserTestIT {

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
                new UsernamePasswordAuthenticationToken("yoga@studio.com", "password"));
        jwt = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    void canGetUsersList() {
        User user = userService.findById(1L);
        Assertions.assertThat(user)
                .returns("Admin", Assertions.from(User::getFirstName))
                .returns("Admin", Assertions.from(User::getLastName));
    }

    @Test
    void canGetUserFromEndpoint() throws JSONException {
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().get(BASE_URL + "/1")
                .then()
                .log().status()
                .log().body()
                .statusCode(200)
                .body("", allOf(
                        hasEntry("firstName", "Admin"),
                        hasEntry("lastName", "Admin")));
    }

    @Test
    void cannotGetUserFromEndpointThatDoesNotExists() throws JSONException {
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().get(BASE_URL + "/9999")
                .then()
                .log().status()
                .log().body()
                .statusCode(404);
    }

    @Test
    void cannotGetUserFromEndpointWithWrongId() throws JSONException {
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().get(BASE_URL + "/NotAnId")
                .then()
                .log().status()
                .log().body()
                .statusCode(400);
    }
}
