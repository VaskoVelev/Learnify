CREATE TABLE users (
	id serial PRIMARY KEY,
	email varchar(255) NOT NULL UNIQUE,
	password varchar(255) NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	created_at timestamp NOT NULL DEFAULT current_timestamp,
	active boolean NOT NULL DEFAULT TRUE
);

CREATE TABLE roles (
	id serial PRIMARY KEY,
	name varchar(50) NOT NULL UNIQUE
);


CREATE TABLE user_roles (
	user_id integer NOT NULL,
	role_id integer NOT NULL,
	PRIMARY KEY (user_id, role_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE courses (
	id serial PRIMARY KEY,
	title varchar(255) NOT NULL,
	description text,
	category varchar(100),
	difficulty varchar(50),
	created_by integer NOT NULL,
	created_at timestamp NOT NULL DEFAULT current_timestamp,
	updated_at timestamp,
	thumbnail varchar(255),
	FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE enrollments (
	student_id integer NOT NULL,
	course_id integer NOT NULL,
	enrolled_at timestamp NOT NULL DEFAULT current_timestamp,
	PRIMARY KEY (student_id, course_id),
	FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE lessons (
	id serial PRIMARY KEY,
	course_id integer NOT NULL,
	title varchar(255) NOT NULL,
	content text,
	video_url varchar(255),
	order_index integer NOT NULL,
	FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE materials (
	id serial PRIMARY KEY,
	lesson_id integer NOT NULL,
	file_path text NOT NULL,
	file_type varchar(50) NOT NULL,
	FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE quizzes (
	id serial PRIMARY KEY,
	course_id integer NOT NULL,
	title varchar(255) NOT NULL,
	description text,
	FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE questions (
	id serial PRIMARY KEY,
	quiz_id integer NOT NULL,
	text text NOT NULL,
	type varchar(50) NOT NULL,
	FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE answers (
	id serial PRIMARY KEY,
	question_id integer NOT NULL,
	text text NOT NULL,
	is_correct boolean NOT NULL,
	FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE submissions (
	id serial PRIMARY KEY,
	quiz_id integer NOT NULL,
	student_id integer NOT NULL,
	score numeric(5, 2),
	submitted_at timestamp NOT NULL DEFAULT current_timestamp,
	FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
	FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE submission_answers (
	submission_id integer NOT NULL,
	question_id integer NOT NULL,
	answer_id integer,
	text_answer text,
	PRIMARY KEY (submission_id, question_id),
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE
);

CREATE TABLE student_progressions (
	id serial PRIMARY KEY,
	student_id integer NOT NULL,
	course_id integer NOT NULL,
	progression_percent numeric(5, 2) NOT NULL DEFAULT 0,
	average_score numeric(5, 2),
	FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE (student_id, course_id)
);

CREATE TABLE notifications (
	id serial PRIMARY KEY,
	user_id integer NOT NULL,
	message text NOT NULL,
	type varchar(50) NOT NULL,
	created_at timestamp NOT NULL DEFAULT current_timestamp,
	is_read boolean NOT NULL DEFAULT FALSE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);