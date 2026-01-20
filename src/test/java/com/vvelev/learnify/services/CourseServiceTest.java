package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.course.CourseDto;
import com.vvelev.learnify.dtos.course.CreateCourseDto;
import com.vvelev.learnify.dtos.course.UpdateCourseDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.UserNotFoundException;
import com.vvelev.learnify.mappers.CourseMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.UserRepository;
import com.vvelev.learnify.utils.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {
    @Mock private CourseRepository courseRepository;
    @Mock private UserRepository userRepository;
    @Mock private CourseMapper courseMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private CourseService courseService;

    private User teacher;
    private User student;
    private Course course;
    private CreateCourseDto createCourseDto;
    private UpdateCourseDto updateCourseDto;
    private CourseDto courseDto;

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

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime earlier = now.minusDays(1);

        course = new Course();
        course.setId(1L);
        course.setTitle("Test Course");
        course.setDescription("Course Description");
        course.setCategory(Category.IT);
        course.setDifficulty(Difficulty.ADVANCED);
        course.setThumbnail("/uploads/thumbnail.jpg");
        course.setCreatedBy(teacher);
        course.setCreatedAt(earlier);
        course.setUpdatedAt(now);

        createCourseDto = new CreateCourseDto(
                "New Course",
                "New Course Description",
                Category.IT,
                Difficulty.BASIC,
                "/uploads/new-thumbnail.jpg"
        );

        updateCourseDto = new UpdateCourseDto(
                "Updated Course",
                "Updated Course Description",
                Category.MATH,
                Difficulty.DISTINGUISHED,
                "/uploads/updated-thumbnail.jpg"
        );

        courseDto = new CourseDto(
                1L,
                "Test Course",
                "Course Description",
                Category.IT,
                "/uploads/thumbnail.jpg",
                1L,
                earlier,
                now,
                Difficulty.ADVANCED
        );
    }

    /* -------------------- Create Course -------------------- */

    @Test
    void createCourse_ShouldCreateCourse_WhenTeacherIsAuthenticated() {
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(userRepository.findById(teacher.getId())).thenReturn(Optional.of(teacher));
        when(courseMapper.toEntity(createCourseDto)).thenReturn(course);
        when(courseRepository.save(course)).thenReturn(course);
        when(courseMapper.toDto(course)).thenReturn(courseDto);

        CourseDto result = courseService.createCourse(createCourseDto);

        assertNotNull(result);
        assertEquals(courseDto.getId(), result.getId());
        assertEquals(courseDto.getTitle(), result.getTitle());
        assertEquals(courseDto.getDescription(), result.getDescription());
        assertEquals(courseDto.getCategory(), result.getCategory());
        assertEquals(courseDto.getDifficulty(), result.getDifficulty());
        assertEquals(courseDto.getThumbnail(), result.getThumbnail());
        assertEquals(courseDto.getCreatedById(), result.getCreatedById());
        assertEquals(courseDto.getCreatedAt(), result.getCreatedAt());
        assertEquals(courseDto.getUpdatedAt(), result.getUpdatedAt());

        assertEquals(teacher, course.getCreatedBy());

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(userRepository, times(1)).findById(teacher.getId());
        verify(courseMapper, times(1)).toEntity(createCourseDto);
        verify(courseRepository, times(1)).save(course);
        verify(courseMapper, times(1)).toDto(course);
    }

    @Test
    void createCourse_ShouldThrowUserNotFoundException_WhenUserNotFound() {
        Long nonExistentUserId = 999L;
        when(securityUtils.getCurrentUserId()).thenReturn(nonExistentUserId);
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        assertThrows(
                UserNotFoundException.class,
                () -> courseService.createCourse(createCourseDto)
        );

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(userRepository, times(1)).findById(nonExistentUserId);
        verifyNoInteractions(courseMapper, courseRepository);
    }

    /* -------------------- Get All Courses -------------------- */

    @Test
    void getAllCourses_ShouldReturnAllCourses_WhenCalled() {
        when(courseRepository.findAll()).thenReturn(List.of(course));
        when(courseMapper.toDto(course)).thenReturn(courseDto);

        List<CourseDto> result = courseService.getAllCourses();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(courseDto.getId(), result.get(0).getId());
        assertEquals(courseDto.getTitle(), result.get(0).getTitle());
        assertEquals(courseDto.getDescription(), result.get(0).getDescription());
        assertEquals(courseDto.getCategory(), result.get(0).getCategory());
        assertEquals(courseDto.getDifficulty(), result.get(0).getDifficulty());
        assertEquals(courseDto.getThumbnail(), result.get(0).getThumbnail());
        assertEquals(courseDto.getCreatedById(), result.get(0).getCreatedById());
        assertEquals(courseDto.getCreatedAt(), result.get(0).getCreatedAt());
        assertEquals(courseDto.getUpdatedAt(), result.get(0).getUpdatedAt());

        verify(courseRepository, times(1)).findAll();
        verify(courseMapper, times(1)).toDto(any(Course.class));
    }

    @Test
    void getAllCourses_ShouldReturnEmptyList_WhenNoCoursesExist() {
        when(courseRepository.findAll()).thenReturn(List.of());

        List<CourseDto> result = courseService.getAllCourses();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(courseRepository, times(1)).findAll();
        verify(courseMapper, never()).toDto(any(Course.class));
    }

    /* -------------------- Get Course -------------------- */

    @Test
    void getCourse_ShouldReturnCourse_WhenCourseExists() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(courseMapper.toDto(course)).thenReturn(courseDto);

        CourseDto result = courseService.getCourse(course.getId());

        assertNotNull(result);
        assertEquals(courseDto.getId(), result.getId());
        assertEquals(courseDto.getTitle(), result.getTitle());
        assertEquals(courseDto.getDescription(), result.getDescription());
        assertEquals(courseDto.getCategory(), result.getCategory());
        assertEquals(courseDto.getDifficulty(), result.getDifficulty());
        assertEquals(courseDto.getThumbnail(), result.getThumbnail());
        assertEquals(courseDto.getCreatedById(), result.getCreatedById());
        assertEquals(courseDto.getCreatedAt(), result.getCreatedAt());
        assertEquals(courseDto.getUpdatedAt(), result.getUpdatedAt());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(courseMapper, times(1)).toDto(course);
    }

    @Test
    void getCourse_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> courseService.getCourse(nonExistentCourseId)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(courseMapper);
    }

    /* -------------------- Get My Courses Created -------------------- */

    @Test
    void getMyCoursesCreated_ShouldReturnMyCoursesCreated_WhenTeacherHasCreatedCourses() {
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(courseRepository.findByCreatedById(teacher.getId())).thenReturn(List.of(course));
        when(courseMapper.toDto(course)).thenReturn(courseDto);

        List<CourseDto> result = courseService.getMyCoursesCreated();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(courseDto.getId(), result.get(0).getId());
        assertEquals(courseDto.getTitle(), result.get(0).getTitle());
        assertEquals(courseDto.getDescription(), result.get(0).getDescription());
        assertEquals(courseDto.getCategory(), result.get(0).getCategory());
        assertEquals(courseDto.getDifficulty(), result.get(0).getDifficulty());
        assertEquals(courseDto.getThumbnail(), result.get(0).getThumbnail());
        assertEquals(courseDto.getCreatedById(), result.get(0).getCreatedById());
        assertEquals(courseDto.getCreatedAt(), result.get(0).getCreatedAt());
        assertEquals(courseDto.getUpdatedAt(), result.get(0).getUpdatedAt());

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(courseRepository, times(1)).findByCreatedById(teacher.getId());
        verify(courseMapper, times(1)).toDto(course);
    }

    @Test
    void getMyCoursesCreated_ShouldReturnEmptyList_WhenTeacherHasNoCourses() {
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(courseRepository.findByCreatedById(teacher.getId())).thenReturn(List.of());

        List<CourseDto> result = courseService.getMyCoursesCreated();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(courseRepository, times(1)).findByCreatedById(teacher.getId());
        verify(courseMapper, never()).toDto(any(Course.class));
    }

    /* -------------------- Update Course -------------------- */

    @Test
    void updateCourse_ShouldUpdateCourse_WhenUserIsCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(courseMapper).update(eq(updateCourseDto), any(Course.class));
        when(courseRepository.save(course)).thenReturn(course);
        when(courseMapper.toDto(course)).thenReturn(courseDto);

        CourseDto result = courseService.updateCourse(course.getId(), updateCourseDto);

        assertNotNull(result);
        assertEquals(courseDto.getId(), result.getId());
        assertEquals(courseDto.getTitle(), result.getTitle());
        assertEquals(courseDto.getDescription(), result.getDescription());
        assertEquals(courseDto.getCategory(), result.getCategory());
        assertEquals(courseDto.getDifficulty(), result.getDifficulty());
        assertEquals(courseDto.getThumbnail(), result.getThumbnail());
        assertEquals(courseDto.getCreatedById(), result.getCreatedById());
        assertEquals(courseDto.getCreatedAt(), result.getCreatedAt());
        assertEquals(courseDto.getUpdatedAt(), result.getUpdatedAt());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(courseMapper, times(1)).update(updateCourseDto, course);
        verify(courseRepository, times(1)).save(course);
        verify(courseMapper, times(1)).toDto(course);
    }

    @Test
    void updateCourse_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> courseService.updateCourse(nonExistentCourseId, updateCourseDto)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(securityUtils, courseMapper);
    }

    @Test
    void updateCourse_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> courseService.updateCourse(course.getId(), updateCourseDto)
        );

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(courseMapper);
    }

    /* -------------------- Delete Course -------------------- */

    @Test
    void deleteCourse_ShouldDeleteCourse_WhenUserIsCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(courseRepository).delete(course);

        courseService.deleteCourse(course.getId());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(courseRepository, times(1)).delete(course);
    }

    @Test
    void deleteCourse_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> courseService.deleteCourse(nonExistentCourseId)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(securityUtils);
    }

    @Test
    void deleteCourse_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> courseService.deleteCourse(course.getId())
        );

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(courseRepository, never()).delete(any(Course.class));
    }
}
