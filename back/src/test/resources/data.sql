INSERT INTO TEACHERS (id, last_name, first_name, created_at, updated_at) VALUES
	(1, 'DELAHAYE', 'Margot', '2024-11-26 18:10:14', '2024-11-26 18:10:14'),
	(2, 'THIERCELIN', 'Hélène', '2024-11-26 18:10:14', '2024-11-26 18:10:14');

INSERT INTO USERS (id, last_name, first_name, admin, email, password, created_at, updated_at) VALUES
	(1, 'Admin', 'Admin', 1, 'yoga@studio.com', '$2a$10$hHtCFfR5T/CLA7Xq5VbV/euvibwHafiNhPu5PG1aDoNENlCdx800S', '2024-11-26 18:10:14', '2024-11-26 18:10:14'),
	(2, 'user', 'example', 0, 'user@example.net', '$2a$10$hHtCFfR5T/CLA7Xq5VbV/euvibwHafiNhPu5PG1aDoNENlCdx800S', '2024-11-26 19:12:40', '2024-12-13 11:24:35'),
	(3, 'another user', 'example', 0, 'another.user@example.net', '$2a$10$hHtCFfR5T/CLA7Xq5VbV/euvibwHafiNhPu5PG1aDoNENlCdx800S', '2024-11-26 19:12:40', '2024-12-13 11:24:35'),
	(4, 'user to delete', 'example', 0, 'delete@example.net', '$2a$10$hHtCFfR5T/CLA7Xq5VbV/euvibwHafiNhPu5PG1aDoNENlCdx800S', '2024-11-26 19:12:40', '2024-12-13 11:24:35');

INSERT INTO SESSIONS (id, name, description, date, teacher_id, created_at, updated_at) VALUES
	(1, 'Session name', 'Session description', '2023-10-27 02:00:00', 1, '2024-11-26 19:21:35', '2024-12-13 11:24:17');
INSERT INTO SESSIONS (id, name, description, date, teacher_id, created_at, updated_at) VALUES
	(2, 'Session name', 'Session description', '2023-10-27 02:00:00', 1, '2024-11-26 19:21:35', '2024-12-13 11:24:17');
INSERT INTO SESSIONS (id, name, description, date, teacher_id, created_at, updated_at) VALUES
	(3, 'Session name', 'Session description', '2023-10-27 02:00:00', 1, '2024-11-26 19:21:35', '2024-12-13 11:24:17');
INSERT INTO SESSIONS (id, name, description, date, teacher_id, created_at, updated_at) VALUES
	(4, 'Session name', 'Session description', '2023-10-27 02:00:00', 1, '2024-11-26 19:21:35', '2024-12-13 11:24:17');

INSERT INTO PARTICIPATE (user_id, session_id) VALUES(2, 1);