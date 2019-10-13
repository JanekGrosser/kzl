CREATE TABLE `user` (
	`user_id` smallint NOT NULL AUTO_INCREMENT,
	`username_csr` char(3) NOT NULL UNIQUE,
	`first_name` varchar(30) NOT NULL,
	`last_name` varchar(30) NOT NULL,
	`phone_num` int NOT NULL,
	`fp_id` tinyint NOT NULL,
	`active` bool NOT NULL,
	`hash` varchar(255) NOT NULL,
	`role_id` tinyint NOT NULL,
	PRIMARY KEY (`user_id`)
);

CREATE TABLE `roles` (
	`role_id` tinyint NOT NULL AUTO_INCREMENT,
	`role` char(3) NOT NULL UNIQUE,
	PRIMARY KEY (`role_id`)
);

CREATE TABLE `fp` (
	`fp_id` tinyint NOT NULL AUTO_INCREMENT,
	`fp_name` varchar(20) NOT NULL,
	PRIMARY KEY (`fp_id`)
);

CREATE TABLE `shifts` (
	`shift_id` tinyint NOT NULL AUTO_INCREMENT,
	`shift_start` char(5) NOT NULL UNIQUE,
	`shift_duration` tinyint(4) NOT NULL,
	PRIMARY KEY (`shift_id`)
);

CREATE TABLE `man_shifts` (
	`workdays_id` int NOT NULL AUTO_INCREMENT,
	`user_id` smallint NOT NULL,
	`date` DATE NOT NULL,
	`shift_id` tinyint NOT NULL,
	`status_id` tinyint NOT NULL,
	`user_last_change` DATE NOT NULL,
	PRIMARY KEY (`workdays_id`)
);

CREATE TABLE `status` (
	`status_id` tinyint NOT NULL AUTO_INCREMENT,
	`status` char(4) NOT NULL UNIQUE,
	PRIMARY KEY (`status_id`)
);

ALTER TABLE `user` ADD CONSTRAINT `user_fk0` FOREIGN KEY (`fp_id`) REFERENCES `fp`(`fp_id`);

ALTER TABLE `user` ADD CONSTRAINT `user_fk1` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`);

ALTER TABLE `man_shifts` ADD CONSTRAINT `man_shifts_fk0` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`);

