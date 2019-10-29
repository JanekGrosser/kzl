-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: KZLv3
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.18.04.1-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approval_sent_at`
--

DROP TABLE IF EXISTS `approval_sent_at`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `approval_sent_at` (
  `user_id` smallint(5) unsigned NOT NULL,
  `month_id` int(11) NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`month_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_sent_at`
--

LOCK TABLES `approval_sent_at` WRITE;
/*!40000 ALTER TABLE `approval_sent_at` DISABLE KEYS */;
/*!40000 ALTER TABLE `approval_sent_at` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `man_shifts`
--

DROP TABLE IF EXISTS `man_shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `man_shifts` (
  `user_id` smallint(6) NOT NULL,
  `month_id` int(11) NOT NULL,
  `day_number` tinyint(2) NOT NULL,
  `shift_id` tinyint(4) NOT NULL,
  `status_id` tinyint(4) NOT NULL,
  PRIMARY KEY (`user_id`,`month_id`,`day_number`,`shift_id`) USING BTREE,
  UNIQUE KEY `desc_index` (`user_id`,`month_id`,`day_number`,`shift_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `man_shifts`
--

LOCK TABLES `man_shifts` WRITE;
/*!40000 ALTER TABLE `man_shifts` DISABLE KEYS */;
INSERT INTO `man_shifts` VALUES (1,1,1,1,1),(1,1,1,3,1),(1,1,1,6,1),(1,1,1,7,1),(1,1,2,1,1),(1,1,4,7,1),(1,1,5,4,1),(1,1,5,5,1),(1,1,6,1,1),(1,1,9,2,1),(1,1,10,1,1),(1,1,11,7,1),(1,1,15,2,1),(1,1,16,3,1),(1,1,19,3,1),(1,1,19,4,1),(1,1,19,6,1),(1,1,20,7,1),(1,1,22,4,1),(1,1,22,6,1),(1,1,23,1,1),(1,1,23,2,1),(1,1,23,4,1),(1,1,23,5,1),(1,1,25,4,1),(1,1,25,5,1),(1,1,26,6,1),(1,1,27,5,1),(1,1,29,6,1),(1,1,30,1,1),(1,1,30,4,1),(1,2,1,1,1),(1,2,2,2,1),(1,2,2,4,1),(1,2,3,4,1),(1,2,4,3,1),(1,2,4,7,1),(1,2,5,7,1),(1,2,7,1,1),(1,2,7,6,1),(1,2,9,2,1),(1,2,10,7,1),(1,2,11,1,1),(1,2,11,3,1),(1,2,11,4,1),(1,2,13,5,1),(1,2,13,6,1),(1,2,15,1,1),(1,2,16,6,1),(1,2,17,1,1),(1,2,17,3,1),(1,2,17,4,1),(1,2,19,6,1),(1,2,21,7,1),(1,2,22,4,1),(1,2,23,1,1),(1,2,23,2,1),(1,2,25,3,1),(1,2,28,5,1),(1,2,28,6,1),(1,2,29,3,1),(1,2,30,2,1),(1,2,30,7,1),(2,1,1,8,1),(2,1,2,9,1),(2,1,2,11,1),(2,1,4,9,1),(2,1,6,8,1),(2,1,6,11,1),(2,1,7,9,1),(2,1,8,8,1),(2,1,8,10,1),(2,1,9,8,1),(2,1,9,10,1),(2,1,11,8,1),(2,1,13,8,1),(2,1,13,11,1),(2,1,16,8,1),(2,1,18,11,1),(2,1,19,8,1),(2,1,19,11,1),(2,1,22,8,1),(2,1,23,8,1),(2,1,23,11,1),(2,1,25,8,1),(2,1,25,9,1),(2,1,26,8,1),(2,1,28,8,1),(2,1,29,11,1),(2,1,30,8,1),(2,1,30,9,1),(2,1,30,10,1),(2,2,2,10,1),(2,2,3,10,1),(2,2,4,10,1),(2,2,7,8,1),(2,2,7,10,1),(2,2,8,8,1),(2,2,9,8,1),(2,2,11,8,1),(2,2,11,9,1),(2,2,12,9,1),(2,2,12,10,1),(2,2,13,9,1),(2,2,14,9,1),(2,2,15,9,1),(2,2,16,8,1),(2,2,17,8,1),(2,2,17,10,1),(2,2,18,10,1),(2,2,19,8,1),(2,2,19,9,1),(2,2,22,9,1),(2,2,23,8,1),(2,2,23,10,1),(2,2,24,8,1),(2,2,24,9,1),(2,2,28,10,1),(2,2,28,11,1),(2,2,29,8,1),(2,2,30,10,1),(2,2,30,11,1),(3,1,2,10,1),(3,1,3,8,1),(3,1,3,11,1),(3,1,4,8,1),(3,1,4,11,1),(3,1,5,8,1),(3,1,5,10,1),(3,1,7,8,1),(3,1,7,9,1),(3,1,7,11,1),(3,1,9,9,1),(3,1,10,8,1),(3,1,11,8,1),(3,1,11,9,1),(3,1,12,9,1),(3,1,13,11,1),(3,1,15,8,1),(3,1,15,10,1),(3,1,16,8,1),(3,1,16,10,1),(3,1,18,11,1),(3,1,19,8,1),(3,1,19,9,1),(3,1,20,8,1),(3,1,20,9,1),(3,1,20,10,1),(3,1,22,8,1),(3,1,22,11,1),(3,1,25,10,1),(3,1,26,9,1),(3,1,27,9,1),(3,1,28,9,1),(3,1,29,9,1),(3,2,1,8,1),(3,2,1,10,1),(3,2,2,8,1),(3,2,5,10,1),(3,2,6,8,1),(3,2,8,9,1),(3,2,8,10,1),(3,2,9,8,1),(3,2,10,8,1),(3,2,11,10,1),(3,2,12,8,1),(3,2,12,10,1),(3,2,13,8,1),(3,2,14,8,1),(3,2,14,9,1),(3,2,15,8,1),(3,2,15,10,1),(3,2,16,8,1),(3,2,17,9,1),(3,2,18,10,1),(3,2,19,10,1),(3,2,20,10,1),(3,2,21,8,1),(3,2,22,9,1),(3,2,23,8,1),(3,2,23,9,1),(3,2,23,10,1),(3,2,23,11,1),(3,2,24,8,1),(3,2,24,9,1),(3,2,24,10,1),(3,2,24,11,1),(3,2,25,9,1),(3,2,27,9,1),(3,2,27,11,1),(3,2,30,10,1),(3,3,2,8,1),(3,3,2,9,1),(3,3,2,10,1),(3,3,2,11,1),(3,3,3,8,1),(3,3,4,9,1),(3,3,5,10,1),(3,3,6,9,1),(3,3,7,8,1),(3,3,8,9,1),(3,3,9,10,1),(3,3,10,11,1),(3,3,11,10,1),(3,3,12,9,1),(3,3,13,8,1),(3,3,14,9,1),(3,3,15,10,1),(3,3,16,11,1),(3,3,17,10,1),(3,3,18,9,1),(3,3,19,8,1),(3,3,20,9,1),(3,3,21,10,1),(3,3,22,11,1),(3,3,23,10,1),(3,3,24,8,1),(3,3,24,9,1),(3,3,24,10,1),(3,3,24,11,1),(3,3,25,8,1),(3,3,25,9,1),(3,3,25,10,1),(3,3,25,11,1),(3,3,26,8,1),(3,3,26,9,1),(3,3,26,10,1),(3,3,26,11,1),(3,3,27,9,1),(3,3,27,10,1),(3,3,28,9,1),(3,3,28,10,1),(3,3,29,8,1),(3,3,29,9,1),(3,3,29,10,1),(3,3,29,11,1),(3,3,30,8,1),(3,3,30,9,1),(3,3,30,11,1),(3,4,1,8,1),(3,4,1,11,1),(3,4,2,9,1),(3,4,3,8,1),(3,4,3,10,1),(3,4,6,10,1),(3,4,7,11,1),(3,4,8,10,1),(3,4,11,8,1),(3,4,11,10,1),(3,4,11,11,1),(3,4,12,8,1),(3,4,12,11,1),(3,4,13,8,1),(3,4,13,9,1),(3,4,13,10,1),(3,4,13,11,1),(3,4,15,8,1),(3,4,15,9,1),(3,4,15,10,1),(3,4,15,11,1),(3,4,16,8,1),(3,4,16,10,1),(3,4,17,8,1),(3,4,17,9,1),(3,4,17,10,1),(3,4,17,11,1),(3,4,19,8,1),(3,4,19,9,1),(3,4,19,10,1),(3,4,19,11,1),(3,4,20,8,1),(3,4,21,8,1),(3,4,21,9,1),(3,4,21,10,1),(3,4,21,11,1),(3,4,23,8,1),(3,4,23,9,1),(3,4,23,10,1),(3,4,23,11,1),(3,4,24,8,1),(3,4,24,11,1),(3,4,25,8,1),(3,4,25,10,1),(3,4,25,11,1),(3,4,27,8,1),(3,4,27,9,1),(3,4,27,10,1),(3,4,27,11,1),(3,4,28,8,1),(3,4,28,11,1),(3,4,29,8,1),(3,4,29,10,1),(3,4,29,11,1),(4,1,1,9,1),(4,1,1,11,1),(4,1,4,9,1),(4,1,6,10,1),(4,1,7,8,1),(4,1,8,9,1),(4,1,8,10,1),(4,1,9,11,1),(4,1,10,10,1),(4,1,11,11,1),(4,1,13,8,1),(4,1,13,11,1),(4,1,14,10,1),(4,1,15,8,1),(4,1,16,8,1),(4,1,16,11,1),(4,1,17,10,1),(4,1,17,11,1),(4,1,18,10,1),(4,1,19,8,1),(4,1,19,10,1),(4,1,20,9,1),(4,1,21,10,1),(4,1,22,9,1),(4,1,24,10,1),(4,1,25,9,1),(4,1,26,11,1),(4,1,27,10,1),(4,1,28,9,1),(4,1,28,10,1),(4,1,29,10,1),(4,1,29,11,1),(4,1,30,11,1),(4,2,2,7,1),(4,2,2,8,1),(4,2,2,11,1),(4,2,6,9,1),(4,2,7,8,1),(4,2,9,8,1),(4,2,9,9,1),(4,2,9,10,1),(4,2,11,9,1),(4,2,12,8,1),(4,2,12,11,1),(4,2,13,9,1),(4,2,13,10,1),(4,2,13,11,1),(4,2,15,10,1),(4,2,16,8,1),(4,2,16,11,1),(4,2,17,10,1),(4,2,17,11,1),(4,2,19,8,1),(4,2,20,10,1),(4,2,20,11,1),(4,2,21,9,1),(4,2,21,10,1),(4,2,21,11,1),(4,2,22,9,1),(4,2,23,8,1),(4,2,26,9,1),(4,2,27,10,1),(4,2,28,8,1),(4,3,1,8,1),(5,1,1,3,1),(5,1,1,6,1),(5,1,3,4,1),(5,1,3,5,1),(5,1,7,5,1),(5,1,7,6,1),(5,1,8,3,1),(5,1,8,4,1),(5,1,9,4,1),(5,1,9,6,1),(5,1,10,5,1),(5,1,11,3,1),(5,1,11,4,1),(5,1,11,6,1),(5,1,12,5,1),(5,1,14,2,1),(5,1,15,1,1),(5,1,15,6,1),(5,1,16,5,1),(5,1,17,3,1),(5,1,17,4,1),(5,1,18,1,1),(5,1,18,4,1),(5,1,20,2,1),(5,1,20,5,1),(5,1,22,5,1),(5,1,24,1,1),(5,1,24,2,1),(5,1,24,7,1),(5,1,25,2,1),(5,1,26,4,1),(5,1,26,7,1),(5,1,27,1,1),(5,1,28,1,1),(5,1,29,5,1),(5,1,29,7,1),(5,1,30,5,1),(5,2,2,1,1),(5,2,3,1,1),(5,2,3,6,1),(5,2,5,1,1),(5,2,5,3,1),(5,2,5,4,1),(5,2,5,5,1),(5,2,5,7,1),(5,2,6,1,1),(5,2,6,2,1),(5,2,6,6,1),(5,2,7,1,1),(5,2,7,6,1),(5,2,8,2,1),(5,2,8,7,1),(5,2,9,5,1),(5,2,9,7,1),(5,2,10,4,1),(5,2,11,2,1),(5,2,11,7,1),(5,2,15,7,1),(5,2,16,3,1),(5,2,16,4,1),(5,2,17,1,1),(5,2,18,6,1),(5,2,19,6,1),(5,2,20,4,1),(5,2,20,7,1),(5,2,23,1,1),(5,2,24,3,1),(5,2,25,2,1),(5,2,26,6,1),(5,2,26,7,1),(5,2,27,6,1),(5,2,28,7,1),(5,2,29,5,1),(5,2,29,7,1),(5,2,30,1,1),(5,3,1,1,1),(5,3,1,2,1),(5,3,1,3,1),(5,3,2,2,1),(5,3,2,3,1),(5,3,2,5,1),(5,3,3,3,1),(5,3,4,1,1),(5,3,4,2,1),(5,3,4,3,1),(5,3,4,5,1),(5,3,5,3,1),(5,3,5,5,1),(5,3,5,6,1),(5,3,6,3,1),(5,3,6,5,1),(5,3,6,6,1),(5,3,6,7,1),(5,3,7,2,1),(5,3,7,3,1),(5,3,8,1,1),(5,3,8,2,1),(5,3,8,3,1),(5,3,9,2,1),(5,3,9,3,1),(5,3,9,5,1),(5,3,9,6,1),(5,3,10,3,1),(5,3,10,5,1),(5,3,10,6,1),(5,3,10,7,1),(5,3,11,2,1),(5,3,11,3,1),(5,3,11,5,1),(5,3,12,1,1),(5,3,12,2,1),(5,3,12,3,1),(5,3,13,2,1),(5,3,13,3,1),(5,3,13,5,1),(5,3,14,1,1),(5,3,14,2,1),(5,3,14,3,1),(5,3,14,5,1),(5,3,14,6,1),(5,3,15,3,1),(5,3,15,5,1),(5,3,15,6,1),(5,3,15,7,1),(5,3,16,2,1),(5,3,16,3,1),(5,3,17,1,1),(5,3,17,2,1),(5,3,19,1,1),(5,3,19,2,1),(5,3,19,4,1),(5,3,19,5,1),(5,3,19,7,1),(5,3,21,1,1),(5,3,21,3,1),(5,3,21,4,1),(5,3,21,6,1),(5,3,23,1,1),(5,3,23,7,1),(5,3,24,2,1),(5,3,24,6,1),(5,3,25,3,1),(5,3,25,5,1),(5,3,26,4,1),(5,3,27,4,1),(5,3,28,3,1),(5,3,28,5,1),(5,3,29,2,1),(5,3,29,6,1),(5,3,30,1,1),(5,3,30,7,1),(5,4,1,1,1),(5,4,1,4,1),(5,4,2,3,1),(5,4,2,5,1),(5,4,4,3,1),(5,4,4,5,1),(5,4,6,3,1),(5,4,6,6,1),(5,4,7,2,1),(5,4,7,4,1),(5,4,8,3,1),(5,4,8,5,1),(5,4,9,5,1),(5,4,9,7,1),(5,4,10,2,1),(5,4,10,6,1),(5,4,11,4,1),(5,4,12,2,1),(5,4,13,6,1),(5,4,14,4,1),(5,4,14,6,1),(5,4,15,2,1),(5,4,16,6,1),(5,4,17,4,1),(5,4,19,1,1),(5,4,19,3,1),(5,4,19,4,1),(5,4,20,6,1),(5,4,22,2,1),(5,4,22,5,1),(5,4,22,7,1),(5,4,26,3,1),(5,4,26,6,1),(5,4,29,2,1),(5,4,29,4,1),(5,4,29,6,1),(5,4,31,2,1),(5,4,31,4,1),(5,5,1,1,1),(5,5,1,2,1),(5,5,1,3,1),(5,5,1,4,1),(5,5,1,5,1),(5,5,1,6,1),(5,5,1,7,1),(5,5,2,1,1),(5,5,2,7,1),(5,5,3,1,1),(5,5,3,5,1),(5,5,3,7,1),(5,5,4,1,1),(5,5,4,5,1),(5,5,4,6,1),(5,5,4,7,1),(5,5,6,1,1),(5,5,6,2,1),(5,5,6,3,1),(5,5,6,4,1),(5,5,6,5,1),(5,5,6,6,1),(5,5,6,7,1),(5,5,7,1,1),(5,5,7,7,1),(5,5,8,1,1),(5,5,8,5,1),(5,5,8,7,1),(5,5,9,1,1),(5,5,9,5,1),(5,5,9,6,1),(5,5,9,7,1),(5,5,12,1,1),(5,5,12,2,1),(5,5,12,3,1),(5,5,12,4,1),(5,5,12,5,1),(5,5,12,6,1),(5,5,13,7,1),(5,5,14,5,1),(5,5,14,6,1),(5,5,14,7,1),(5,5,15,7,1),(5,5,16,1,1),(5,5,16,2,1),(5,5,16,3,1),(5,5,16,4,1),(5,5,16,5,1),(5,5,16,6,1),(5,5,18,1,1),(5,5,18,2,1),(5,5,18,3,1),(5,5,18,4,1),(5,5,18,5,1),(5,5,18,6,1),(5,5,18,7,1),(5,5,19,1,1),(5,5,19,4,1),(5,5,20,1,1),(5,5,20,4,1),(5,5,21,2,1),(5,5,21,3,1),(5,6,1,1,1),(5,6,1,2,1),(5,6,1,3,1),(5,6,1,4,1),(5,6,1,7,1),(5,6,2,1,1),(5,6,2,4,1),(5,6,2,7,1),(5,6,3,1,1),(5,6,3,4,1),(5,6,3,7,1),(5,6,4,1,1),(5,6,4,4,1),(5,6,4,7,1),(5,6,5,1,1),(5,6,5,4,1),(5,6,5,5,1),(5,6,5,6,1),(5,6,5,7,1),(5,6,7,2,1),(5,6,7,3,1),(5,6,7,4,1),(5,6,7,5,1),(5,6,7,6,1),(5,6,8,1,1),(5,6,8,4,1),(5,6,8,7,1),(5,6,9,1,1),(5,6,9,4,1),(5,6,9,7,1),(5,6,10,1,1),(5,6,10,4,1),(5,6,10,7,1),(5,6,11,1,1),(5,6,11,7,1),(5,6,13,1,1),(5,6,13,2,1),(5,6,13,6,1),(5,6,13,7,1),(5,6,14,3,1),(5,6,14,5,1),(5,6,15,4,1),(5,6,16,3,1),(5,6,16,5,1),(5,6,17,1,1),(5,6,17,2,1),(5,6,17,6,1),(5,6,17,7,1),(5,6,19,1,1),(5,6,19,2,1),(5,6,19,3,1),(5,6,20,4,1),(5,6,21,5,1),(5,6,21,6,1),(5,6,21,7,1),(5,6,22,4,1),(5,6,23,1,1),(5,6,23,2,1),(5,6,23,3,1),(5,6,23,7,1),(5,6,25,4,1),(5,6,25,5,1),(5,6,25,6,1),(5,6,25,7,1),(5,6,26,7,1),(5,6,27,4,1),(5,6,27,5,1),(5,6,27,6,1),(5,6,27,7,1),(5,6,29,4,1),(5,6,29,6,1),(5,6,29,7,1),(6,1,2,2,1),(6,1,2,4,1),(6,1,3,2,1),(6,1,3,4,1),(6,1,4,2,1),(6,1,4,7,1),(6,1,5,1,1),(6,1,5,5,1),(6,1,5,6,1),(6,1,6,7,1),(6,1,7,4,1),(6,1,9,2,1),(6,1,11,4,1),(6,1,11,7,1),(6,1,12,6,1),(6,1,13,2,1),(6,1,13,3,1),(6,1,14,2,1),(6,1,15,5,1),(6,1,17,1,1),(6,1,18,7,1),(6,1,19,4,1),(6,1,20,3,1),(6,1,21,4,1),(6,1,23,5,1),(6,1,23,7,1),(6,1,24,7,1),(6,1,25,4,1),(6,1,25,5,1),(6,1,28,4,1),(6,1,28,6,1),(6,2,1,4,1),(6,2,2,6,1),(6,2,3,7,1),(6,2,5,3,1),(6,2,6,4,1),(6,2,7,4,1),(6,2,8,3,1),(6,2,8,6,1),(6,2,10,2,1),(6,2,11,1,1),(6,2,11,4,1),(6,2,13,7,1),(6,2,14,1,1),(6,2,15,2,1),(6,2,15,4,1),(6,2,16,4,1),(6,2,16,7,1),(6,2,17,1,1),(6,2,17,3,1),(6,2,17,7,1),(6,2,18,1,1),(6,2,19,1,1),(6,2,19,7,1),(6,2,22,2,1),(6,2,22,6,1),(6,2,24,3,1),(6,2,24,5,1),(6,2,24,7,1),(6,2,25,7,1),(6,2,26,2,1),(6,2,28,1,1),(6,2,29,5,1),(7,1,3,2,1),(7,1,4,5,1),(7,1,5,1,1),(7,1,6,2,1),(7,1,8,1,1),(7,1,9,7,1),(7,1,10,2,1),(7,1,11,3,1),(7,1,12,7,1),(7,1,15,2,1),(7,1,16,4,1),(7,1,17,1,1),(7,1,17,7,1),(7,1,18,6,1),(7,1,18,7,1),(7,1,19,2,1),(7,1,21,1,1),(7,1,21,3,1),(7,1,21,5,1),(7,1,23,1,1),(7,1,23,3,1),(7,1,26,3,1),(7,1,26,6,1),(7,1,26,7,1),(7,1,27,3,1),(7,1,30,5,1),(7,1,30,6,1),(7,2,2,1,1),(7,2,2,2,1),(7,2,4,2,1),(7,2,5,4,1),(7,2,5,7,1),(7,2,6,1,1),(7,2,8,6,1),(7,2,8,7,1),(7,2,10,7,1),(7,2,11,1,1),(7,2,16,7,1),(7,2,17,7,1),(7,2,19,6,1),(7,2,25,1,1),(7,2,25,6,1),(7,2,25,7,1),(7,2,27,5,1),(7,2,27,6,1),(7,2,27,7,1),(7,2,28,1,1),(7,2,28,3,1),(7,2,29,5,1),(7,2,30,4,1),(8,1,2,1,1),(8,1,3,4,1),(8,1,3,6,1),(8,1,8,6,1),(8,1,9,3,1),(8,1,9,6,1),(8,1,10,1,1),(8,1,10,5,1),(8,1,11,4,1),(8,1,11,5,1),(8,1,12,3,1),(8,1,12,6,1),(8,1,13,1,1),(8,1,13,3,1),(8,1,14,3,1),(8,1,15,1,1),(8,1,16,4,1),(8,1,17,2,1),(8,1,18,4,1),(8,1,20,2,1),(8,1,20,5,1),(8,1,22,4,1),(8,1,23,1,1),(8,1,23,6,1),(8,1,24,1,1),(8,1,24,6,1),(8,1,25,2,1),(8,1,26,1,1),(8,1,26,2,1),(8,1,26,7,1),(8,1,27,6,1),(8,1,27,7,1),(8,1,28,2,1),(8,1,28,7,1),(8,1,29,2,1),(8,1,29,4,1),(8,1,29,7,1),(8,2,1,2,1),(8,2,2,4,1),(8,2,3,2,1),(8,2,4,4,1),(8,2,6,3,1),(8,2,7,2,1),(8,2,8,2,1),(8,2,9,7,1),(8,2,10,6,1),(8,2,12,2,1),(8,2,12,4,1),(8,2,13,1,1),(8,2,13,6,1),(8,2,14,2,1),(8,2,15,7,1),(8,2,17,1,1),(8,2,17,6,1),(8,2,19,7,1),(8,2,20,5,1),(8,2,21,2,1),(8,2,21,7,1),(8,2,22,7,1),(8,2,23,6,1),(8,2,24,7,1),(8,2,25,7,1),(8,2,26,4,1),(8,2,27,4,1),(8,2,27,5,1),(8,2,28,2,1),(8,2,28,5,1),(8,2,29,7,1),(9,1,2,6,1),(9,1,6,6,1),(9,1,7,1,1),(9,1,7,5,1),(9,1,8,7,1),(9,1,9,2,1),(9,1,9,5,1),(9,1,9,7,1),(9,1,11,2,1),(9,1,13,5,1),(9,1,14,1,1),(9,1,16,1,1),(9,1,17,4,1),(9,1,19,2,1),(9,1,19,6,1),(9,1,20,7,1),(9,1,21,2,1),(9,1,21,7,1),(9,1,22,6,1),(9,1,23,1,1),(9,1,25,3,1),(9,1,29,4,1),(9,1,29,6,1),(9,1,30,1,1),(9,1,30,5,1),(9,2,1,2,1),(9,2,2,1,1),(9,2,3,6,1),(9,2,3,7,1),(9,2,5,6,1),(9,2,6,2,1),(9,2,7,2,1),(9,2,8,1,1),(9,2,8,4,1),(9,2,10,1,1),(9,2,11,7,1),(9,2,13,5,1),(9,2,13,6,1),(9,2,14,6,1),(9,2,16,3,1),(9,2,18,3,1),(9,2,19,4,1),(9,2,19,5,1),(9,2,19,6,1),(9,2,21,1,1),(9,2,21,2,1),(9,2,21,5,1),(9,2,21,6,1),(9,2,21,7,1),(9,2,25,1,1),(9,2,25,4,1),(9,2,27,7,1),(9,2,28,1,1),(9,2,28,4,1),(10,1,1,3,1),(10,1,1,4,1),(10,1,2,5,1),(10,1,4,5,1),(10,1,6,4,1),(10,1,8,1,1),(10,1,8,7,1),(10,1,9,2,1),(10,1,10,4,1),(10,1,10,7,1),(10,1,11,3,1),(10,1,11,6,1),(10,1,12,1,1),(10,1,13,6,1),(10,1,14,2,1),(10,1,14,3,1),(10,1,15,5,1),(10,1,16,6,1),(10,1,17,2,1),(10,1,17,3,1),(10,1,18,2,1),(10,1,18,4,1),(10,1,19,2,1),(10,1,19,7,1),(10,1,20,2,1),(10,1,20,5,1),(10,1,21,2,1),(10,1,23,5,1),(10,1,24,5,1),(10,1,25,1,1),(10,1,25,4,1),(10,1,26,1,1),(10,1,28,3,1),(10,1,28,5,1),(10,1,29,2,1),(10,2,2,1,1),(10,2,3,5,1),(10,2,5,2,1),(10,2,5,5,1),(10,2,6,4,1),(10,2,7,5,1),(10,2,8,6,1),(10,2,9,4,1),(10,2,9,7,1),(10,2,13,4,1),(10,2,13,6,1),(10,2,14,1,1),(10,2,14,5,1),(10,2,16,2,1),(10,2,17,2,1),(10,2,18,3,1),(10,2,18,5,1),(10,2,19,2,1),(10,2,19,3,1),(10,2,19,6,1),(10,2,22,1,1),(10,2,22,2,1),(10,2,24,1,1),(10,2,24,3,1),(10,2,26,5,1),(10,2,27,6,1),(10,2,29,2,1),(10,2,30,7,1),(11,1,1,7,1),(11,1,2,5,1),(11,1,6,5,1),(11,1,7,3,1),(11,1,7,4,1),(11,1,7,6,1),(11,1,8,4,1),(11,1,8,6,1),(11,1,11,2,1),(11,1,11,4,1),(11,1,11,6,1),(11,1,14,5,1),(11,1,14,6,1),(11,1,17,5,1),(11,1,21,3,1),(11,1,21,5,1),(11,1,21,6,1),(11,1,22,1,1),(11,1,22,2,1),(11,1,23,1,1),(11,1,23,3,1),(11,1,23,6,1),(11,1,24,5,1),(11,1,25,4,1),(11,1,25,5,1),(11,1,26,5,1),(11,1,27,1,1),(11,1,28,1,1),(11,1,28,6,1),(11,1,29,7,1),(11,1,30,4,1),(11,1,30,5,1),(11,1,30,6,1),(11,2,1,2,1),(11,2,1,5,1),(11,2,1,7,1),(11,2,3,3,1),(11,2,3,7,1),(11,2,5,1,1),(11,2,7,2,1),(11,2,7,5,1),(11,2,9,2,1),(11,2,10,3,1),(11,2,10,4,1),(11,2,11,7,1),(11,2,12,1,1),(11,2,12,5,1),(11,2,13,1,1),(11,2,15,7,1),(11,2,16,5,1),(11,2,17,3,1),(11,2,19,3,1),(11,2,19,4,1),(11,2,20,2,1),(11,2,20,6,1),(11,2,21,6,1),(11,2,23,2,1),(11,2,23,7,1),(11,2,24,1,1),(11,2,26,5,1),(11,2,26,7,1),(11,2,27,5,1),(11,2,27,6,1),(11,2,29,3,1),(12,1,1,6,1),(12,1,4,3,1),(12,1,4,6,1),(12,1,7,6,1),(12,1,8,6,1),(12,1,8,7,1),(12,1,9,5,1),(12,1,12,5,1),(12,1,13,1,1),(12,1,13,4,1),(12,1,14,4,1),(12,1,15,4,1),(12,1,15,7,1),(12,1,16,2,1),(12,1,17,1,1),(12,1,19,4,1),(12,1,19,7,1),(12,1,21,2,1),(12,1,23,2,1),(12,1,24,5,1),(12,1,26,3,1),(12,1,26,7,1),(12,1,30,1,1),(12,1,30,5,1),(12,2,4,1,1),(12,2,5,3,1),(12,2,6,2,1),(12,2,6,7,1),(12,2,7,7,1),(12,2,8,2,1),(12,2,9,1,1),(12,2,10,4,1),(12,2,10,6,1),(12,2,11,3,1),(12,2,11,7,1),(12,2,12,1,1),(12,2,12,2,1),(12,2,12,7,1),(12,2,13,5,1),(12,2,14,7,1),(12,2,16,1,1),(12,2,16,5,1),(12,2,16,7,1),(12,2,17,1,1),(12,2,18,2,1),(12,2,22,4,1),(12,2,22,7,1),(12,2,25,2,1),(12,2,25,6,1),(12,2,26,2,1),(12,2,26,4,1),(12,2,28,1,1),(12,2,28,7,1),(12,2,29,1,1),(12,2,29,6,1),(12,2,30,4,1),(13,1,2,4,1),(13,1,4,3,1),(13,1,5,2,1),(13,1,6,3,1),(13,1,8,4,1),(13,1,8,5,1),(13,1,9,1,1),(13,1,9,4,1),(13,1,12,5,1),(13,1,12,7,1),(13,1,13,3,1),(13,1,16,7,1),(13,1,17,1,1),(13,1,19,4,1),(13,1,20,3,1),(13,1,21,3,1),(13,1,24,7,1),(13,1,25,7,1),(13,1,26,2,1),(13,1,26,4,1),(13,1,27,5,1),(13,2,2,1,1),(13,2,2,5,1),(13,2,3,3,1),(13,2,4,6,1),(13,2,5,6,1),(13,2,6,5,1),(13,2,7,5,1),(13,2,8,1,1),(13,2,8,2,1),(13,2,9,2,1),(13,2,9,7,1),(13,2,11,4,1),(13,2,12,2,1),(13,2,12,3,1),(13,2,13,2,1),(13,2,13,3,1),(13,2,14,5,1),(13,2,15,2,1),(13,2,15,6,1),(13,2,16,5,1),(13,2,17,1,1),(13,2,17,5,1),(13,2,17,7,1),(13,2,23,6,1),(13,2,25,3,1),(13,2,25,6,1),(13,2,26,1,1),(13,2,27,2,1),(13,2,29,7,1),(13,2,30,6,1),(14,1,1,4,1),(14,1,2,5,1),(14,1,3,6,1),(14,1,3,7,1),(14,1,4,2,1),(14,1,5,2,1),(14,1,6,5,1),(14,1,6,7,1),(14,1,7,4,1),(14,1,8,3,1),(14,1,10,2,1),(14,1,10,4,1),(14,1,10,6,1),(14,1,12,1,1),(14,1,13,2,1),(14,1,13,5,1),(14,1,13,6,1),(14,1,16,4,1),(14,1,17,4,1),(14,1,18,2,1),(14,1,18,5,1),(14,1,20,5,1),(14,1,20,7,1),(14,1,22,5,1),(14,1,22,6,1),(14,1,23,1,1),(14,1,24,2,1),(14,1,24,5,1),(14,1,24,7,1),(14,1,25,2,1),(14,1,25,5,1),(14,1,26,3,1),(14,1,26,4,1),(14,1,26,6,1),(14,1,26,7,1),(14,1,27,5,1),(14,1,30,1,1),(14,1,30,3,1),(14,2,3,2,1),(14,2,3,3,1),(14,2,4,4,1),(14,2,5,3,1),(14,2,5,6,1),(14,2,5,7,1),(14,2,6,4,1),(14,2,7,4,1),(14,2,11,1,1),(14,2,11,2,1),(14,2,12,1,1),(14,2,13,1,1),(14,2,13,3,1),(14,2,14,3,1),(14,2,16,4,1),(14,2,16,5,1),(14,2,17,3,1),(14,2,17,7,1),(14,2,18,2,1),(14,2,18,7,1),(14,2,19,3,1),(14,2,22,3,1),(14,2,22,7,1),(14,2,25,5,1),(14,2,26,3,1),(14,2,28,2,1),(14,2,29,7,1),(14,2,30,2,1),(14,2,30,5,1),(15,1,3,6,1),(15,1,3,7,1),(15,1,5,3,1),(15,1,5,4,1),(15,1,7,3,1),(15,1,7,5,1),(15,1,8,4,1),(15,1,9,4,1),(15,1,10,1,1),(15,1,10,4,1),(15,1,11,1,1),(15,1,11,3,1),(15,1,12,6,1),(15,1,13,1,1),(15,1,16,4,1),(15,1,18,5,1),(15,1,23,5,1),(15,1,23,7,1),(15,1,24,6,1),(15,1,25,7,1),(15,1,27,1,1),(15,1,27,6,1),(15,1,28,6,1),(15,1,29,4,1),(15,1,30,6,1),(15,2,1,3,1),(15,2,1,7,1),(15,2,2,1,1),(15,2,4,5,1),(15,2,6,5,1),(15,2,8,1,1),(15,2,9,2,1),(15,2,9,7,1),(15,2,10,3,1),(15,2,11,4,1),(15,2,12,5,1),(15,2,15,3,1),(15,2,15,4,1),(15,2,17,3,1),(15,2,17,6,1),(15,2,18,1,1),(15,2,18,2,1),(15,2,18,4,1),(15,2,19,2,1),(15,2,21,6,1),(15,2,23,2,1),(15,2,24,5,1),(15,2,25,7,1),(15,2,29,5,1),(15,2,30,4,1);
/*!40000 ALTER TABLE `man_shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `months`
--

DROP TABLE IF EXISTS `months`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `months` (
  `month_id` int(11) NOT NULL AUTO_INCREMENT,
  `year_month` varchar(7) NOT NULL,
  PRIMARY KEY (`month_id`),
  UNIQUE KEY `year_month_UNIQUE` (`year_month`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `months`
--

LOCK TABLES `months` WRITE;
/*!40000 ALTER TABLE `months` DISABLE KEYS */;
INSERT INTO `months` VALUES (1,'2019-09'),(2,'2019-10'),(3,'2019-11'),(4,'2019-12'),(5,'2020-01'),(6,'2020-02'),(7,'2020-03'),(8,'2020-04'),(9,'2020-05'),(10,'2020-06'),(11,'2020-07'),(12,'2020-08'),(13,'2020-09'),(14,'2020-10'),(15,'2020-11'),(16,'2020-12');
/*!40000 ALTER TABLE `months` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `role_id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `role` char(3) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'adm'),(3,'ins'),(4,'koo'),(5,'koz'),(2,'ser'),(6,'tmp');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shifts` (
  `shift_id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `shift_start` smallint(4) unsigned zerofill NOT NULL,
  `role_id` tinyint(4) NOT NULL,
  PRIMARY KEY (`shift_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
INSERT INTO `shifts` VALUES (1,0540,3),(2,0660,3),(3,0780,3),(4,0900,3),(5,1020,3),(6,1140,3),(7,1260,3),(8,0540,2),(9,0720,2),(10,0900,2),(11,1080,2);
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status` (
  `status_id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `status` varchar(20) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`status_id`),
  UNIQUE KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (2,'approval'),(3,'approval-added'),(4,'approval-removed'),(5,'approved'),(6,'approved-added'),(7,'approved-removed'),(8,'current-added'),(9,'current-removed'),(1,'editable');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subdivisions`
--

DROP TABLE IF EXISTS `subdivisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subdivisions` (
  `subdivision_id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `subdivision_name` varchar(20) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`subdivision_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subdivisions`
--

LOCK TABLES `subdivisions` WRITE;
/*!40000 ALTER TABLE `subdivisions` DISABLE KEYS */;
INSERT INTO `subdivisions` VALUES (1,'Warszawa 1'),(2,'Warszawa 2'),(3,'Warszawa 3'),(4,'Gdańsk 1'),(5,'Gdańsk 2'),(6,'Gdańsk 3'),(7,'Sosnowiec 1'),(8,'Radom 1'),(9,'Suwałki 1');
/*!40000 ALTER TABLE `subdivisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `username_csr` char(3) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `phone_num` varchar(9) COLLATE utf8_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL,
  `hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `role_id` tinyint(4) NOT NULL,
  `last_pass_reset` timestamp(2) NOT NULL DEFAULT '2018-12-31 23:00:01.00',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_csr` (`username_csr`),
  KEY `fk_users_1_idx` (`role_id`),
  CONSTRAINT `fk_users_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ado','Lindsey','Hudson','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(2,'ais','Tommie Lee Jones','McDermott','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',2,'2018-12-31 23:00:01.00'),(3,'ale','Jacquelyn','Glover','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',2,'2018-12-31 23:00:01.00'),(4,'alf','Pearline','Blick','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',2,'2018-12-31 23:00:01.00'),(5,'all','Ettie','Kautzer','605310490',1,'$2b$10$O7cL48srNtAg7lgbbHuBoeXxpHz13JqwQBD.iTW1kVdYW.V4J272q',3,'2018-12-31 23:00:01.00'),(6,'alv','Crystel','Huels','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(7,'ang','Violet','Morar','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(8,'ani','Arjun','Graham','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(9,'are','Hailie','Tremblay','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(10,'ash','Ole','Cummerata','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(11,'auf','Clark','Towne','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(12,'aus','Theresia','Connelly','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(13,'ayd','Mariane','Kulas','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(14,'bee','John','Dare','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(15,'ber','Lucienne','McKenzie','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(16,'bgi','Meghan','Miller','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(17,'bin','Kaitlyn','Bauch','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(18,'blo','Susan','Hammes','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(19,'bos','Kay','Kshlerin','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(20,'bra','Heloise','Steuber','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',3,'2018-12-31 23:00:01.00'),(21,'bre','Ervin','Mertz','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',4,'2018-12-31 23:00:01.00'),(22,'bro','Annetta','Bode','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',4,'2018-12-31 23:00:01.00'),(23,'bst','Krystal','Eichmann','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',4,'2018-12-31 23:00:01.00'),(24,'car','Albin','Smith','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',4,'2018-12-31 23:00:01.00'),(25,'cbo','Sonya','King','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',4,'2018-12-31 23:00:01.00'),(26,'PRE','Josianne','Langworth','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',5,'2018-12-31 23:00:01.00'),(27,'chr','Else','Lueilwitz','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(28,'cla','Trystan','Steuber','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(29,'cle','Wilmer','Hackett','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(30,'con','Mohammed','Crona','605310490',0,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(31,'cry','Grady','Hamill','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(32,'csc','Genevieve','Beer','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(33,'cum','Tracy','Ebert','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(34,'CVX','Filip','Testowyć','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(35,'cwi','Cristal','Trantow','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(36,'cyd','Lacy','Keeling','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(37,'d\'a','Bryana','Oberbrunner','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(38,'dar','Dorris','Volkman','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(39,'dia','Providenci','Jones','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(40,'dor','Oleta','Christiansen','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(41,'ele','Clay','Schroeder','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(42,'emi','Cora','Dach','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(43,'eni','April','Leuschke','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(44,'esw','Mollie','Orn','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(45,'eug','Sam','Kulas','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(46,'fre','Mackenzie','Kuhic','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(47,'fri','Emerald','Bins','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(48,'ger','Roslyn','Wolf','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(49,'gil','Timothy','Glover','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(50,'gku','Maymie','Price','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(51,'gus','Ted','Schmeler','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(52,'haa','Lou','Kohler','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(53,'har','Eulah','Koch','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(54,'hom','Dustin','Stanton','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(55,'ida','Millie','Grady','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(56,'jac','Anita','Fay','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(57,'jam','Dane','Kris','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(58,'jar','Julianne','Muller','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(59,'jen','Stevie','Ruecker','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(60,'jja','Yvette','Boyer','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(61,'jly','Steve','Tremblay','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(62,'joh','Gregoria','Prohaska','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(63,'JTY','Jan','Testowyć','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(64,'jud','Tanner','Morar','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(65,'kas','Lula','Considine','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(66,'TST','Królewicz','ŻóŁty','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',2,'2018-12-31 23:00:01.00'),(67,'kri','Bernadine','Fay','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(68,'kun','Douglas','Predovic','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(69,'kwi','Bernard','Stanton','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(70,'L21','Żaneta','Gęgała','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(71,'lam','Jovan','Morissette','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(72,'law','Adrian','Cremin','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(73,'lee','Zoe','Lemke','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(74,'leo','Hazle','Hayes','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(75,'les','Nigel','Ullrich','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(76,'leu','Bridie','Bernhard','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(77,'lin','Dolores','Schimmel','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(78,'lku','Renee','Schuppe','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(79,'mar','Trey','Herzog','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(80,'mat','Janelle','Hegmann','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(81,'max','Peter','Hessel','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(82,'may','Harmon','Reinger','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(83,'mcg','Missouri','Raynor','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(84,'mfe','Candace','Koelpin','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(85,'mil','Earnest','Bode','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(86,'mit','Jennyfer','Osinski','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(87,'mle','Giovani','Krajcik','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(88,'mor','Julius','Reynolds','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(89,'mru','Garnet','Becker','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(90,'8io','trx22w','test13','605310231',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(91,'N12','Zenek','Testowyć','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(92,'nel','Armando','Bogisich','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(93,'NEW','Natalia','Testowyć','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(94,'nma','Maurine','Abbott','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(95,'NOW','Jan','Nowakćśłóęźż','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(96,'nri','Tom','Hodkiewicz','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(97,'obe','Lisa','King','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(98,'oci','Prudence','Collier','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(99,'ode','Dovie','Prohaska','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(100,'olo','Josefina','Schulist','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(101,'orn','Geo','Dietrich','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(102,'ort','Olin','Keebler','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(103,'osi','Princess','Hills','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(104,'ott','Oscar','Feest','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(105,'pen','Winifred','Nikolaus','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(106,'pgo','Robin','Klein','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(107,'ple','Vaughn','Hirthe','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(108,'qgr','Lulu','Erdman','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(109,'qku','Maude','Hand','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(110,'ral','Teagan','Carroll','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(111,'rap','Golda','Kemmer','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(112,'rca','Ulices','Kiehn','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(113,'ric','Webster','Bartoletti','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(114,'rku','Bernadette','Hackett','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(115,'rog','Kaley','Hayes','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(116,'ros','Dangelo','Toy','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(117,'row','Laura','Stoltenberg','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(118,'rue','Nelle','Harber','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(119,'sch','Karelle','Tillman','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(120,'sel','Nathen','Rogahn','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(121,'she','Rosina','Crooks','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(122,'sly','Laurianne','Harvey','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(123,'tay','Shannon','Kutch','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(124,'ter','Itzel','Streich','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(125,'tow','Kyle','Dietrich','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(126,'tyr','Fausto','Cartwright','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(127,'uke','Brain','Collins','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(128,'ura','Orlo','Hyatt','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(129,'val','Marge','Treutel','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(130,'vha','Buck','Ernser','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(131,'vir','Bret','Ritchie','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(132,'vol','Elza','Paucek','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(133,'wai','Eudora','Swift','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(134,'wei','Kelli','Bogan','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(135,'win','Earl','Kirlin','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(136,'xsa','Zdzisław','Wąchóś','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(137,'XXX','Zdzisław','Wąchóś','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(138,'yqu','Magali','Watsica','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(139,'zgo','Albertha','Murphy','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(140,'zob','Magnolia','Gibson','605310490',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(179,'666','Zdzisław','Wąchóś','636555344',1,'$2b$10$s.2v6oiCqvc3R2lOhSNvt.tQKVYqYaEfWNhszgXQuerdGhe.goYLG',1,'2018-12-31 23:00:01.00'),(180,'11f','trx22w','test13','605310231',1,'$2b$10$5CureUTlh7G6r2waIwzOxumepBN7l8PTMgAPgFDO25fWorzK/EQzi',2,'2018-12-31 23:00:01.00'),(182,'FFE','Jańcio','Bańcio','605310490',1,'$2b$10$CtMYYM8tRsJ5CXAmxvA7vecBM5tVkBe5.mbsD/nJ4DC1Nps93r1TK',3,'2018-12-31 23:00:01.00'),(183,'YTT','Jan','Man','605310490',1,'$2b$10$OjfhVJJf/0BGg.qlPB9rpufWOKzUmcLye3doZBOVGS9ygRRKN3Yqq',3,'2018-12-31 23:00:01.00'),(184,'UUU','qwq','d7','605310490',1,'$2b$10$rfgGRJPOoerfKNKz8QwHBe0D5sbmWYweGem8s2QM6gb.J28kFTfMK',4,'2018-12-31 23:00:01.00'),(185,'qwe','qd','ee','605310490',1,'$2b$10$kqKPGmjp8rMEoqlC61uVFu3fYOgt4aSi2iSq6ny7eIqEQGcdclT8e',3,'2018-12-31 23:00:01.00'),(187,'AA2','qd','ee','605310490',1,'$2b$10$IiJyBIZTR9sFTRhCr9cGDO9qYZVFdEQVaPC7UbaE4g3TLxoCuqExS',3,'2018-12-31 23:00:01.00'),(189,'r3w','qd','ee','605310490',1,'$2b$10$LXOEsEhrPKuJxlfQ7sSHAeCTVRhs0361OSRwA4qAASywVq2zMKQ2y',3,'2018-12-31 23:00:01.00'),(191,'r34','qd','ee3231','605310490',1,'$2b$10$5XZF8VN9NfIi20C.y14jDurXncnJBAIHsqr/BIqlJ5wAdjU5jinl.',3,'2018-12-31 23:00:01.00'),(192,'333','23','23','605310490',1,'$2b$10$yp.C5n95/aDbid8X7MC.nuW1iIJ5JMqbGSsFI1JpKc7N/tM7paUBW',2,'2018-12-31 23:00:01.00'),(193,'FDa','ASD','asd','605310490',1,'$2b$10$ok2e9yPsaM.XWH.sBPDOducaapMjZPwUt2fZiqvbefDcJCnZKm8TS',4,'2018-12-31 23:00:01.00'),(194,'xcv','jjfffff','ggg','605310490',1,'$2b$10$NUTB1OFJehUjlGAx1GlMCOzuiffPOvUcghiGYRHzG0NF87ilLmymC',2,'2018-12-31 23:00:01.00'),(195,'fd5','123','123','605310490',1,'$2b$10$p2X2j..o/T7gCRVIS71i/exwqStmZYrM47kr8LYlTS9fqb8POIfLG',5,'2018-12-31 23:00:01.00'),(196,'t44','123','1234','605310490',1,'$2b$10$STq2b0vgPHrH5NBFpLUB1eDrYkGrjqld.WsKouauQLLcb1PT8BAUG',4,'2018-12-31 23:00:01.00'),(200,'tr8','trx22w','test13','605310231',1,'$2b$10$hhrb2qvRqWp6yeEDuG3qLe7WPqPQoRjiWCfeuNxgp6tQSVSbYPQV2',1,'2018-12-31 23:00:01.00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `users_auth_view`
--

DROP TABLE IF EXISTS `users_auth_view`;
/*!50001 DROP VIEW IF EXISTS `users_auth_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `users_auth_view` AS SELECT 
 1 AS `user_id`,
 1 AS `username_csr`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `phone_num`,
 1 AS `active`,
 1 AS `role_id`,
 1 AS `role`,
 1 AS `last_pass_reset`,
 1 AS `hash`,
 1 AS `user_subdivisions`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users_subdivisions`
--

DROP TABLE IF EXISTS `users_subdivisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_subdivisions` (
  `users_user_id` smallint(5) unsigned NOT NULL,
  `subdivisions_subdivision_id` tinyint(4) NOT NULL,
  PRIMARY KEY (`users_user_id`,`subdivisions_subdivision_id`),
  KEY `fk_users_has_subdivisions_subdivisions1_idx` (`subdivisions_subdivision_id`),
  KEY `fk_users_has_subdivisions_users1_idx` (`users_user_id`),
  CONSTRAINT `fk_users_has_subdivisions_subdivisions1` FOREIGN KEY (`subdivisions_subdivision_id`) REFERENCES `subdivisions` (`subdivision_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_subdivisions_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_subdivisions`
--

LOCK TABLES `users_subdivisions` WRITE;
/*!40000 ALTER TABLE `users_subdivisions` DISABLE KEYS */;
INSERT INTO `users_subdivisions` VALUES (3,1),(11,1),(17,1),(20,1),(23,1),(25,1),(33,1),(34,1),(36,1),(40,1),(43,1),(47,1),(48,1),(49,1),(54,1),(65,1),(66,1),(70,1),(80,1),(84,1),(87,1),(94,1),(96,1),(97,1),(106,1),(112,1),(117,1),(118,1),(120,1),(130,1),(132,1),(138,1),(139,1),(179,1),(182,1),(183,1),(6,2),(10,2),(13,2),(18,2),(20,2),(27,2),(29,2),(32,2),(55,2),(56,2),(57,2),(63,2),(64,2),(67,2),(68,2),(79,2),(98,2),(102,2),(109,2),(113,2),(115,2),(116,2),(121,2),(123,2),(127,2),(134,2),(137,2),(179,2),(191,2),(192,2),(194,2),(195,2),(1,3),(4,3),(7,3),(10,3),(14,3),(15,3),(19,3),(20,3),(30,3),(35,3),(37,3),(38,3),(44,3),(45,3),(51,3),(58,3),(61,3),(62,3),(72,3),(74,3),(86,3),(89,3),(92,3),(95,3),(103,3),(108,3),(110,3),(126,3),(179,3),(185,3),(187,3),(189,3),(191,3),(196,3),(2,4),(16,4),(19,4),(22,4),(28,4),(39,4),(46,4),(52,4),(59,4),(66,4),(69,4),(75,4),(78,4),(81,4),(82,4),(83,4),(90,4),(91,4),(101,4),(105,4),(124,4),(125,4),(129,4),(133,4),(135,4),(136,4),(140,4),(180,4),(194,4),(195,4),(200,4),(5,5),(8,5),(9,5),(12,5),(19,5),(21,5),(24,5),(26,5),(31,5),(41,5),(42,5),(50,5),(53,5),(60,5),(71,5),(73,5),(76,5),(77,5),(85,5),(88,5),(93,5),(99,5),(100,5),(104,5),(107,5),(111,5),(114,5),(119,5),(122,5),(128,5),(131,5),(195,7),(184,8);
/*!40000 ALTER TABLE `users_subdivisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `users_view`
--

DROP TABLE IF EXISTS `users_view`;
/*!50001 DROP VIEW IF EXISTS `users_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `users_view` AS SELECT 
 1 AS `user_id`,
 1 AS `username_csr`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `phone_num`,
 1 AS `active`,
 1 AS `role_id`,
 1 AS `role`,
 1 AS `last_pass_reset`,
 1 AS `user_subdivisions`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `users_auth_view`
--

/*!50001 DROP VIEW IF EXISTS `users_auth_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `users_auth_view` AS select `u`.`user_id` AS `user_id`,`u`.`username_csr` AS `username_csr`,`u`.`first_name` AS `first_name`,`u`.`last_name` AS `last_name`,`u`.`phone_num` AS `phone_num`,`u`.`active` AS `active`,`u`.`role_id` AS `role_id`,`r`.`role` AS `role`,`u`.`last_pass_reset` AS `last_pass_reset`,`u`.`hash` AS `hash`,group_concat(`s`.`subdivision_id` separator ', ') AS `user_subdivisions` from (((`users` `u` join `users_subdivisions` `us` on((`us`.`users_user_id` = `u`.`user_id`))) join `subdivisions` `s` on((`s`.`subdivision_id` = `us`.`subdivisions_subdivision_id`))) join `roles` `r` on((`u`.`role_id` = `r`.`role_id`))) group by `u`.`user_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `users_view`
--

/*!50001 DROP VIEW IF EXISTS `users_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `users_view` AS select `u`.`user_id` AS `user_id`,`u`.`username_csr` AS `username_csr`,`u`.`first_name` AS `first_name`,`u`.`last_name` AS `last_name`,`u`.`phone_num` AS `phone_num`,`u`.`active` AS `active`,`u`.`role_id` AS `role_id`,`r`.`role` AS `role`,`u`.`last_pass_reset` AS `last_pass_reset`,group_concat(`s`.`subdivision_id` separator ', ') AS `user_subdivisions` from (((`users` `u` join `users_subdivisions` `us` on((`us`.`users_user_id` = `u`.`user_id`))) join `subdivisions` `s` on((`s`.`subdivision_id` = `us`.`subdivisions_subdivision_id`))) join `roles` `r` on((`u`.`role_id` = `r`.`role_id`))) group by `u`.`user_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-29 20:31:00
