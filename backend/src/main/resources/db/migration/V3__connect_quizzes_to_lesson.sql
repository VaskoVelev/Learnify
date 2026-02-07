ALTER TABLE quizzes DROP CONSTRAINT quizzes_course_id_fkey;
ALTER TABLE quizzes DROP COLUMN course_id;
ALTER TABLE quizzes ADD COLUMN lesson_id integer NOT NULL;
ALTER TABLE quizzes
    ADD CONSTRAINT quizzes_lesson_id_fkey
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;