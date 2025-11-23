package com.vvelev.learnify.repositories;

import com.vvelev.learnify.entities.StudentProgression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentProgressionRepository extends JpaRepository<StudentProgression, Long> {
}
