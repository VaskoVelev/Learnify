package com.vvelev.learnify.dtos.submission;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubmissionDto {
    @NotNull
    private Long quizId;

    @NotNull
    private Long studentId;
}
