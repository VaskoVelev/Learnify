package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.lesson.CreateLessonDto;
import com.vvelev.learnify.dtos.lesson.LessonDto;
import com.vvelev.learnify.dtos.lesson.UpdateLessonDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.LessonNotFoundException;
import com.vvelev.learnify.mappers.LessonMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.LessonRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LessonServiceTest {
    @Mock private LessonRepository lessonRepository;
    @Mock private CourseRepository courseRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private LessonMapper lessonMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private LessonService lessonService;

    private Course course;
    private User teacher;
    private User student;
    private Lesson lesson;
    private CreateLessonDto createLessonDto;
    private UpdateLessonDto updateLessonDto;
    private LessonDto lessonDto;

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

        createLessonDto = new CreateLessonDto("New Lesson", "New Content", "https://example.com/new-video.mp4");
        updateLessonDto = new UpdateLessonDto("Updated Lesson", "Updated Content", "https://example.com/updated-video.mp4");
        lessonDto = new LessonDto(1L, "Test Lesson", "Lesson Content", "https://example.com/video.mp4", 1L);
    }

    /* -------------------- Create Lesson -------------------- */

    @Test
    void createLesson_ShouldCreateLesson_WhenUserIsCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(lessonMapper.toEntity(createLessonDto)).thenReturn(lesson);
        when(lessonRepository.save(lesson)).thenReturn(lesson);
        when(lessonMapper.toDto(lesson)).thenReturn(lessonDto);

        LessonDto result = lessonService.createLesson(course.getId(), createLessonDto);

        assertNotNull(result);
        assertEquals(lessonDto.getId(), result.getId());
        assertEquals(lessonDto.getTitle(), result.getTitle());
        assertEquals(lessonDto.getContent(), result.getContent());
        assertEquals(lessonDto.getVideoUrl(), result.getVideoUrl());
        assertEquals(lessonDto.getCourseId(), result.getCourseId());

        assertEquals(course, lesson.getCourse());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(lessonMapper, times(1)).toEntity(createLessonDto);
        verify(lessonRepository, times(1)).save(lesson);
        verify(lessonMapper, times(1)).toDto(lesson);
    }

    @Test
    void createLesson_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> lessonService.createLesson(nonExistentCourseId, createLessonDto)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(securityUtils, lessonMapper, lessonRepository);
    }

    @Test
    void createLesson_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> lessonService.createLesson(course.getId(), createLessonDto)
        );

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(lessonMapper, lessonRepository);
    }

    /* -------------------- Get Course Lessons -------------------- */

    @Test
    void getCourseLessons_ShouldReturnCourseLessons_WhenUserIsCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(lessonRepository.findByCourseId(course.getId())).thenReturn(List.of(lesson));
        when(lessonMapper.toDto(lesson)).thenReturn(lessonDto);

        List<LessonDto> result = lessonService.getCourseLessons(course.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(lessonDto.getId(), result.get(0).getId());
        assertEquals(lessonDto.getTitle(), result.get(0).getTitle());
        assertEquals(lessonDto.getContent(), result.get(0).getContent());
        assertEquals(lessonDto.getVideoUrl(), result.get(0).getVideoUrl());
        assertEquals(lessonDto.getCourseId(), result.get(0).getCourseId());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(lessonRepository, times(1)).findByCourseId(course.getId());
        verify(lessonMapper, times(1)).toDto(lesson);
        verify(enrollmentRepository, never()).existsById(any(EnrollmentId.class));
    }

    @Test
    void getCourseLessons_ShouldReturnCourseLessons_WhenUserIsEnrolledInCourse() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(lessonRepository.findByCourseId(course.getId())).thenReturn(List.of(lesson));
        when(lessonMapper.toDto(lesson)).thenReturn(lessonDto);

        List<LessonDto> result = lessonService.getCourseLessons(course.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(lessonDto.getId(), result.get(0).getId());
        assertEquals(lessonDto.getTitle(), result.get(0).getTitle());
        assertEquals(lessonDto.getContent(), result.get(0).getContent());
        assertEquals(lessonDto.getVideoUrl(), result.get(0).getVideoUrl());
        assertEquals(lessonDto.getCourseId(), result.get(0).getCourseId());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(lessonRepository, times(1)).findByCourseId(course.getId());
        verify(lessonMapper, times(1)).toDto(lesson);
    }

    @Test
    void getCourseLessons_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> lessonService.getCourseLessons(nonExistentCourseId)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(securityUtils, enrollmentRepository, lessonRepository, lessonMapper);
    }

    @Test
    void getCourseLessons_ShouldThrowAccessDeniedException_WhenUserIsNotAuthorized() {
        User unauthorizedUser = new User();
        unauthorizedUser.setId(3L);

        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(unauthorizedUser.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> lessonService.getCourseLessons(course.getId())
        );

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(lessonRepository, lessonMapper);
    }

    @Test
    void getCourseLessons_ShouldReturnEmptyList_WhenNoLessonsExist() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(lessonRepository.findByCourseId(course.getId())).thenReturn(List.of());

        List<LessonDto> result = lessonService.getCourseLessons(course.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(lessonRepository, times(1)).findByCourseId(course.getId());
        verify(lessonMapper, never()).toDto(any(Lesson.class));
    }

    /* -------------------- Get Lesson -------------------- */

    @Test
    void getLesson_ShouldReturnLesson_WhenUserIsCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(lessonMapper.toDto(lesson)).thenReturn(lessonDto);

        LessonDto result = lessonService.getLesson(lesson.getId());

        assertNotNull(result);
        assertEquals(lessonDto.getId(), result.getId());
        assertEquals(lessonDto.getTitle(), result.getTitle());
        assertEquals(lessonDto.getContent(), result.getContent());
        assertEquals(lessonDto.getVideoUrl(), result.getVideoUrl());
        assertEquals(lessonDto.getCourseId(), result.getCourseId());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(lessonMapper, times(1)).toDto(lesson);
        verify(enrollmentRepository, never()).existsById(any(EnrollmentId.class));
    }

    @Test
    void getLesson_ShouldReturnLesson_WhenUserIsEnrolledInCourse() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(lessonMapper.toDto(lesson)).thenReturn(lessonDto);

        LessonDto result = lessonService.getLesson(lesson.getId());

        assertNotNull(result);
        assertEquals(lessonDto.getId(), result.getId());
        assertEquals(lessonDto.getTitle(), result.getTitle());
        assertEquals(lessonDto.getContent(), result.getContent());
        assertEquals(lessonDto.getVideoUrl(), result.getVideoUrl());
        assertEquals(lessonDto.getCourseId(), result.getCourseId());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(lessonMapper, times(1)).toDto(lesson);
    }

    @Test
    void getLesson_ShouldThrowLessonNotFoundException_WhenLessonNotFound() {
        Long nonExistentLessonId = 999L;
        when(lessonRepository.findById(nonExistentLessonId)).thenReturn(Optional.empty());

        assertThrows(
                LessonNotFoundException.class,
                () -> lessonService.getLesson(nonExistentLessonId)
        );

        verify(lessonRepository, times(1)).findById(nonExistentLessonId);
        verifyNoInteractions(securityUtils, enrollmentRepository, lessonMapper);
    }

    @Test
    void getLesson_ShouldThrowAccessDeniedException_WhenUserIsNotAuthorized() {
        User unauthorizedUser = new User();
        unauthorizedUser.setId(3L);

        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(unauthorizedUser.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> lessonService.getLesson(lesson.getId())
        );

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(lessonMapper);
    }

    /* -------------------- Update Lesson -------------------- */

    @Test
    void updateLesson_ShouldUpdateLesson_WhenUserIsCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(lessonMapper).update(eq(updateLessonDto), any(Lesson.class));
        when(lessonRepository.save(lesson)).thenReturn(lesson);
        when(lessonMapper.toDto(lesson)).thenReturn(lessonDto);

        LessonDto result = lessonService.updateLesson(lesson.getId(), updateLessonDto);

        assertNotNull(result);
        assertEquals(lessonDto.getId(), result.getId());
        assertEquals(lessonDto.getTitle(), result.getTitle());
        assertEquals(lessonDto.getContent(), result.getContent());
        assertEquals(lessonDto.getVideoUrl(), result.getVideoUrl());
        assertEquals(lessonDto.getCourseId(), result.getCourseId());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(lessonMapper, times(1)).update(updateLessonDto, lesson);
        verify(lessonRepository, times(1)).save(lesson);
        verify(lessonMapper, times(1)).toDto(lesson);
    }

    @Test
    void updateLesson_ShouldThrowLessonNotFoundException_WhenLessonNotFound() {
        Long nonExistentLessonId = 999L;
        when(lessonRepository.findById(nonExistentLessonId)).thenReturn(Optional.empty());

        assertThrows(
                LessonNotFoundException.class,
                () -> lessonService.updateLesson(nonExistentLessonId, updateLessonDto)
        );

        verify(lessonRepository, times(1)).findById(nonExistentLessonId);
        verifyNoInteractions(securityUtils, lessonMapper);
    }

    @Test
    void updateLesson_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> lessonService.updateLesson(lesson.getId(), updateLessonDto)
        );

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(lessonMapper);
    }

    /* -------------------- Delete Lesson -------------------- */

    @Test
    void deleteLesson_ShouldDeleteLesson_WhenUserIsCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(lessonRepository).delete(lesson);

        lessonService.deleteLesson(lesson.getId());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(lessonRepository, times(1)).delete(lesson);
    }

    @Test
    void deleteLesson_ShouldThrowLessonNotFoundException_WhenLessonNotFound() {
        Long nonExistentLessonId = 999L;
        when(lessonRepository.findById(nonExistentLessonId)).thenReturn(Optional.empty());

        assertThrows(
                LessonNotFoundException.class,
                () -> lessonService.deleteLesson(nonExistentLessonId)
        );

        verify(lessonRepository, times(1)).findById(nonExistentLessonId);
        verifyNoInteractions(securityUtils);
    }

    @Test
    void deleteLesson_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> lessonService.deleteLesson(lesson.getId())
        );

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(lessonRepository, never()).delete(any(Lesson.class));
    }
}
