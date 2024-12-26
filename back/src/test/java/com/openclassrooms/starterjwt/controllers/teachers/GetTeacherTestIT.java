package com.openclassrooms.starterjwt.controllers.teachers;

import org.assertj.core.api.Assertions;
import org.hamcrest.Matchers;
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

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.services.TeacherService;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class GetTeacherTestIT {

    private static final String BASE_URL = "/api/teacher";

    @Autowired
    private TeacherService teacherService;

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
    void canGetTeachersList() {
        Teacher teacher = teacherService.findById(1L);
        Assertions.assertThat(teacher)
                .returns("Margot", Assertions.from(Teacher::getFirstName))
                .returns("DELAHAYE", Assertions.from(Teacher::getLastName));
    }

    @Test
    void canGetTeacherFromEndpoint() throws JSONException {
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
                .body("firstName", Matchers.equalTo("Margot"))
                .body("lastName", Matchers.equalTo("DELAHAYE"));
    }

    @Test
    void cannotGetTeacherFromEndpointThatDoesNotExists() throws JSONException {
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .log().uri()
                .log().method()
                .when().get(BASE_URL + "/999999")
                .then()
                .log().status()
                .log().body()
                .statusCode(404);
    }

    @Test
    void cannotGetTeacherFromEndpointWithWrongId() throws JSONException {
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
