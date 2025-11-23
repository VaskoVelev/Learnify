package com.vvelev.learnify.repositories;

import com.vvelev.learnify.entities.Enrollment;
import com.vvelev.learnify.entities.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
}
