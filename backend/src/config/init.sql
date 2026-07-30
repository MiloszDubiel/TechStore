-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: my_it_store
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `house_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apartment_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Polska',
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_addresses_user` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,15,'Senatorska 109',NULL,NULL,'35-317','Rzeszów','Polska',0,'2026-07-23 11:22:50'),(2,22,'Senatorska 109',NULL,NULL,'35-317','Rzeszów','Polska',0,'2026-07-24 09:55:54');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `allegro_token`
--

DROP TABLE IF EXISTS `allegro_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allegro_token` (
  `id` int NOT NULL,
  `access_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allegro_token`
--

LOCK TABLES `allegro_token` WRITE;
/*!40000 ALTER TABLE `allegro_token` DISABLE KEYS */;
INSERT INTO `allegro_token` VALUES (1,'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FsbGVncm8ucGwiLCJ1c2VyX25hbWUiOiI0NDkwMTcxMSIsInNjb3BlIjpbImFsbGVncm86YXBpOnNhbGU6b2ZmZXJzOnJlYWQiXSwiYWxsZWdyb19hcGkiOnRydWUsImV4cCI6MTc3Mjg3NDg1NiwiY2xpZW50X2lkIjoiYWMyYmYzMWI0ZmJlNDI2NGI2MTg1MGQ0ZjdmYzA4NjAiLCJqdGkiOiJiNDI2NGZmMi1hMjliLTQ5MDctOWY3My0yN2YxNmM4ZjVjNDUifQ.OlrVFZvVswJMJ97vBBQXMbtdHhvSNTUIPI08pgFIhqO16FXGRRDD1EY9NOZPza4xzM-gx5lTSKdgZ3Ri_gFHlVJ4a_xEYNef_bUuEsRCHGnkSjdmEQ17LA6N3e9qCGVDzS37Lhhs-h4357_HWWqRScV5DHOeNoSAGxAskwzFh4jigpCk1sZwoBpYZJgQAO1Q3yoAi4HbouVnAesIA9FstRO3CC6E4L-HXlbDGW_GczWsD_j7eZJHAFGRa5RNFuUesW_3HUrA6rSlX-JtPh5SjIFOgwDwxvh1yi7CPe2rlPKtRUlUNi903r689FOlr9ukMpFzBIi1hMCfwPeeYJ5Vow','eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FsbGVncm8ucGwiLCJ1c2VyX25hbWUiOiI0NDkwMTcxMSIsInNjb3BlIjpbImFsbGVncm86YXBpOnNhbGU6b2ZmZXJzOnJlYWQiXSwiYXRpIjoiYjQyNjRmZjItYTI5Yi00OTA3LTlmNzMtMjdmMTZjOGY1YzQ1IiwiYWxsZWdyb19hcGkiOnRydWUsImV4cCI6MTc4MDYwNzY1NiwiY2xpZW50X2lkIjoiYWMyYmYzMWI0ZmJlNDI2NGI2MTg1MGQ0ZjdmYzA4NjAiLCJqdGkiOiJiOWFiMjcwOC00ZWFmLTQ1MGYtODgwOS03ZDg2NTY3NmYzMmYifQ.fIi_CaYPo66NuotdBQpgv_yB5cf2BZDCvMf7XVxxsZjm9Q9S54ouSk_jGnpfrGsvH1o0sUMhwHo8VmVE_e_DSd-zZdUUsX1Up3V9mOiu16FAsbGdpd75WzTo_m-uTMZTJw7KhHtNCbUI5hCbO7QVDC8uAKl16YnalE7hJphkeMCsAQrqU605ig249W10JdlFq3SVf0vz1ttD6P-guclWlwoL84oB_1I-a-sqe1ppBTYK0BtK-lNFKmEsGBUEdY-SMyUs6aC8mBUWDum4UAFw3KtzEdTuAhH644ovrs1Rg0px8R_wV9rjZPLtIDefEf1_UWSJa947WCNz9Gj4UjzeIg',1772874853908,'2026-03-02 14:31:21');
/*!40000 ALTER TABLE `allegro_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Komputery','komputery','2026-07-14 16:27:23'),(2,'Laptopy','laptopy','2026-07-14 16:27:23'),(3,'Podzespoły komputerowe','podzespoly-komputerowe','2026-07-14 16:27:23');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`),
  KEY `product_id` (`product_id`),
  KEY `conversations_ibfk_1` (`user_id`),
  CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`),
  CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_favorite_user` (`user_id`),
  KEY `fk_favorite_product` (`product_id`),
  CONSTRAINT `fk_favorite_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`conversation_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,15,'Zmiana statusu zamówienia','Twoja przesyłka została wysłana',1,'2026-07-23 10:32:33','ORDER_STATUS'),(2,15,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-23 19:01:19','ORDER_STATUS'),(3,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 09:59:13','ORDER_STATUS'),(4,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 09:59:18','ORDER_STATUS'),(5,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 09:59:44','ORDER_STATUS'),(6,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:09:45','ORDER_STATUS'),(7,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:17:03','ORDER_STATUS'),(8,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:21:46','ORDER_STATUS'),(9,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:24:31','ORDER_STATUS'),(10,22,'Zmiana statusu zamówienia','Twoja przesyłka została wysłana',1,'2026-07-24 10:27:39','ORDER_STATUS'),(11,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:29:17','ORDER_STATUS'),(12,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:29:52','ORDER_STATUS'),(13,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:29:54','ORDER_STATUS'),(14,22,'Zmiana statusu zamówienia','Twoja przesyłka została wysłana',1,'2026-07-24 10:30:16','ORDER_STATUS'),(15,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:35:01','ORDER_STATUS'),(16,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:51:19','ORDER_STATUS'),(17,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:52:46','ORDER_STATUS'),(18,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:54:26','ORDER_STATUS'),(19,22,'Zmiana statusu zamówienia','Status zamówienia został zmieniony',1,'2026-07-24 10:55:14','ORDER_STATUS'),(20,22,'Zmiana statusu zamówienia','Twoja przesyłka została wysłana',1,'2026-07-24 11:02:10','ORDER_STATUS'),(21,22,'Zmiana statusu zamówienia','Twoje zamówienie zostało dostarczone',1,'2026-07-24 11:02:19','ORDER_STATUS'),(22,22,'Zmiana statusu zamówienia','Twoje zamówienie jest przygotowywane',1,'2026-07-24 11:03:18','ORDER_STATUS'),(23,22,'Zmiana statusu zamówienia','Otrzymaliśmy Twoje zamówienie',1,'2026-07-24 11:05:01','ORDER_STATUS'),(24,22,'Zmiana statusu zamówienia','Twoje zamówienie jest przygotowywane',1,'2026-07-24 11:06:19','ORDER_STATUS'),(25,22,'Zmiana statusu zamówienia','Twoja przesyłka została wysłana',1,'2026-07-24 11:06:41','ORDER_STATUS');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_addresses`
--

DROP TABLE IF EXISTS `order_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `street` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'Polska',
  `phone` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_addresses`
--

LOCK TABLES `order_addresses` WRITE;
/*!40000 ALTER TABLE `order_addresses` DISABLE KEYS */;
INSERT INTO `order_addresses` VALUES (34,'Jan','Kowalski','Piłsudskiego 10','35-001','Rzeszów','Polska','500600700','2026-07-25 18:03:29',NULL,NULL),(35,'Anna','Nowak','Mickiewicza 15','35-002','Rzeszów','Polska','600700800','2026-07-25 18:03:29',NULL,NULL),(36,'Piotr','Wiśniewski','Warszawska 20','00-001','Warszawa','Polska','700800900','2026-07-25 18:03:29',NULL,NULL),(37,'Michał','Zieliński','Długa 5','31-001','Kraków','Polska','800900100','2026-07-25 18:03:29',NULL,NULL),(38,'Jan','Kowalski','Piłsudskiego 10','35-001','Rzeszów','Polska','500600700','2026-07-25 18:03:29',NULL,NULL),(39,'Anna','Nowak','Mickiewicza 15','35-002','Rzeszów','Polska','600700800','2026-07-25 18:03:29',NULL,NULL),(40,'Piotr','Wiśniewski','Warszawska 20','00-001','Warszawa','Polska','700800900','2026-07-25 18:03:29',NULL,NULL),(41,'Michał','Zieliński','Długa 5','31-001','Kraków','Polska','800900100','2026-07-25 18:03:29',NULL,NULL),(42,'Jan','Kowalski','Piłsudskiego 10','35-001','Rzeszów','Polska','500600700','2026-07-25 18:03:29',NULL,NULL),(43,'Anna','Nowak','Mickiewicza 15','35-002','Rzeszów','Polska','600700800','2026-07-25 18:03:29',NULL,NULL),(44,'Piotr','Wiśniewski','Warszawska 20','00-001','Warszawa','Polska','700800900','2026-07-25 18:03:29',NULL,NULL),(45,'Michał','Zieliński','Długa 5','31-001','Kraków','Polska','800900100','2026-07-25 18:03:29',NULL,NULL),(46,'Jan','Kowalski','Piłsudskiego 10','35-001','Rzeszów','Polska','500600700','2026-07-25 18:03:29',NULL,NULL),(47,'Anna','Nowak','Mickiewicza 15','35-002','Rzeszów','Polska','600700800','2026-07-25 18:03:29',NULL,NULL),(48,'Piotr','Wiśniewski','Warszawska 20','00-001','Warszawa','Polska','700800900','2026-07-25 18:03:29',NULL,NULL),(49,'Michał','Zieliński','Długa 5','31-001','Kraków','Polska','800900100','2026-07-25 18:03:29',NULL,NULL),(50,'Jan','Kowalski','Piłsudskiego 10','35-001','Rzeszów','Polska','500600700','2026-07-25 18:03:29',NULL,NULL),(51,'Anna','Nowak','Mickiewicza 15','35-002','Rzeszów','Polska','600700800','2026-07-25 18:03:29',NULL,NULL),(52,'Piotr','Wiśniewski','Warszawska 20','00-001','Warszawa','Polska','700800900','2026-07-25 18:03:29',NULL,NULL),(53,'Michał','Zieliński','Długa 5','31-001','Kraków','Polska','800900100','2026-07-25 18:03:29',NULL,NULL);
/*!40000 ALTER TABLE `order_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` text,
  PRIMARY KEY (`id`),
  KEY `fk_order_items_orders` (`order_id`),
  CONSTRAINT `fk_order_items_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (3,40,2070,'Lenovo ThinkPad T14 Gen 4',1,3499.00,NULL),(4,41,2070,'Lenovo ThinkPad T14 Gen 4',1,3499.00,NULL),(5,42,2070,'Lenovo ThinkPad T14 Gen 4',1,3499.00,NULL),(6,104,2109,'Lenovo IdeaPad',1,550.00,NULL),(7,105,2109,'Lenovo IdeaPad',1,550.00,NULL),(8,106,2109,'Lenovo IdeaPad',1,550.00,NULL);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  `delivery_method` varchar(50) NOT NULL,
  `delivery_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `locker_id` varchar(50) DEFAULT NULL,
  `locker_name` varchar(100) DEFAULT NULL,
  `locker_address` varchar(255) DEFAULT NULL,
  `payment_method` enum('BLIK','CARD','TRANSFER','CASH_ON_DELIVERY') NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('NEW','PROCESSING','SHIPPED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'NEW',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order_number` varchar(30) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_last_name` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(50) DEFAULT NULL,
  `customer_street` varchar(255) DEFAULT NULL,
  `customer_postal_code` varchar(20) DEFAULT NULL,
  `customer_city` varchar(100) DEFAULT NULL,
  `customer_country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `fk_orders_users` (`user_id`),
  KEY `fk_orders_addresses` (`address_id`),
  CONSTRAINT `fk_orders_addresses` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_orders_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (40,NULL,1,'COURIER',15.00,NULL,NULL,NULL,'BLIK',3514.00,'NEW','2026-07-23 11:42:18','MITS-20260723-00001','admin@example.com','Miłosz','Kowalski','123456789',NULL,NULL,NULL,NULL),(41,15,1,'COURIER',15.00,NULL,NULL,NULL,'BLIK',3514.00,'PROCESSING','2026-07-23 11:55:12','MITS-20260723-00002','admin@example.com','Miłosz','Kowalski','123456789',NULL,NULL,NULL,NULL),(42,22,2,'COURIER',15.00,NULL,NULL,NULL,'BLIK',3514.00,'PROCESSING','2026-07-24 09:55:57','MITS-20260724-00001','anna@example.com','Anna','Nowak','123467787',NULL,NULL,NULL,NULL),(63,15,NULL,'courier',15.00,NULL,NULL,NULL,'CARD',5014.99,'NEW','2026-07-25 18:09:40','ORD-2026-0001',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(64,15,NULL,'locker',12.00,NULL,NULL,NULL,'CARD',1299.99,'PROCESSING','2026-07-25 18:09:40','ORD-2026-0002',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(65,15,NULL,'courier',15.00,NULL,NULL,NULL,'CARD',2699.99,'SHIPPED','2026-07-25 18:09:40','ORD-2026-0003',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,15,NULL,'courier',15.00,NULL,NULL,NULL,'CARD',599.99,'NEW','2026-07-25 18:09:40','ORD-2026-0004',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(67,15,NULL,'locker',12.00,NULL,NULL,NULL,'CARD',349.99,'COMPLETED','2026-07-25 18:09:40','ORD-2026-0005',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(68,15,NULL,'courier',15.00,NULL,NULL,NULL,'CARD',6999.99,'PROCESSING','2026-07-25 18:09:40','ORD-2026-0006',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,15,NULL,'locker',12.00,NULL,NULL,NULL,'CARD',2199.99,'CANCELLED','2026-07-25 18:09:40','ORD-2026-0007',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,15,NULL,'courier',15.00,NULL,NULL,NULL,'CARD',4999.99,'PROCESSING','2026-07-25 18:09:40','ORD-2026-0008',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,15,NULL,'locker',12.00,NULL,NULL,NULL,'CARD',899.99,'SHIPPED','2026-07-25 18:09:40','ORD-2026-0009',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(72,15,NULL,'courier',15.00,NULL,NULL,NULL,'CARD',399.99,'COMPLETED','2026-07-25 18:09:40','ORD-2026-0010',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(104,22,2,'COURIER',15.00,NULL,NULL,NULL,'CARD',565.00,'NEW','2026-07-28 10:14:09','MITS-20260728-00001','anna@example.com','Anna','Nowak','123467787',NULL,NULL,NULL,NULL),(105,NULL,NULL,'LOCKER',12.00,'RZE02B','Paczkomat RZE02B','Rzeszów, ul. Lisa-Kuli 5','BLIK',562.00,'NEW','2026-07-28 10:14:53','MITS-20260728-00002','miloszdubiel02@wp.pl','Miłosz','Dubiel','791417050',NULL,NULL,NULL,NULL),(106,22,2,'COURIER',15.00,NULL,NULL,NULL,'BLIK',565.00,'PROCESSING','2026-07-28 10:20:48','MITS-20260728-00003','anna@example.com','Anna','Nowak','111111111',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter_options`
--

DROP TABLE IF EXISTS `parameter_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parameter_options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parameter_id` int NOT NULL,
  `value` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parameter_id` (`parameter_id`),
  CONSTRAINT `parameter_options_ibfk_1` FOREIGN KEY (`parameter_id`) REFERENCES `subcategory_parameters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=908 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parameter_options`
--

LOCK TABLES `parameter_options` WRITE;
/*!40000 ALTER TABLE `parameter_options` DISABLE KEYS */;
INSERT INTO `parameter_options` VALUES (397,8,'Windows 11 Home'),(398,8,'Windows 11 Pro'),(399,8,'Windows 10'),(400,8,'Linux'),(401,8,'Brak systemu'),(402,21,'Windows 11 Home'),(403,21,'Windows 11 Pro'),(404,21,'Windows 10'),(405,21,'Linux'),(406,21,'Brak systemu'),(407,26,'Windows 11 Home'),(408,26,'Windows 11 Pro'),(409,26,'Windows 10'),(410,26,'Linux'),(411,26,'Brak systemu'),(412,37,'1920x1080 Full HD'),(413,37,'2560x1440 QHD'),(414,37,'3840x2160 4K'),(415,38,'Windows 11 Home'),(416,38,'Windows 11 Pro'),(417,38,'Windows 10'),(418,38,'Linux'),(419,38,'Brak systemu'),(420,39,'AMD'),(421,39,'Intel'),(422,39,'NVIDIA'),(423,39,'ASUS'),(424,39,'MSI'),(425,39,'Gigabyte'),(426,39,'Lenovo'),(427,39,'HP'),(428,39,'Dell'),(429,39,'Apple'),(430,46,'1920x1080 Full HD'),(431,46,'2560x1440 QHD'),(432,46,'3840x2160 4K'),(433,48,'Windows 11 Home'),(434,48,'Windows 11 Pro'),(435,48,'Windows 10'),(436,48,'Linux'),(437,48,'Brak systemu'),(438,49,'AMD'),(439,49,'Intel'),(440,49,'NVIDIA'),(441,49,'ASUS'),(442,49,'MSI'),(443,49,'Gigabyte'),(444,49,'Lenovo'),(445,49,'HP'),(446,49,'Dell'),(447,49,'Apple'),(448,56,'Windows 11 Home'),(449,56,'Windows 11 Pro'),(450,56,'Windows 10'),(451,56,'Linux'),(452,56,'Brak systemu'),(453,57,'AMD'),(454,57,'Intel'),(455,57,'NVIDIA'),(456,57,'ASUS'),(457,57,'MSI'),(458,57,'Gigabyte'),(459,57,'Lenovo'),(460,57,'HP'),(461,57,'Dell'),(462,57,'Apple'),(463,64,'AMD'),(464,64,'Intel'),(465,64,'NVIDIA'),(466,64,'ASUS'),(467,64,'MSI'),(468,64,'Gigabyte'),(469,64,'Lenovo'),(470,64,'HP'),(471,64,'Dell'),(472,64,'Apple'),(473,70,'Windows 11 Home'),(474,70,'Windows 11 Pro'),(475,70,'Windows 10'),(476,70,'Linux'),(477,70,'Brak systemu'),(478,77,'AMD'),(479,77,'Intel'),(480,77,'NVIDIA'),(481,77,'ASUS'),(482,77,'MSI'),(483,77,'Gigabyte'),(484,77,'Lenovo'),(485,77,'HP'),(486,77,'Dell'),(487,77,'Apple'),(488,79,'AM4'),(489,79,'AM5'),(490,79,'LGA1200'),(491,79,'LGA1700'),(492,79,'LGA1851'),(493,84,'AMD'),(494,84,'Intel'),(495,84,'NVIDIA'),(496,84,'ASUS'),(497,84,'MSI'),(498,84,'Gigabyte'),(499,84,'Lenovo'),(500,84,'HP'),(501,84,'Dell'),(502,84,'Apple'),(503,87,'GDDR5'),(504,87,'GDDR6'),(505,87,'GDDR6X'),(506,87,'HBM2'),(507,87,'HBM3'),(508,88,'NVMe PCIe 3.0'),(509,88,'NVMe PCIe 4.0'),(510,88,'NVMe PCIe 5.0'),(511,88,'SATA III'),(512,89,'AMD'),(513,89,'Intel'),(514,89,'NVIDIA'),(515,89,'ASUS'),(516,89,'MSI'),(517,89,'Gigabyte'),(518,89,'Lenovo'),(519,89,'HP'),(520,89,'Dell'),(521,89,'Apple'),(522,91,'AM4'),(523,91,'AM5'),(524,91,'LGA1200'),(525,91,'LGA1700'),(526,91,'LGA1851'),(527,92,'AMD B450'),(528,92,'AMD B550'),(529,92,'AMD B650'),(530,92,'AMD X570'),(531,92,'AMD X670'),(532,92,'Intel B660'),(533,92,'Intel B760'),(534,92,'Intel Z690'),(535,92,'Intel Z790'),(536,93,'ATX'),(537,93,'Micro ATX'),(538,93,'Mini ITX'),(539,93,'M.2 2280'),(540,93,'2.5 cala'),(541,93,'3.5 cala'),(542,94,'AMD'),(543,94,'Intel'),(544,94,'NVIDIA'),(545,94,'ASUS'),(546,94,'MSI'),(547,94,'Gigabyte'),(548,94,'Lenovo'),(549,94,'HP'),(550,94,'Dell'),(551,94,'Apple'),(552,96,'DDR3'),(553,96,'DDR4'),(554,96,'DDR5'),(555,98,'AMD'),(556,98,'Intel'),(557,98,'NVIDIA'),(558,98,'ASUS'),(559,98,'MSI'),(560,98,'Gigabyte'),(561,98,'Lenovo'),(562,98,'HP'),(563,98,'Dell'),(564,98,'Apple'),(565,101,'NVMe PCIe 3.0'),(566,101,'NVMe PCIe 4.0'),(567,101,'NVMe PCIe 5.0'),(568,101,'SATA III'),(569,102,'AMD'),(570,102,'Intel'),(571,102,'NVIDIA'),(572,102,'ASUS'),(573,102,'MSI'),(574,102,'Gigabyte'),(575,102,'Lenovo'),(576,102,'HP'),(577,102,'Dell'),(578,102,'Apple'),(579,105,'NVMe PCIe 3.0'),(580,105,'NVMe PCIe 4.0'),(581,105,'NVMe PCIe 5.0'),(582,105,'SATA III'),(583,106,'AMD'),(584,106,'Intel'),(585,106,'NVIDIA'),(586,106,'ASUS'),(587,106,'MSI'),(588,106,'Gigabyte'),(589,106,'Lenovo'),(590,106,'HP'),(591,106,'Dell'),(592,106,'Apple'),(593,109,'80 Plus Standard'),(594,109,'80 Plus Bronze'),(595,109,'80 Plus Silver'),(596,109,'80 Plus Gold'),(597,109,'80 Plus Platinum'),(598,109,'80 Plus Titanium'),(599,110,'AMD'),(600,110,'Intel'),(601,110,'NVIDIA'),(602,110,'ASUS'),(603,110,'MSI'),(604,110,'Gigabyte'),(605,110,'Lenovo'),(606,110,'HP'),(607,110,'Dell'),(608,110,'Apple'),(609,112,'ATX'),(610,112,'Micro ATX'),(611,112,'Mini ITX'),(612,112,'M.2 2280'),(613,112,'2.5 cala'),(614,112,'3.5 cala'),(615,113,'Tak'),(616,113,'Nie'),(617,114,'AMD'),(618,114,'Intel'),(619,114,'NVIDIA'),(620,114,'ASUS'),(621,114,'MSI'),(622,114,'Gigabyte'),(623,114,'Lenovo'),(624,114,'HP'),(625,114,'Dell'),(626,114,'Apple'),(627,116,'DDR3'),(628,116,'DDR4'),(629,116,'DDR5'),(630,117,'AM4'),(631,117,'AM5'),(632,117,'LGA1200'),(633,117,'LGA1700'),(634,117,'LGA1851'),(635,118,'AMD'),(636,118,'Intel'),(637,118,'NVIDIA'),(638,118,'ASUS'),(639,118,'MSI'),(640,118,'Gigabyte'),(641,118,'Lenovo'),(642,118,'HP'),(643,118,'Dell'),(644,118,'Apple'),(645,121,'Tak'),(646,121,'Nie'),(647,122,'AMD'),(648,122,'Intel'),(649,122,'NVIDIA'),(650,122,'ASUS'),(651,122,'MSI'),(652,122,'Gigabyte'),(653,122,'Lenovo'),(654,122,'HP'),(655,122,'Dell'),(656,122,'Apple'),(657,124,'NVMe PCIe 3.0'),(658,124,'NVMe PCIe 4.0'),(659,124,'NVMe PCIe 5.0'),(660,124,'SATA III');
/*!40000 ALTER TABLE `parameter_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `is_main` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_product_images_product` (`product_id`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reports`
--

DROP TABLE IF EXISTS `product_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `reporter_id` int NOT NULL,
  `reason` enum('SCAM','FAKE','COPYRIGHT','WRONG_CATEGORY','OFFENSIVE','OTHER') NOT NULL,
  `description` text,
  `status` enum('PENDING','IN_REVIEW','RESOLVED','REJECTED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `reporter_id` (`reporter_id`),
  CONSTRAINT `product_reports_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reports_ibfk_2` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reports`
--

LOCK TABLES `product_reports` WRITE;
/*!40000 ALTER TABLE `product_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `seller_reply` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`,`user_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_reviews_product` (`product_id`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `external_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `product_data` json DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `seller_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `subcategory_id` int DEFAULT NULL,
  `slug` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `external_id` (`external_id`),
  KEY `idx_price` (`price`),
  KEY `idx_stock` (`stock`),
  KEY `idx_createdAt` (`created_at`),
  KEY `fk_products_category` (`category_id`),
  KEY `fk_products_subcategory` (`subcategory_id`),
  KEY `fk_products_seller` (`seller_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_products_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_products_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_product_visibility` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN

    IF NEW.stock > 0 THEN
        SET NEW.is_visible = 1;
    ELSE
        SET NEW.is_visible = 0;
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_revoked` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_refresh_user` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (26,12,'409f950e-c486-4d0a-acd4-ba97b4d6e8e2','2026-07-21 12:59:32',1,'2026-07-14 10:59:32'),(30,12,'56294c60-9b4f-444b-bf75-1b9952abc439','2026-07-21 13:22:57',0,'2026-07-14 11:22:57'),(49,15,'8b8bd0fa-0e19-405e-993b-c768d0af0494','2026-07-24 14:01:23',1,'2026-07-17 12:01:23'),(50,15,'955385b6-d95c-4b01-baa4-4c7db64d857b','2026-07-24 14:03:17',1,'2026-07-17 12:03:17'),(68,15,'c4aa1c54-a322-4dc7-9219-5d744a5cc8d8','2026-07-24 15:51:31',1,'2026-07-17 13:51:31'),(70,15,'1338b516-ee2a-4419-9f3a-b745f37c2872','2026-07-24 15:53:18',0,'2026-07-17 13:53:18'),(71,15,'2b7514d8-b70a-4d74-b567-e70a1ece7eb4','2026-07-24 18:27:49',0,'2026-07-17 16:27:49'),(72,15,'4fc65f19-7c75-4555-85ec-4bc86052474b','2026-07-25 10:27:40',1,'2026-07-18 08:27:40'),(75,15,'d1a0af88-461f-44d2-bc30-2e6e662a492f','2026-07-25 15:27:46',1,'2026-07-18 13:27:46'),(76,15,'1a7f5408-6dfe-44ec-b69c-5e9de9dac406','2026-07-25 15:30:21',1,'2026-07-18 13:30:21'),(78,15,'b9e9cab8-7794-4bcb-a300-e187c362b71f','2026-07-25 17:12:06',1,'2026-07-18 15:12:06'),(79,15,'b885a4ef-73cb-47e4-9f4c-e9e8ac97534a','2026-07-25 17:12:18',1,'2026-07-18 15:12:18'),(81,15,'101a2774-2d76-44b6-af79-59749f25d044','2026-07-25 17:15:29',1,'2026-07-18 15:15:29'),(83,15,'0e59c92c-e6b1-4a44-9788-8122cc95332e','2026-07-25 17:27:46',0,'2026-07-18 15:27:46'),(84,15,'3e122fb7-5cf8-464a-afab-c1b389ec4bd3','2026-07-26 12:45:33',0,'2026-07-19 10:45:33'),(85,15,'f031bc1c-811b-40e7-bea5-c60ecd4937d6','2026-07-26 15:26:57',0,'2026-07-19 13:26:57'),(86,15,'42d2f6e3-4cbb-4db2-9dda-2a8041254f08','2026-07-26 19:55:34',0,'2026-07-19 17:55:34'),(87,15,'7409daf2-f919-4105-932e-cedf9ccb0773','2026-07-27 14:08:49',0,'2026-07-20 12:08:49'),(89,15,'859ec557-27a2-4de7-8aa8-9874bd476e0c','2026-07-27 16:09:36',1,'2026-07-20 14:09:36'),(95,22,'c0b4891e-c066-4ad0-81c2-739f1d6b2398','2026-07-28 11:48:50',1,'2026-07-21 09:48:50'),(99,25,'55d20bf8-5e55-4cae-9bfe-76695ccb4dab','2026-07-28 12:08:07',0,'2026-07-21 10:08:07'),(100,15,'388d2ccb-1be7-4df8-b349-6a2533ca6e90','2026-07-28 15:51:55',0,'2026-07-21 13:51:55'),(101,22,'22f06144-b0dd-433f-8ad6-5e435f575f2e','2026-07-29 11:51:55',1,'2026-07-22 09:51:55'),(104,22,'463d728f-2fd2-4398-9ec9-373510d102f6','2026-07-29 19:00:49',0,'2026-07-22 17:00:49'),(105,22,'e6ace89d-972b-458b-ad26-b443e9acffb1','2026-07-29 19:58:28',0,'2026-07-22 17:58:28'),(109,22,'082d7965-6b86-45c6-a9f0-c6df26c20b4f','2026-07-30 10:34:55',1,'2026-07-23 08:34:55'),(111,15,'caee4f13-4efe-43bb-a458-0ba6c5e45657','2026-07-30 12:33:35',1,'2026-07-23 10:33:35'),(112,15,'e71a8b38-8c05-4974-bb76-68fe1eefc63d','2026-07-30 12:40:52',1,'2026-07-23 10:40:52'),(114,15,'43bf6b08-0bb0-48be-b143-1fe01dd7b943','2026-07-30 13:20:37',1,'2026-07-23 11:20:37'),(115,15,'ea68e677-1945-43d3-a4dd-3cda053bbe49','2026-07-30 13:35:37',0,'2026-07-23 11:35:37'),(118,22,'5e58ca27-7a8c-4151-b9ef-3b108caa303a','2026-07-31 11:55:34',1,'2026-07-24 09:55:34'),(121,22,'6d6bec18-a0a9-4808-99dd-60873e06d822','2026-07-31 12:07:45',1,'2026-07-24 10:07:45'),(123,22,'5519331e-70c8-488a-a667-8dcdb351d091','2026-07-31 12:09:22',0,'2026-07-24 10:09:22'),(124,22,'718294fe-51f0-43e3-853e-d226bb002075','2026-07-31 13:06:08',0,'2026-07-24 11:06:08'),(126,22,'a4094347-a882-4bfa-a504-3e1e1e61f34e','2026-07-31 17:35:41',0,'2026-07-24 15:35:41'),(127,15,'bc0f0aee-6c0b-477b-8097-41ddc3d3e852','2026-08-01 15:39:30',0,'2026-07-25 13:39:30'),(128,15,'85bd677e-7c3d-4bb7-b750-f586f941bd5c','2026-08-01 19:08:46',1,'2026-07-25 17:08:46'),(131,22,'3d8f632a-00a7-4672-a93f-8b43488d49b1','2026-08-04 12:13:57',1,'2026-07-28 10:13:57'),(133,22,'19f82933-d90e-4bdd-b09c-cdb5c5355db9','2026-08-04 12:20:25',1,'2026-07-28 10:20:25'),(135,22,'7d6f1025-7a3a-4dc2-831f-71d23a63f03b','2026-08-04 12:23:27',1,'2026-07-28 10:23:27'),(137,22,'3f33a181-33e1-4edb-85ed-2d7791f9ca6f','2026-08-04 12:25:14',1,'2026-07-28 10:25:14'),(140,22,'2e825298-c9b2-4228-bffd-d98b1481fa4e','2026-08-06 13:39:51',1,'2026-07-30 11:39:51'),(141,12,'5c6a82ae-8b3b-4e74-b7f0-286ec2468119','2026-08-06 13:41:13',1,'2026-07-30 11:41:13'),(142,25,'7effd894-a71b-419b-b473-7f205c6ad084','2026-08-06 13:42:07',1,'2026-07-30 11:42:07'),(143,22,'06bc1cd6-d9a2-4973-8ea4-928a358c406e','2026-08-06 13:43:03',1,'2026-07-30 11:43:03'),(144,12,'c4d8d629-fa08-45f0-ae4c-ae5e36e221ca','2026-08-06 13:43:21',0,'2026-07-30 11:43:21');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seller_profiles`
--

DROP TABLE IF EXISTS `seller_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seller_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `shop_name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text,
  `logo` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `nip` varchar(20) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_seller_user` (`user_id`),
  CONSTRAINT `fk_seller_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seller_profiles`
--

LOCK TABLES `seller_profiles` WRITE;
/*!40000 ALTER TABLE `seller_profiles` DISABLE KEYS */;
INSERT INTO `seller_profiles` VALUES (11,22,'TechZone Komputery','techzone-komputery-techzone-sp-z-oo-22','Sklep komputerowy oferujący sprzedaż laptopów, komputerów stacjonarnych, podzespołów oraz akcesoriów komputerowych. Zapewniamy fachowe doradztwo, atrakcyjne ceny i szybką realizację zamówień.','logo-1785411658428.jpg',NULL,NULL,NULL,'8134567890','TechZone Sp. z o.o.',0,1,'2026-07-30 11:40:58','2026-07-30 11:40:58','ul. Informatyczna 15','Rzeszów','35-001'),(12,12,'PC Master','pc-master-pc-master-solutions-sp-z-oo-12','PC Master to sklep komputerowy specjalizujący się w sprzedaży komputerów gamingowych, laptopów, podzespołów oraz akcesoriów komputerowych. Pomagamy dobrać sprzęt dopasowany do potrzeb klientów — od pracy biurowej po profesjonalne zastosowania i gry.\r\n','logo-1785411716366.jpg',NULL,NULL,NULL,'6842739516','PC Master Solutions Sp. z o.o.',0,1,'2026-07-30 11:41:56','2026-07-30 11:41:56','ul. Elektronowa 12','Kraków','30-701'),(13,25,'CyberTech Store','cybertech-store-cybertech-solutions-michal-nowak-25','CyberTech Store oferuje nowoczesny sprzęt komputerowy, podzespoły PC, urządzenia gamingowe oraz akcesoria dla profesjonalistów i entuzjastów technologii. Stawiamy na wysoką jakość produktów, szybką wysyłkę i kompleksową obsługę klienta.\r\n',NULL,NULL,NULL,NULL,'7392846510','CyberTech Solutions Michał Nowak',0,1,'2026-07-30 11:42:43','2026-07-30 11:42:43','ul. Nowoczesna 24','Wrocław','50-120');
/*!40000 ALTER TABLE `seller_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specifications`
--

DROP TABLE IF EXISTS `specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specifications`
--

LOCK TABLES `specifications` WRITE;
/*!40000 ALTER TABLE `specifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_subcategories_category` (`category_id`),
  CONSTRAINT `fk_subcategories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (1,1,'Komputery stacjonarne','komputery-stacjonarne','2026-07-14 16:27:27'),(2,1,'Komputery gamingowe','komputery-gamingowe','2026-07-14 16:27:27'),(3,1,'Komputery biurowe','komputery-biurowe','2026-07-14 16:27:27'),(4,1,'Mini PC','mini-pc','2026-07-14 16:27:27'),(5,1,'Workstation','workstation','2026-07-14 16:27:27'),(6,1,'All-in-One','all-in-one','2026-07-14 16:27:27'),(7,2,'Laptopy gamingowe','laptopy-gamingowe','2026-07-14 16:27:40'),(8,2,'Laptopy biznesowe','laptopy-biznesowe','2026-07-14 16:27:40'),(9,2,'Ultrabooki','ultrabooki','2026-07-14 16:27:40'),(10,2,'Laptopy dla studentów','laptopy-dla-studentow','2026-07-14 16:27:40'),(11,2,'MacBooki','macbooki','2026-07-14 16:27:40'),(12,3,'Procesory (CPU)','procesory-cpu','2026-07-14 16:27:45'),(13,3,'Karty graficzne (GPU)','karty-graficzne-gpu','2026-07-14 16:27:45'),(14,3,'Płyty główne','plyty-glowne','2026-07-14 16:27:45'),(15,3,'Pamięć RAM','pamiec-ram','2026-07-14 16:27:45'),(16,3,'Dyski SSD','dyski-ssd','2026-07-14 16:27:45'),(17,3,'Dyski HDD','dyski-hdd','2026-07-14 16:27:45'),(18,3,'Zasilacze','zasilacze','2026-07-14 16:27:45'),(19,3,'Obudowy komputerowe','obudowy-komputerowe','2026-07-14 16:27:45'),(20,3,'Chłodzenie CPU','chlodzenie-cpu','2026-07-14 16:27:45'),(21,3,'Wentylatory','wentylatory','2026-07-14 16:27:45'),(22,3,'Karty rozszerzeń','karty-rozszerzen','2026-07-14 16:27:45');
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategory_parameters`
--

DROP TABLE IF EXISTS `subcategory_parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategory_parameters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subcategory_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `label` varchar(100) NOT NULL,
  `type` enum('text','number','select') DEFAULT 'text',
  `required` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `subcategory_id` (`subcategory_id`),
  CONSTRAINT `subcategory_parameters_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategory_parameters`
--

LOCK TABLES `subcategory_parameters` WRITE;
/*!40000 ALTER TABLE `subcategory_parameters` DISABLE KEYS */;
INSERT INTO `subcategory_parameters` VALUES (1,1,'processor','Procesor','text',1,1),(2,1,'graphics_card','Karta graficzna','text',1,2),(3,1,'ram','Pamięć RAM GB','number',1,3),(4,1,'storage','Dysk','text',1,4),(5,1,'motherboard','Płyta główna','text',0,5),(6,1,'power_supply','Zasilacz','text',0,6),(7,1,'case','Obudowa','text',0,7),(8,1,'system','System operacyjny','select',0,8),(9,2,'processor','Procesor','text',1,1),(10,2,'graphics_card','Karta graficzna','text',1,2),(11,2,'ram','Pamięć RAM GB','number',1,3),(12,2,'storage','Dysk','text',1,4),(13,2,'motherboard','Płyta główna','text',1,5),(14,2,'power_supply','Zasilacz','text',1,6),(15,2,'case','Obudowa RGB','text',0,7),(16,2,'cooling','Chłodzenie CPU','text',0,8),(17,3,'processor','Procesor','text',1,1),(18,3,'ram','Pamięć RAM GB','number',1,2),(19,3,'storage','Dysk','text',1,3),(20,3,'graphics_card','Karta graficzna','text',0,4),(21,3,'system','System operacyjny','select',0,5),(22,4,'processor','Procesor','text',1,1),(23,4,'ram','Pamięć RAM GB','number',1,2),(24,4,'storage','Dysk','text',1,3),(25,4,'graphics','Grafika zintegrowana','text',0,4),(26,4,'system','System operacyjny','select',0,5),(27,5,'processor','Procesor','text',1,1),(28,5,'graphics_card','Karta graficzna','text',1,2),(29,5,'ram','Pamięć RAM GB','number',1,3),(30,5,'storage','Dysk','text',1,4),(31,5,'motherboard','Płyta główna','text',1,5),(32,5,'power_supply','Zasilacz','text',1,6),(33,6,'processor','Procesor','text',1,1),(34,6,'ram','Pamięć RAM GB','number',1,2),(35,6,'storage','Dysk','text',1,3),(36,6,'screen_size','Przekątna ekranu','number',1,4),(37,6,'resolution','Rozdzielczość','select',1,5),(38,6,'system','System operacyjny','select',0,6),(39,7,'manufacturer','Producent','select',1,1),(40,7,'model','Model','text',1,2),(41,7,'processor','Procesor','text',1,3),(42,7,'graphics_card','Karta graficzna','text',1,4),(43,7,'ram','Pamięć RAM GB','number',1,5),(44,7,'storage','Dysk SSD GB','number',1,6),(45,7,'screen','Ekran cale','number',1,7),(46,7,'resolution','Rozdzielczość','select',1,8),(47,7,'refresh_rate','Odświeżanie Hz','number',0,9),(48,7,'system','System','select',0,10),(49,8,'manufacturer','Producent','select',1,1),(50,8,'model','Model','text',1,2),(51,8,'processor','Procesor','text',1,3),(52,8,'ram','Pamięć RAM GB','number',1,4),(53,8,'storage','Dysk SSD GB','number',1,5),(54,8,'screen','Ekran cale','number',1,6),(55,8,'battery','Bateria Wh','number',0,7),(56,8,'system','System','select',0,8),(57,9,'manufacturer','Producent','select',1,1),(58,9,'model','Model','text',1,2),(59,9,'processor','Procesor','text',1,3),(60,9,'ram','RAM GB','number',1,4),(61,9,'storage','Dysk SSD GB','number',1,5),(62,9,'weight','Waga kg','number',0,6),(63,9,'screen','Ekran cale','number',1,7),(64,10,'manufacturer','Producent','select',1,1),(65,10,'model','Model','text',1,2),(66,10,'processor','Procesor','text',1,3),(67,10,'ram','RAM GB','number',1,4),(68,10,'storage','Dysk SSD GB','number',1,5),(69,10,'battery','Bateria','number',0,6),(70,10,'system','System','select',0,7),(71,11,'model','Model MacBook','text',1,1),(72,11,'processor','Procesor Apple','text',1,2),(73,11,'ram','RAM GB','number',1,3),(74,11,'storage','Dysk SSD GB','number',1,4),(75,11,'screen','Ekran','number',1,5),(76,11,'chip','Układ Apple Silicon','select',1,6),(77,12,'manufacturer','Producent','select',1,1),(78,12,'model','Model procesora','text',1,2),(79,12,'socket','Socket','select',1,3),(80,12,'cores','Rdzenie','number',1,4),(81,12,'threads','Wątki','number',1,5),(82,12,'frequency','Taktowanie GHz','number',1,6),(83,12,'tdp','TDP W','number',0,7),(84,13,'manufacturer','Producent','select',1,1),(85,13,'model','Model GPU','text',1,2),(86,13,'vram','VRAM GB','number',1,3),(87,13,'memory_type','Typ pamięci','select',1,4),(88,13,'interface','Interfejs','select',1,5),(89,14,'manufacturer','Producent','select',1,1),(90,14,'model','Model','text',1,2),(91,14,'socket','Socket CPU','select',1,3),(92,14,'chipset','Chipset','select',1,4),(93,14,'format','Format','select',1,5),(94,15,'manufacturer','Producent','select',1,1),(95,15,'capacity','Pojemność GB','number',1,2),(96,15,'type','Typ RAM','select',1,3),(97,15,'frequency','Taktowanie MHz','number',1,4),(98,16,'manufacturer','Producent','select',1,1),(99,16,'model','Model','text',1,2),(100,16,'capacity','Pojemność GB','number',1,3),(101,16,'interface','Interfejs','select',1,4),(102,17,'manufacturer','Producent','select',1,1),(103,17,'capacity','Pojemność TB','number',1,2),(104,17,'rpm','RPM','number',1,3),(105,17,'interface','Interfejs','select',1,4),(106,18,'manufacturer','Producent','select',1,1),(107,18,'model','Model','text',1,2),(108,18,'power','Moc W','number',1,3),(109,18,'certification','80 Plus','select',0,4),(110,19,'manufacturer','Producent','select',1,1),(111,19,'model','Model','text',1,2),(112,19,'format','Format','select',1,3),(113,19,'rgb','RGB','select',0,4),(114,20,'manufacturer','Producent','select',1,1),(115,20,'model','Model','text',1,2),(116,20,'type','Typ chłodzenia','select',1,3),(117,20,'socket','Socket','select',1,4),(118,21,'manufacturer','Producent','select',1,1),(119,21,'size','Rozmiar mm','number',1,2),(120,21,'rpm','RPM','number',1,3),(121,21,'rgb','RGB','select',0,4),(122,22,'manufacturer','Producent','select',1,1),(123,22,'model','Model','text',1,2),(124,22,'interface','Interfejs','select',1,3);
/*!40000 ALTER TABLE `subcategory_parameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategory_specifications`
--

DROP TABLE IF EXISTS `subcategory_specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategory_specifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subcategory_id` int NOT NULL,
  `specification_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subcategory_id` (`subcategory_id`),
  KEY `specification_id` (`specification_id`),
  CONSTRAINT `subcategory_specifications_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`),
  CONSTRAINT `subcategory_specifications_ibfk_2` FOREIGN KEY (`specification_id`) REFERENCES `specifications` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategory_specifications`
--

LOCK TABLES `subcategory_specifications` WRITE;
/*!40000 ALTER TABLE `subcategory_specifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `subcategory_specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN','SELLER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'USER',
  `is_super_admin` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `phone` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_updated_at` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_seller` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12,'milosz@example.com','$2b$10$i4/CGG1ocaWkKkd3JIEVOObA5pNpR4YG0FizcCMX9yxnHz9RrRGqW','Miłosz','Dubiel','SELLER',0,1,'2026-07-14 10:59:21','531163327',NULL,NULL),(15,'admin@example.com','$2b$10$gEblIL8uejvniTKujA1Qo.MX3tr4Ht3CmJWF63T8JkzRkPRgHDPU6','Miłosz','Kowalski','ADMIN',1,1,'2026-07-14 11:11:16','123456789',NULL,NULL),(22,'anna@example.com','$2b$10$FM7PjWFcSvAl5yaw1E1l0el7kwvKggXsXFP7FxeNZp45Ut0r0SHwq','Anna','Nowak','SELLER',0,1,'2026-07-21 09:48:43','111111111',NULL,NULL),(25,'andrzej@example.com','$2b$10$0toGRGIROQgCnD.7UAlNIO8y4NqUtGIStu5In9qzmB0Cs74ogmRo6','Andrzej','Nowak','SELLER',0,1,'2026-07-21 10:07:55','123456789',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'my_it_store'
--

--
-- Dumping routines for database 'my_it_store'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-30 13:44:21
