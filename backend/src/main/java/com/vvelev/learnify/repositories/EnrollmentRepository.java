package com.vvelev.learnify.repositories;

import com.vvelev.learnify.entities.Enrollment;
import com.vvelev.learnify.entities.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
    List<Enrollment> findByIdStudentId(Long studentId);
    List<Enrollment> findByIdCourseId(Long studentId);
}
