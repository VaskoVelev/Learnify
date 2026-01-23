package com.vvelev.learnify.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class SubmissionAnswerId {
    @Column(name = "submission_id")
    private Long submissionId;

    @Column(name = "question_id")
    private Long questionId;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        SubmissionAnswerId that = (SubmissionAnswerId) o;
        return Objects.equals(submissionId, that.submissionId) && Objects.equals(questionId, that.questionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(submissionId, questionId);
    }
}
