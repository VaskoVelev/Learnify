package com.vvelev.learnify.repositories;

import com.vvelev.learnify.entities.StudentProgression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProgressionRepository extends JpaRepository<StudentProgression, Long> {
    Optional<StudentProgression> findByStudentIdAndCourseId(Long studentId, Long courseId);
    List<StudentProgression> findByCourseId(Long courseId);
}
