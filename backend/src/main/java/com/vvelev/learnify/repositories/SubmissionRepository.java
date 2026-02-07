package com.vvelev.learnify.repositories;

import com.vvelev.learnify.entities.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByQuizIdOrderBySubmittedAtDesc(Long quizId);
    List<Submission> findByQuizIdAndStudentIdOrderBySubmittedAtDesc(Long quizId, Long studentId);

    @Query("""
        SELECT COUNT(DISTINCT s.quiz.id)
        FROM Submission s
        WHERE s.student.id = :studentId
        AND s.quiz.lesson.course.id = :courseId
    """)
    long countDistinctQuizByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("""
        SELECT AVG(s.score)
        FROM Submission s
        WHERE s.student.id = :studentId
        AND s.quiz.lesson.course.id = :courseId
    """)
    Double findAverageScoreByStudentIdAndCourseId(Long studentId, Long courseId);
}
