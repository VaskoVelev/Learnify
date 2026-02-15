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
import com.vvelev.learnify.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class MaterialService {
    private final MaterialRepository materialRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MaterialMapper materialMapper;
    private final SecurityUtils securityUtils;

    public MaterialDto createMaterial(Long lessonId, CreateMaterialDto request) {
        Lesson lesson = getLessonOrThrow(lessonId);
        Course course = lesson.getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        Material material = materialMapper.toEntity(request);
        material.setLesson(lesson);
        materialRepository.save(material);

        return materialMapper.toDto(material);
    }

    public List<MaterialDto> getLessonMaterials(Long lessonId) {
        Lesson lesson = getLessonOrThrow(lessonId);
        Course course = lesson.getCourse();

        Long userId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, userId) && !isStudentEnrolled(userId, course.getId())) {
            throw new AccessDeniedException();
        }

        return materialRepository
                .findByLessonIdOrderById(lessonId)
                .stream()
                .map(materialMapper::toDto)
                .toList();
    }

    public MaterialDto updateMaterial(Long materialId, UpdateMaterialDto request) {
        Material material = getMaterialOrThrow(materialId);
        Course course = material.getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        materialMapper.update(request, material);
        materialRepository.save(material);

        return materialMapper.toDto(material);
    }

    public void deleteMaterial(Long materialId) {
        Material material = getMaterialOrThrow(materialId);
        Course course = material.getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        materialRepository.delete(material);
    }

    private Lesson getLessonOrThrow(Long lessonId) {
        return lessonRepository
                .findById(lessonId)
                .orElseThrow(LessonNotFoundException::new);
    }

    private Material getMaterialOrThrow(Long materialId) {
        return materialRepository
                .findById(materialId)
                .orElseThrow(MaterialNotFoundException::new);
    }

    private boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsById(new EnrollmentId(studentId, courseId));
    }

    private boolean isCourseCreator(Course course, Long teacherId) {
        return course.getCreatedBy().getId().equals(teacherId);
    }
}
