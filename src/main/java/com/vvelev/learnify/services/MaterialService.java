package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.material.CreateMaterialDto;
import com.vvelev.learnify.dtos.material.MaterialDto;
import com.vvelev.learnify.dtos.material.UpdateMaterialDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.EnrollmentId;
import com.vvelev.learnify.entities.Lesson;
import com.vvelev.learnify.entities.Material;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.LessonNotFoundException;
import com.vvelev.learnify.exceptions.MaterialNotFoundException;
import com.vvelev.learnify.mappers.MaterialMapper;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.LessonRepository;
import com.vvelev.learnify.repositories.MaterialRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class MaterialService {
    private final MaterialRepository materialRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MaterialMapper materialMapper;

    public MaterialDto createMaterial(Long lessonId, CreateMaterialDto request) {
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(LessonNotFoundException::new);
        Course course = lesson.getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        Material material = materialMapper.toEntity(request);
        material.setLesson(lesson);
        materialRepository.save(material);

        return materialMapper.toDto(material);
    }

    public List<MaterialDto> getLessonMaterials(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(LessonNotFoundException::new);
        Course course = lesson.getCourse();

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), userId) && !enrollmentRepository.existsById(new EnrollmentId(userId, course.getId()))) {
            throw new AccessDeniedException();
        }

        return materialRepository.findByLessonId(lessonId)
                .stream()
                .map(materialMapper::toDto)
                .toList();
    }

    public MaterialDto updateMaterial(Long id, UpdateMaterialDto request) {
        Material material = materialRepository.findById(id).orElseThrow(MaterialNotFoundException::new);
        Course course = material.getLesson().getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        materialMapper.update(request, material);
        materialRepository.save(material);

        return materialMapper.toDto(material);
    }

    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(id).orElseThrow(MaterialNotFoundException::new);
        Course course = material.getLesson().getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        materialRepository.delete(material);
    }
}
