package com.openclassrooms.starterjwt.controllers.teachers;

import java.util.ArrayList;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

public class TeacherControllerFindAllTest {
    private TeacherMapper teacherMapper;
    private TeacherService teacherService;
    private TeacherController teacherController;

    public TeacherControllerFindAllTest() {
        teacherMapper = Mockito.mock(TeacherMapper.class);
        teacherService = Mockito.mock(TeacherService.class);
        teacherController = new TeacherController(teacherService, teacherMapper);
    }

    @Test
    public void canFindAll() {
        // Arrange
        Teacher teacher = Mockito.mock(Teacher.class);
        TeacherDto teacherDto = Mockito.mock(TeacherDto.class);
        Mockito.when(teacherService.findAll()).thenReturn(List.of(teacher));
        Mockito.when(teacherMapper.toDto(Mockito.anyList())).thenReturn(new ArrayList<>(List.of(teacherDto)));

        // Act
        ResponseEntity<?> output = teacherController.findAll();

        // Act
        Mockito.verify(teacherService).findAll();
        Mockito.verify(teacherMapper).toDto(Mockito.anyList());
        Assertions.assertThat(output)
                .extracting(ResponseEntity::getStatusCodeValue)
                .isEqualTo(200)
                .as("An existing user can be retrieved from the controller");
    }
}
