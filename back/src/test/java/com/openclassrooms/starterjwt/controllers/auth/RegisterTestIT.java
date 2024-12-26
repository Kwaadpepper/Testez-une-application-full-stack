package com.openclassrooms.starterjwt.controllers.auth;

import static org.hamcrest.Matchers.equalTo;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RegisterTestIT {

    private static final String BASE_URL = "/api/auth";

    @LocalServerPort
    private int port;

    @BeforeEach
    public void init() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = this.port;
    }

    @Test
    void canRegisterUser() throws JSONException {
        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(
                        (new JSONObject())
                                .put("email", "register@studio.com")
                                .put("firstName", "firstName")
                                .put("lastName", "lastName")
                                .put("password", "password")
                                .toString())
                .log().uri()
                .log().method()
                .when().post(BASE_URL + "/register")
                .then()
                .log().status()
                .log().body()
                .statusCode(200)
                .body("message", equalTo("User registered successfully!"));
    }

    @Test
    void cannotRegisterUserThatAlreadyExists() throws JSONException {
        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(
                        (new JSONObject())
                                .put("email", "anotherregister@studio.com")
                                .put("firstName", "firstName")
                                .put("lastName", "lastName")
                                .put("password", "password")
                                .toString())
                .log().uri()
                .log().method()
                .when().post(BASE_URL + "/register")
                .then()
                .log().status()
                .log().body()
                .statusCode(200)
                .body("message", equalTo("User registered successfully!"));
        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(
                        (new JSONObject())
                                .put("email", "anotherregister@studio.com")
                                .put("firstName", "firstName")
                                .put("lastName", "lastName")
                                .put("password", "password")
                                .toString())
                .log().uri()
                .log().method()
                .when().post(BASE_URL + "/register")
                .then()
                .log().status()
                .log().body()
                .statusCode(400)
                .body("message", equalTo("Error: Email is already taken!"));
    }
}
