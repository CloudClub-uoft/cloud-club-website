DROP DATABASE IF EXISTS `cloudclub`;
CREATE DATABASE `cloudclub`;
USE `cloudclub`;
DROP TABLE IF EXISTS `clubmembers`;
CREATE TABLE `clubmembers` (
  `name` text,
  `bio` text
);
DROP TABLE IF EXISTS `logins`;
CREATE TABLE `logins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first-name` text NOT NULL,
  `last-name` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id`)
); 
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `subject` text NOT NULL,
  `report_verified` tinyint(1) DEFAULT NULL,
  `post_id` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
);
DROP TABLE IF EXISTS `forum`;
CREATE TABLE `forum` (
  `postid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `subject` text,
  `body` text,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`postid`),
  KEY `USER` (`userid`),
  KEY `DATE` (`timestamp`)
);