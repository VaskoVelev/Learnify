package com.vvelev.learnify.repositories;

import com.vvelev.learnify.entities.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByLessonIdOrderById(Long lessonId);
    long countByLessonCourseId(Long courseId);
}
