package com.vvelev.learnify.dtos.enrollment;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateEnrollmentDto {
    @NotNull
    private Long studentId;

    @NotNull
    private Long courseId;
}
