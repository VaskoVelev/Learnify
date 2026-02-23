package com.vvelev.learnify.controllers;

import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.dtos.material.CreateMaterialDto;
import com.vvelev.learnify.dtos.material.MaterialDto;
import com.vvelev.learnify.dtos.material.UpdateMaterialDto;
import com.vvelev.learnify.services.MaterialService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
public class MaterialController {
    private final MaterialService materialService;

    @PostMapping(ApiPaths.LESSON_MATERIALS)
    public ResponseEntity<MaterialDto> createMaterial(
            @PathVariable Long id,
            @RequestBody CreateMaterialDto request,
            UriComponentsBuilder uriBuilder
    ) {
        MaterialDto materialDto = materialService.createMaterial(id, request);
        URI uri = uriBuilder.path(ApiPaths.MATERIAL_BY_ID).buildAndExpand(materialDto.getId()).toUri();

        return ResponseEntity.created(uri).body(materialDto);
    }

    @GetMapping(ApiPaths.LESSON_MATERIALS)
    List<MaterialDto> getLessonMaterials(@PathVariable Long id) {
        return materialService.getLessonMaterials(id);
    }

    @PutMapping(ApiPaths.MATERIAL_BY_ID)
    public ResponseEntity<MaterialDto> updateMaterial(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMaterialDto request
    ) {
        MaterialDto materialDto = materialService.updateMaterial(id, request);
        return ResponseEntity.ok(materialDto);
    }

    @DeleteMapping(ApiPaths.MATERIAL_BY_ID)
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
