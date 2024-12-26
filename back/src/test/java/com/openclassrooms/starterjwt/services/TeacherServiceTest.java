package com.openclassrooms.starterjwt.services;

import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

public class TeacherServiceTest {
    private final TeacherRepository teacherRepository;

    public TeacherServiceTest() {
        this.teacherRepository = Mockito.mock(TeacherRepository.class);
    }

    @Test
    public void canFindAll() {
        // Arrange
        TeacherService teacherService = new TeacherService(teacherRepository);
        Teacher teacher = getNewTeacher();
        Mockito.when(teacherRepository.findAll()).thenReturn(List.of(teacher));

        // Act
        final List<Teacher> output = teacherService.findAll();

        // Assert
        Mockito.verify(teacherRepository).findAll();
        Assertions.assertThat(output)
                .as("Check TeacherService findAll returns a list of teachers that is given by the repository")
                .hasSize(1)
                .first()
                .isEqualTo(teacher);
    }

    @Test
    public void canFindById() {
        // Arrange
        TeacherService teacherService = new TeacherService(teacherRepository);
        Teacher teacher = getNewTeacher();
        Mockito.when(teacherRepository.findById(Mockito.any(Long.class)))
                .thenReturn(Optional.of(teacher));

        // Act
        final Teacher output = teacherService.findById(teacher.getId());

        // Assert
        Mockito.verify(teacherRepository).findById(Mockito.any(Long.class));
        Assertions.assertThat(output)
                .as("The teacher found on the repository should be returned")
                .isEqualTo(teacher);
    }

    @Test
    public void canMissUserWhenFindById() {
        // Arrange
        TeacherService teacherService = new TeacherService(teacherRepository);
        Teacher teacher = getNewTeacher();
        Mockito.when(teacherRepository.findById(Mockito.any(Long.class)))
                .thenReturn(Optional.empty());

        // Act
        final Teacher output = teacherService.findById(teacher.getId());

        // Assert
        Mockito.verify(teacherRepository).findById(Mockito.any(Long.class));
        Assertions.assertThat(output)
                .as("Null should be returned if the teacher is missing")
                .isNull();
    }

    private Teacher getNewTeacher() {
        return Mockito.mock(Teacher.class);
    }
}
