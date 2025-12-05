package com.vvelev.learnify.dtos.material;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDto {
    private Long id;
    private String filePath;
    private String fileType;
    private Long lessonId;
}
