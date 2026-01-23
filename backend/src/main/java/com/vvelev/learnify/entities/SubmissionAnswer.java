package com.vvelev.learnify.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "submission_answers")
public class SubmissionAnswer {
    @EmbeddedId
    private SubmissionAnswerId id;

    @ManyToOne
    @MapsId("submissionId")
    @JoinColumn(name = "submission_id")
    private Submission submission;

    @MapsId("questionId")
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "answer_id")
    private Answer answer;
}
