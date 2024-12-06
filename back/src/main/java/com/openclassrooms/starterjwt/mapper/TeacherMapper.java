package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.annotations.GeneratedMapper;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.mapstruct.AnnotateWith;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@AnnotateWith(GeneratedMapper.class)
@Component
@Mapper(componentModel = "spring")
public interface TeacherMapper extends EntityMapper<TeacherDto, Teacher> {
}
