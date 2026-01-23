package com.vvelev.learnify.repositories;

import com.vvelev.learnify.entities.SubmissionAnswer;
import com.vvelev.learnify.entities.SubmissionAnswerId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmissionAnswerRepository extends JpaRepository<SubmissionAnswer, SubmissionAnswerId> {
}
