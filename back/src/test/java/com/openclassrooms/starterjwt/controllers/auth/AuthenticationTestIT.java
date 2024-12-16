package com.openclassrooms.starterjwt.controllers.auth;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthenticationTestIT {

    private static final String BASE_URL = "/api/auth";

    @Autowired
    private UserService usersService;

    @LocalServerPort
    private int port;

    @BeforeEach
    public void init() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = this.port;
    }

    @Test
    void canFetchUserByUsername() {
        User user = usersService.findById(1L);
        assertEquals(user.getId(), 1L);
        assertEquals(user.getEmail(), "yoga@studio.com");
    }

    @Test
    void canAuthenticateUser() throws JSONException {
        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(
                        (new JSONObject())
                                .put("email", "yoga@studio.com")
                                .put("password", "password")
                                .toString())
                .log().uri()
                .log().method()
                .when().post(BASE_URL + "/login")
                .then()
                .log().status()
                .log().body()
                .statusCode(200)
                .body("username", equalTo("yoga@studio.com"));
    }
}
