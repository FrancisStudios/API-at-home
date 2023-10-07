-- CREATE TEST USER
CREATE USER 'unicumnet'@'%' IDENTIFIED VIA mysql_native_password USING '***';
GRANT USAGE ON *.* TO 'unicumnet'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT ALL PRIVILEGES ON `internetathome`.* TO 'unicumnet'@'%';


-- CREATE DB
CREATE DATABASE internetathome;

-- CREATE USERS TABLE
CREATE TABLE internetathome.users (
        _id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        uid int UNIQUE,
        username varchar(255),
        password varchar(255),
        nickname varchar(255),
        prefix text,
        language varchar(255),
        privileges text,
        GPF text,
        time_preference text,
        theme_preference text
);

INSERT INTO users (uid, username, password, nickname, prefix, language)
VALUES (1, 'francis', '123', 'Yehem' ,'Protector', 'Dynari');

INSERT INTO users (uid, username, password, nickname, prefix, language)
VALUES (2, 'test', 'habibi', 'Habibi' ,'Seikh', 'English');

INSERT INTO users (uid, username, password, nickname, prefix, language)
VALUES (3, 'yoachim', 'abc', 'Yoachim' ,'CEO', 'English');

INSERT INTO users (uid, username, password, nickname, prefix, language)
VALUES (4, 'blin', '123', 'Borislav' ,'King', 'English');

-- CREATE LABELS TABLE
CREATE TABLE internetathome.labels (
        _id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        label text
);

INSERT INTO labels (label) VALUES ('labello');
INSERT INTO labels (label) VALUES ('uwu');
INSERT INTO labels (label) VALUES ('labellissimo');
INSERT INTO labels (label) VALUES ('ez');

-- CREATE CATEGORIES TABLE
CREATE TABLE internetathome.categories (
        _id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        category text
);

INSERT INTO categories (category) VALUES ('categorio');
INSERT INTO categories (category) VALUES ('this');
INSERT INTO categories (category) VALUES ('that');
INSERT INTO categories (category) VALUES ('a category');

-- CREATE DATE TABLE
CREATE TABLE internetathome.date (
        date int NOT NULL,
        last_modified varchar(20),
        last_user int NOT NULL
);

INSERT INTO date (date, last_modified, last_user) VALUES (2445, '2023.09.07', 1);

-- CREATE ARTICLES TABLE
CREATE TABLE internetathome.articles (
        _id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        article_id text,
        title text,
        date int,
        author int,
        irl_date varchar(20),
        labels text,
        categories text,
        document text,
        likes text,
        number_of_likes int
);

INSERT INTO `articles` (`article_id`, `title`, `date`, `author`, `irl_date`, `labels`, `categories`, `document`, `likes`, `number_of_likes`) VALUES ('article_1', 'An article by Yehem', '2445', '1', '2023.9.7', '[\"labello\",\"uwu\"]', '[\"categorio\",\"that\",\"this\"]', '#This is the first working document innit?\r\n\r\nI wonder if this will work or nah', '[]', 0)