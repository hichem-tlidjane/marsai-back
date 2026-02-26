-- Table user
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(190) NOT NULL UNIQUE,
    `firstname` VARCHAR(255),
    `lastname` VARCHAR(255),
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table movie
CREATE TABLE IF NOT EXISTS `movie` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `original_title` VARCHAR(255) NOT NULL,
    `english_title` VARCHAR(255) NOT NULL,
    `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `youtube_url` VARCHAR(255) UNIQUE,
    `video_path` VARCHAR(255),
    `cover_path` VARCHAR(255) NOT NULL,
    `duration` INT NOT NULL,
    `is_hybrid` BOOLEAN NOT NULL,
    `language` ENUM('FR','EN','SQ','AM','AR','HY','AZ','BN','BS','BG','MY','ZH','HR','CS','NL','DE','EL','GU','HA','HE','HI','HU','ID','IG','IT','JA','JV','KN','KK','KM','KO','MS','ML','MR','NE','FA','PL','PT','PA','RO','RU','SR','SI','ES','SW','TA','TE','TH','TR','UK','UR','VI','YO') NOT NULL,
    `original_synopsis` TEXT NOT NULL,
    `english_synopsis` TEXT NOT NULL,
    `creative_process` TEXT NOT NULL,
    `ai_tools` TEXT NOT NULL,
    `has_subs` BOOLEAN NOT NULL,
    `status` ENUM('draft','published','archived') NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS `collaborator` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(100),
    `lastname` VARCHAR(100),
    `gender` ENUM('Mr', 'Mme', 'Iel'),
    `email` VARCHAR(100),
    `job` VARCHAR(100),
    `contribution` VARCHAR(100),
    `address` VARCHAR(255),
    `zipcode` VARCHAR(20),
    `city` VARCHAR(100),
    `region` VARCHAR(100),
    `country` VARCHAR(100),
    `phone` VARCHAR(50),
    `birthdate` DATE,
    `facebook_url` VARCHAR(255),
    `instagram_url` VARCHAR(255),
    `youtube_url` VARCHAR(255),
    `linkedin_url` VARCHAR(255),
    `twitter_url` VARCHAR(255),
    `movie_id` INT NOT NULL,
    `is_director` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `event` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `status` ENUM('draft', 'published', 'canceled'),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `date` DATETIME NOT NULL,
    `duration` INT,
    `location` VARCHAR(255),
    `is_bookable` BOOLEAN NOT NULL DEFAULT FALSE,
    `capacity` INT NOT NULL CHECK (`capacity` > 0),
    `lang` ENUM('FR', 'EN')
);

CREATE TABLE IF NOT EXISTS `tag` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS `movie_tag`(
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `movie_id` INT NOT NULL,
    FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`) ON DELETE CASCADE,
    `tag_id` INT NOT NULL,
    FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `image` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(255) NOT NULL,
    `movie_id` INT NOT NULL,
    FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `role` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` ENUM('admin', 'jury')
);

CREATE TABLE IF NOT EXISTS `role_user` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    `role_id` INT NULL,
    FOREIGN KEY(`role_id`) REFERENCES `role`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `participant` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(100),
    `lastname` VARCHAR(100),
    `email` VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS `booking` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `participant_id` INT NOT NULL,
    FOREIGN KEY (`participant_id`) REFERENCES `participant`(`id`) ON DELETE CASCADE,
    `event_id` INT NOT NULL,
    FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE CASCADE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `cancelled_at` DATETIME
);

CREATE TABLE IF NOT EXISTS `newsletter` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `object` VARCHAR(100),
    `content` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `send_at` DATETIME,
    `sent` BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS `subscriber` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) UNIQUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `rating` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `note` INT NOT NULL CHECK (note >= 1 AND note <= 10),
    `comment` TEXT,
    `user_id` INT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    `movie_id` INT NOT NULL,
    FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`) ON DELETE CASCADE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO `role` (`name`) VALUES ('admin'), ('jury');
