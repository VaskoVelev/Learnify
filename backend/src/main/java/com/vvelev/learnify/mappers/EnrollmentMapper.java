package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.enrollment.EnrollmentCourseSummaryDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentStudentSummaryDto;
import com.vvelev.learnify.entities.Enrollment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {
    default EnrollmentDto toDto(Enrollment enrollment) {
        return new EnrollmentDto(
                enrollment.getStudent().getId(),
                enrollment.getStudent().getFirstName(),
                enrollment.getStudent().getLastName(),
                enrollment.getCourse().getId(),
                enrollment.getCourse().getTitle(),
                enrollment.getCourse().getCreatedBy().getId(),
                enrollment.getCourse().getCreatedBy().getFirstName(),
                enrollment.getCourse().getCreatedBy().getLastName(),
                enrollment.getEnrolledAt()
        );
    }

    default EnrollmentCourseSummaryDto toCourseSummary(Enrollment enrollment) {
        return new EnrollmentCourseSummaryDto(
                enrollment.getCourse().getId(),
                enrollment.getCourse().getTitle(),
                enrollment.getCourse().getCreatedBy().getId(),
                enrollment.getCourse().getCreatedBy().getFirstName(),
                enrollment.getCourse().getCreatedBy().getLastName(),
                enrollment.getEnrolledAt(),
                null
        );
    }

    default EnrollmentStudentSummaryDto toStudentSummary(Enrollment enrollment) {
        return new EnrollmentStudentSummaryDto(
                enrollment.getStudent().getId(),
                enrollment.getStudent().getFirstName(),
                enrollment.getStudent().getLastName(),
                enrollment.getEnrolledAt()
        );
    }
}
