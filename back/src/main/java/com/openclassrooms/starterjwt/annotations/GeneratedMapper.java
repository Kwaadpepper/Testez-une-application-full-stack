package com.openclassrooms.starterjwt.annotations;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * Annotation to put on Mapstruct mappers for generated classes to keep the
 * annotation.
 * See https://github.com/mapstruct/mapstruct/issues/1528
 * https://github.com/mapstruct/mapstruct/issues/1574 (Mapstruct milestone
 * 1.6.0)
 */
@Retention(RetentionPolicy.CLASS)
public @interface GeneratedMapper {
}
