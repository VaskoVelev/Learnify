package com.vvelev.learnify.repositories;

import com.vvelev.learnify.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByLessonId(Long lessonId);
}
