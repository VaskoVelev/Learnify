package com.vvelev.learnify.repositories;

import com.vvelev.learnify.entities.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByQuizIdOrderBySubmittedAtDesc(Long quizId);
    List<Submission> findByQuizIdAndStudentIdOrderBySubmittedAtDesc(Long quizId, Long studentId);
}
