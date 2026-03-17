package com.vvelev.learnify.config;

import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.entities.Role;
import com.vvelev.learnify.filters.JwtAuthenticationFilter;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.PatchMapping;

@AllArgsConstructor
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(userDetailsService);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(c -> {})
                .sessionManagement(c ->
                        c.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(c -> c
                        .requestMatchers(HttpMethod.POST, ApiPaths.AUTH_LOGIN, ApiPaths.AUTH_REFRESH, ApiPaths.USERS).permitAll()

                        .requestMatchers(HttpMethod.GET, ApiPaths.USERS, ApiPaths.USER_BY_ID, ApiPaths.ENROLLMENTS).hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, ApiPaths.USER_BY_ID).hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.PATCH, ApiPaths.USER_BY_ID).hasRole(Role.ADMIN.name())

                        .requestMatchers(HttpMethod.GET,
                                ApiPaths.COURSES_CREATED_ME,
                                ApiPaths.COURSE_PROGRESSIONS,
                                ApiPaths.QUIZ_SUBMISSIONS
                        ).hasRole(Role.TEACHER.name())

                        .requestMatchers(HttpMethod.POST,
                                ApiPaths.COURSES,
                                ApiPaths.COURSE_LESSONS,
                                ApiPaths.LESSON_MATERIALS,
                                ApiPaths.LESSON_QUIZZES,
                                ApiPaths.QUIZ_QUESTIONS,
                                ApiPaths.QUESTION_ANSWERS
                        ).hasRole(Role.TEACHER.name())

                        .requestMatchers(HttpMethod.PUT,
                                ApiPaths.COURSE_BY_ID,
                                ApiPaths.LESSON_BY_ID,
                                ApiPaths.MATERIAL_BY_ID,
                                ApiPaths.QUIZ_BY_ID,
                                ApiPaths.QUESTION_BY_ID,
                                ApiPaths.ANSWER_BY_ID
                        ).hasRole(Role.TEACHER.name())

                        .requestMatchers(HttpMethod.DELETE,
                                ApiPaths.COURSE_BY_ID,
                                ApiPaths.LESSON_BY_ID,
                                ApiPaths.MATERIAL_BY_ID,
                                ApiPaths.QUIZ_BY_ID,
                                ApiPaths.QUESTION_BY_ID,
                                ApiPaths.ANSWER_BY_ID
                        ).hasRole(Role.TEACHER.name())

                        .requestMatchers(HttpMethod.GET,
                                ApiPaths.COURSE_PROGRESSION_ME,
                                ApiPaths.ENROLLMENTS_ME,
                                ApiPaths.QUIZ_SUBMISSIONS_ME
                        ).hasRole(Role.STUDENT.name())

                        .requestMatchers(HttpMethod.POST,
                                ApiPaths.COURSE_ENROLL,
                                ApiPaths.QUIZ_SUBMIT
                        ).hasRole(Role.STUDENT.name())

                        .requestMatchers(HttpMethod.GET,
                                ApiPaths.COURSES,
                                ApiPaths.COURSE_BY_ID,
                                ApiPaths.COURSE_ENROLLMENTS,
                                ApiPaths.COURSE_LESSONS,
                                ApiPaths.LESSON_BY_ID,
                                ApiPaths.LESSON_MATERIALS,
                                ApiPaths.LESSON_QUIZZES,
                                ApiPaths.QUIZ_BY_ID,
                                ApiPaths.QUIZ_QUESTIONS,
                                ApiPaths.QUESTION_ANSWERS,
                                ApiPaths.SUBMISSION_BY_ID
                        ).hasAnyRole(Role.STUDENT.name(), Role.TEACHER.name())

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(c -> {
                    c.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
                    c.accessDeniedHandler((request, response, accessDeniedException) ->
                            response.setStatus(HttpStatus.FORBIDDEN.value())
                    );
                });

        return http.build();
    }
}
