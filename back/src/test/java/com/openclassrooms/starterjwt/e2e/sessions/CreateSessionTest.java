package com.openclassrooms.starterjwt.e2e.sessions;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.assertj.core.api.Assertions;
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
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.TeacherService;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CreateSessionTest {

    private static final String BASE_URL = "/api/session";

    @Autowired
    private SessionService sessionService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @LocalServerPort
    private int port;

    private Long teacherID = 1L;
    private Teacher teacher;

    private String jwt;

    @BeforeEach
    public void init() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = this.port;

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("yoga@studio.com", "password"));
        jwt = jwtUtils.generateJwtToken(authentication);
        teacher = teacherService.findById(teacherID);
    }

    @Test
    void canCreateSession() {
        Session newSession = new Session();
        newSession.setName("New session");
        newSession.setDescription("Newly created session");
        newSession.setDate(new Date());
        newSession.setTeacher(teacher);
        Session createdSession = sessionService.create(newSession);
        Assertions.assertThat(createdSession.getId());
    }

    @Test
    void canCreateSessionFromEndpoint() throws JSONException {
        RestAssured
                .given()
                .header("Authorization", "Bearer " + jwt)
                .contentType(ContentType.JSON)
                .body(
                        (new JSONObject())
                                .put("name", "New session rest")
                                .put("description", "Newly created session rest")
                                .put("date", new SimpleDateFormat("yyyy-MM-dd").format(new Date()))
                                .put("teacher_id", teacher.getId())
                                .toString())
                .log().uri()
                .log().method()
                .when().post(BASE_URL)
                .then()
                .log().status()
                .log().body()
                .statusCode(200);
    }
}
