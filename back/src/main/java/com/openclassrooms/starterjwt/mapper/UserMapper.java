package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.annotations.GeneratedMapper;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.mapstruct.AnnotateWith;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@AnnotateWith(GeneratedMapper.class)
@Component
@Mapper(componentModel = "spring")
public interface UserMapper extends EntityMapper<UserDto, User> {
}
