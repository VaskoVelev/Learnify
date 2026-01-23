package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.material.CreateMaterialDto;
import com.vvelev.learnify.dtos.material.MaterialDto;
import com.vvelev.learnify.dtos.material.UpdateMaterialDto;
import com.vvelev.learnify.entities.Material;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MaterialMapper {
    @Mapping(target = "lessonId", source = "lesson.id")
    MaterialDto toDto(Material material);

    @Mapping(target = "lesson", ignore = true)
    Material toEntity(CreateMaterialDto dto);

    void update(UpdateMaterialDto request, @MappingTarget Material material);
}