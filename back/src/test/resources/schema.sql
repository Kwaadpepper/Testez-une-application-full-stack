DROP TABLE IF EXISTS PARTICIPATE;
DROP TABLE IF EXISTS SESSIONS;
DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS TEACHERS;

CREATE TABLE USERS (
  id int NOT NULL auto_increment,
  last_name varchar(40) DEFAULT NULL,
  first_name varchar(40) DEFAULT NULL,
  admin tinyint NOT NULL DEFAULT 0,
  email varchar(255) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  created_at timestamp(0) NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT current_timestamp() /* ON UPDATE current_timestamp() */,
  PRIMARY KEY (id)
);

CREATE TABLE TEACHERS (
  id int NOT NULL auto_increment,
  last_name varchar(40) DEFAULT NULL,
  first_name varchar(40) DEFAULT NULL,
  created_at timestamp(0) NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT current_timestamp() /* ON UPDATE current_timestamp() */,
  PRIMARY KEY (id)
);

CREATE TABLE SESSIONS (
  id int NOT NULL auto_increment,
  name varchar(50) DEFAULT NULL,
  description varchar(2000) DEFAULT NULL,
  date timestamp(0) NULL DEFAULT NULL,
  teacher_id int DEFAULT NULL,
  created_at timestamp(0) NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT current_timestamp() /* ON UPDATE current_timestamp() */,
  PRIMARY KEY (id),
  CONSTRAINT SESSIONS_ibfk_1 FOREIGN KEY (teacher_id) REFERENCES TEACHERS (id)
);

CREATE INDEX teacher_id ON SESSIONS (teacher_id);

CREATE TABLE PARTICIPATE (
  user_id int DEFAULT NULL auto_increment,
  session_id int DEFAULT NULL,
  CONSTRAINT PARTICIPATE_ibfk_1 FOREIGN KEY (user_id) REFERENCES USERS (id),
  CONSTRAINT PARTICIPATE_ibfk_2 FOREIGN KEY (session_id) REFERENCES SESSIONS (id)
);

CREATE INDEX user_id ON PARTICIPATE (user_id);
CREATE INDEX session_id ON PARTICIPATE (session_id);