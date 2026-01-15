package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.material.CreateMaterialDto;
import com.vvelev.learnify.dtos.material.MaterialDto;
import com.vvelev.learnify.dtos.material.UpdateMaterialDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.LessonNotFoundException;
import com.vvelev.learnify.mappers.MaterialMapper;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.LessonRepository;
import com.vvelev.learnify.repositories.MaterialRepository;
import com.vvelev.learnify.utils.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MaterialServiceTest {
    @Mock private MaterialRepository materialRepository;
    @Mock private LessonRepository lessonRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private MaterialMapper materialMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private MaterialService materialService;

    private Lesson lesson;
    private Course course;
    private User teacher;
    private User student;
    private Material material;
    private CreateMaterialDto createMaterialDto;
    private UpdateMaterialDto updateMaterialDto;
    private MaterialDto materialDto;

    @BeforeEach
    void setUp() {
        teacher = new User();
        teacher.setId(1L);
        teacher.setEmail("teacher@example.com");
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        teacher.setRole(Role.TEACHER);

        student = new User();
        student.setId(2L);
        student.setEmail("student@example.com");
        student.setFirstName("Jane");
        student.setLastName("Smith");
        student.setRole(Role.STUDENT);

        course = new Course();
        course.setId(1L);
        course.setTitle("Test Course");
        course.setDescription("Course Description");
        course.setCreatedBy(teacher);

        lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTitle("Test Lesson");
        lesson.setContent("Lesson Content");
        lesson.setCourse(course);

        material = new Material();
        material.setId(1L);
        material.setFilePath("/uploads/materials/test.pdf");
        material.setFileType(FileType.PDF);
        material.setLesson(lesson);

        createMaterialDto = new CreateMaterialDto("/uploads/materials/test.pdf", FileType.PDF);
        updateMaterialDto = new UpdateMaterialDto("/uploads/materials/updated.pdf", FileType.PDF);
        materialDto = new MaterialDto(1L, "/uploads/materials/test.pdf", FileType.PDF, 1L);
    }

    /* ---------- Create Material ---------- */

    @Test
    void createMaterial_ShouldCreateMaterial_WhenTeacherIsCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(materialMapper.toEntity(createMaterialDto)).thenReturn(material);
        when(materialRepository.save(any(Material.class))).thenReturn(material);
        when(materialMapper.toDto(material)).thenReturn(materialDto);

        MaterialDto result = materialService.createMaterial(lesson.getId(), createMaterialDto);

        assertNotNull(result);
        assertEquals(materialDto.getId(), result.getId());
        assertEquals(materialDto.getFilePath(), result.getFilePath());
        assertEquals(materialDto.getFileType(), result.getFileType());
        assertEquals(materialDto.getLessonId(), result.getLessonId());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(materialMapper, times(1)).toEntity(createMaterialDto);
        verify(materialRepository, times(1)).save(material);
        verify(materialMapper, times(1)).toDto(material);

        assertEquals(lesson, material.getLesson());
    }

    @Test
    void createMaterial_ShouldThrowLessonNotFoundException_WhenLessonNotFound() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.empty());

        assertThrows(
                LessonNotFoundException.class,
                () -> materialService.createMaterial(lesson.getId(), createMaterialDto)
        );

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verifyNoInteractions(securityUtils, materialMapper, materialRepository);
    }

    @Test
    void createMaterial_ShouldThrowAccessDeniedException_WhenTeacherIsNotCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> materialService.createMaterial(lesson.getId(), createMaterialDto)
        );

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(materialMapper, materialRepository);
    }

    /* ---------- Get Lesson Materials ---------- */

    @Test
    void getLessonMaterials_ShouldReturnLessonMaterials_WhenTeacherIsCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(materialRepository.findByLessonId(lesson.getId())).thenReturn(List.of(material));
        when(materialMapper.toDto(material)).thenReturn(materialDto);

        List<MaterialDto> result = materialService.getLessonMaterials(lesson.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(materialDto.getId(), result.get(0).getId());
        assertEquals(materialDto.getFilePath(), result.get(0).getFilePath());
        assertEquals(materialDto.getFileType(), result.get(0).getFileType());
        assertEquals(materialDto.getLessonId(), result.get(0).getLessonId());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(materialRepository, times(1)).findByLessonId(lesson.getId());
        verify(materialMapper, times(1)).toDto(material);
        verify(enrollmentRepository, never()).existsById(any(EnrollmentId.class));
    }

    @Test
    void getLessonMaterials_ShouldReturnLessonMaterials_WhenStudentIsEnrolledInCourse() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(materialRepository.findByLessonId(lesson.getId())).thenReturn(List.of(material));
        when(materialMapper.toDto(material)).thenReturn(materialDto);

        List<MaterialDto> result = materialService.getLessonMaterials(lesson.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(materialDto.getId(), result.get(0).getId());
        assertEquals(materialDto.getFilePath(), result.get(0).getFilePath());
        assertEquals(materialDto.getFileType(), result.get(0).getFileType());
        assertEquals(materialDto.getLessonId(), result.get(0).getLessonId());

        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(materialRepository, times(1)).findByLessonId(lesson.getId());
        verify(materialMapper, times(1)).toDto(material);
    }

    @Test
    void getLessonMaterials_ShouldThrowLessonNotFoundException_WhenLessonNotFound() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.empty());

        assertThrows(
                LessonNotFoundException.class,
                () -> materialService.getLessonMaterials(lesson.getId())
        );

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verifyNoInteractions(securityUtils, enrollmentRepository, materialMapper, materialRepository);
    }

    @Test
    void getLessonMaterials_ShouldThrowAccessDeniedException_WhenUserIsNotAuthorized() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(3L);
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> materialService.getLessonMaterials(lesson.getId())
        );

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(materialRepository, materialMapper);
    }

    @Test
    void getLessonMaterials_ShouldReturnEmptyList_WhenNoMaterialsExist() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(materialRepository.findByLessonId(lesson.getId())).thenReturn(List.of());

        List<MaterialDto> result = materialService.getLessonMaterials(lesson.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(materialRepository, times(1)).findByLessonId(lesson.getId());
        verify(materialMapper, never()).toDto(any(Material.class));
    }
}
