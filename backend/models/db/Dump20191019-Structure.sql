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

-- Dump completed on 2019-10-29 20:30:21
