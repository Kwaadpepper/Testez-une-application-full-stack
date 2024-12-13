package com.openclassrooms.starterjwt.controllers.teachers;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

public class TeacherControllerFindByIdTest {
    private TeacherMapper teacherMapper;
    private TeacherService teacherService;
    private TeacherController teacherController;

    public TeacherControllerFindByIdTest() {
        teacherMapper = Mockito.mock(TeacherMapper.class);
        teacherService = Mockito.mock(TeacherService.class);
        teacherController = new TeacherController(teacherService, teacherMapper);
    }

    @Test
    public void canFindTeacherById() {
        // Arrange
        String teacherID = "1";
        Teacher teacher = Mockito.mock(Teacher.class);
        TeacherDto teacherDto = Mockito.mock(TeacherDto.class);
        Mockito.when(teacherService.findById(Mockito.any(Long.class))).thenReturn(teacher);
        Mockito.when(teacherMapper.toDto(Mockito.any(Teacher.class))).thenReturn(teacherDto);

        // Act
        ResponseEntity<?> output = teacherController.findById(teacherID);

        // Act
        Mockito.verify(teacherService).findById(Mockito.any(Long.class));
        Mockito.verify(teacherMapper).toDto(Mockito.any(Teacher.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing user can be retrieved from the controller");
    }

    @Test
    public void canFindTeacherByIdCanBeMissing() {
        // Arrange
        String teacherID = "1";
        Mockito.when(teacherService.findById(Mockito.any(Long.class))).thenReturn(null);

        // Act
        ResponseEntity<?> output = teacherController.findById(teacherID);

        // Act
        Mockito.verify(teacherService).findById(Mockito.any(Long.class));
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(404)
                .as("A bad request is given if the teacher is missing");
    }

    @Test
    public void canFindTeacherByIdWouldBeRejectedOnBadInput() {
        // Arrange
        String teacherID = "badNumber";

        // Act
        ResponseEntity<?> output = teacherController.findById(teacherID);

        // Act
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(400)
                .as("A bad request is given if the asked teacher id is invalid");
    }
}
