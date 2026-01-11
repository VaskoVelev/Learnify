package com.vvelev.learnify.dtos.material;

import com.vvelev.learnify.entities.FileType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMaterialDto {
    @NotBlank(message = "File path is required")
    @Size(max = 2000)
    private String filePath;

    @NotBlank
    private FileType fileType;
}
