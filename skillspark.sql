-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: skillspark
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `test_limit` int DEFAULT NULL,
  `analytics_access` tinyint(1) DEFAULT NULL,
  `certificate_access` tinyint(1) DEFAULT NULL,
  `ai_insights` tinyint(1) DEFAULT NULL,
  `support_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (1,'Free',0,2,0,1,0,'Basic'),(2,'Standard',199,999,1,1,0,'Email'),(3,'Pro',499,9999,1,1,1,'Priority'),(4,'Free',0,2,0,1,0,'Basic'),(5,'Standard',199,999,1,1,0,'Email'),(6,'Pro',499,9999,1,1,1,'Priority'),(7,'Free',0,2,0,1,0,'Basic'),(8,'Standard',199,999,1,1,0,'Email'),(9,'Pro',499,9999,1,1,1,'Priority');
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `technologies`
--

DROP TABLE IF EXISTS `technologies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `technologies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `technologies`
--

LOCK TABLES `technologies` WRITE;
/*!40000 ALTER TABLE `technologies` DISABLE KEYS */;
INSERT INTO `technologies` VALUES (1,'Java',NULL),(2,'React','⚛️'),(3,'SQL','?️'),(4,'Spring Boot',NULL),(5,'DSA',NULL),(11,'Core Java','☕'),(16,'Python','?'),(17,'JavaScript','⚡'),(18,'Manual Testing','?'),(19,'Automation Testing','?'),(20,'Selenium','?'),(21,'HTML','?'),(22,'CSS','?'),(23,'Aptitude','?'),(24,'Reasoning','?');
/*!40000 ALTER TABLE `technologies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_results`
--

DROP TABLE IF EXISTS `test_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `technology_id` int NOT NULL,
  `score` int NOT NULL,
  `total_questions` int NOT NULL,
  `correct_answers` int NOT NULL,
  `difficulty` varchar(50) DEFAULT NULL,
  `time_taken` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `technology_id` (`technology_id`),
  CONSTRAINT `test_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `test_results_ibfk_2` FOREIGN KEY (`technology_id`) REFERENCES `technologies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_results`
--

LOCK TABLES `test_results` WRITE;
/*!40000 ALTER TABLE `test_results` DISABLE KEYS */;
INSERT INTO `test_results` VALUES (8,1,11,80,20,16,'Beginner',0,'2026-06-01 04:47:00'),(9,1,16,40,20,8,'Beginner',0,'2026-06-01 06:08:44'),(10,8,18,20,20,4,'Intermediate',0,'2026-06-02 03:13:35'),(11,8,11,40,20,8,'Intermediate',0,'2026-06-02 03:26:13'),(12,8,21,50,20,10,'Intermediate',0,'2026-06-02 03:28:57'),(13,10,11,50,20,10,'Beginner',0,'2026-06-03 08:15:57'),(14,1,21,65,20,13,'Beginner',0,'2026-06-05 07:08:20'),(15,1,3,55,20,11,'Beginner',0,'2026-06-05 07:11:12'),(16,11,11,0,20,0,'Beginner',0,'2026-06-05 08:02:26'),(17,11,18,95,20,19,'Beginner',0,'2026-06-05 08:06:25'),(18,1,3,90,20,18,'Beginner',186,'2026-06-13 10:02:36'),(19,1,16,25,20,5,'Advanced',192,'2026-06-13 10:07:04');
/*!40000 ALTER TABLE `test_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `plan` varchar(50) DEFAULT 'free',
  `plan_id` int DEFAULT '1',
  `role` varchar(20) DEFAULT 'student',
  PRIMARY KEY (`id`),
  KEY `fk_plan` (`plan_id`),
  CONSTRAINT `fk_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'harshitha','harshi@gmail.com','1234','pro',1,'student'),(2,'test1','test1@gmail.com','1234','free',1,'student'),(3,'harshi','harshi@test.com','1234','free',1,'student'),(4,'harshithapedhapudi','harshithapedhapudi@gmail.com','12345','free',1,'student'),(5,'demo','demo@gmail.com','1234','free',1,'student'),(6,'freeuser','free@gmail.com','1234','free',1,'student'),(7,'harshu','harsh@test.com','1234','free',1,'student'),(8,'standarduser','standard@gmail.com','1234','standard',1,'student'),(9,'prouser','prouser@gmail.com','1234','pro',1,'student'),(10,'tester','tester@gmail.com','1234','free',1,'student'),(11,'prousers','prousers@gmail.com','12345','pro',1,'student'),(12,'harsh','harsh@gmail.com','12345','pro',1,'student'),(13,'new','newuser@gmail.com','1234','pro',1,'student');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-15 13:06:18
