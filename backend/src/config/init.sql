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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (10,21,'Piastów 7',NULL,NULL,'35-317','Rzeszów','Polska',1,'2026-07-17 09:53:44'),(11,15,'Senatorska 109',NULL,NULL,'35-317','Rzeszów','Polska',1,'2026-07-17 12:12:38');
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
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `chat_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `idx_messages_chat` (`chat_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
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
  `user_id` int DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `street` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'Polska',
  `phone` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_order_addresses_users` (`user_id`),
  CONSTRAINT `fk_order_addresses_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_addresses`
--

LOCK TABLES `order_addresses` WRITE;
/*!40000 ALTER TABLE `order_addresses` DISABLE KEYS */;
INSERT INTO `order_addresses` VALUES (1,NULL,'Miłosz ','Dubiel','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-12 11:07:27'),(2,NULL,'Miłosz ','Dubiel','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-12 11:12:17'),(3,NULL,'Miłosz ','Dubiel','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-12 11:13:20'),(4,NULL,'Miłosz ','Dubiel','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-12 11:15:36'),(5,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 12:11:31'),(6,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 12:11:36'),(7,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 12:19:18'),(8,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 16:54:26'),(9,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:16:42'),(10,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:18:00'),(11,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:23:24'),(12,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:25:38'),(13,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:30:07'),(14,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:30:20'),(15,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:32:16'),(16,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:33:43'),(17,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:41:19'),(18,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:41:50'),(19,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:42:22'),(20,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:44:20'),(21,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:47:19'),(22,NULL,'Miłosz','Nowak','Senatorska 109','35-317','Rzeszów','Polska','791417050','2026-07-13 17:54:25'),(23,21,'Miłosz','Dubiel','Piastów 7','35-317','Rzeszów','Polska','791417050','2026-07-17 09:53:50'),(24,21,'Miłosz','Dubiel','Piastów 7','35-317','Rzeszów','Polska','791417050','2026-07-17 09:55:48'),(25,21,'Miłosz','Dubiel','Piastów 7','35-317','Rzeszów','Polska','791417050','2026-07-17 09:56:57'),(26,15,'Miłosz','Kowalski','Senatorska 109','35-317','Rzeszów','Polska','123456789','2026-07-19 18:01:18'),(27,15,'Miłosz','Kowalski','Senatorska 109','35-317','Rzeszów','Polska','123456789','2026-07-19 18:37:34'),(28,15,'Miłosz','Kowalski','Senatorska 109','35-317','Rzeszów','Polska','123456789','2026-07-19 18:41:14'),(29,15,'Miłosz','Kowalski','Senatorska 109','35-317','Rzeszów','Polska','123456789','2026-07-19 18:42:13'),(30,15,'Miłosz','Kowalski','Senatorska 109','35-317','Rzeszów','Polska','123456789','2026-07-19 18:43:57'),(31,15,'Miłosz','Kowalski','Senatorska 109','35-317','Rzeszów','Polska','123456789','2026-07-19 18:51:25');
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (29,32,2069,'Lenovo',5,550.00,NULL);
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `fk_orders_users` (`user_id`),
  KEY `fk_orders_addresses` (`address_id`),
  CONSTRAINT `fk_orders_addresses` FOREIGN KEY (`address_id`) REFERENCES `order_addresses` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_orders_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (32,15,31,'COURIER',15.00,NULL,NULL,NULL,'BLIK',2765.00,'NEW','2026-07-19 18:51:25','MITS-20260719-00001');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (37,2068,'1784459859912-462988.jpg','uploads/products/21/2068/1784459859912-462988.jpg',1,'2026-07-19 13:17:39'),(39,2069,'1784468295166-229697.JPG','uploads/products/21/2069/1784468295166-229697.JPG',1,'2026-07-19 15:38:15'),(40,2069,'1784468295173-490141.jpg','uploads/products/21/2069/1784468295173-490141.jpg',0,'2026-07-19 15:38:15');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=2070 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2067,NULL,'Lenovo IdeaPad','Lenovo IdeaPadLenovo IdeaPadLenovo IdeaPadLenovo IdeaPadLenovo IdeaPadLenovo IdeaPad',2200.00,5,1,0,'2026-07-18 15:48:23','2026-07-19 20:51:06',NULL,'[{\"name\": \"RAM\", \"value\": \"16GB\"}]','Lenovo','IdeaPad',21,2,8,'Lenovo-IdeaPad-21'),(2068,NULL,'Lenovo G510','seller-productsseller-productsseller-productsseller-productsseller-productsseller-productsseller-productsseller-productsseller-productsseller-productsseller-productsseller-products',1234.00,5,1,1,'2026-07-18 15:50:15','2026-07-19 20:51:06',NULL,'[{\"name\": \"RAM\", \"value\": \"8GB\"}]','Lenovo','IdeaPad',21,1,3,'Lenovo-G510-21'),(2069,NULL,'Lenovo','Opis laptopa Lenovo G510. Opis laptopa Lenovo G510. ',550.00,0,0,0,'2026-07-18 17:15:04','2026-07-19 20:51:25',NULL,'[{\"name\": \"RAM\", \"value\": \"8GB\"}]','Lenovo',' IdeaPad',21,2,8,'Lenovo-21');
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
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (26,12,'409f950e-c486-4d0a-acd4-ba97b4d6e8e2','2026-07-21 12:59:32',1,'2026-07-14 10:59:32'),(30,12,'56294c60-9b4f-444b-bf75-1b9952abc439','2026-07-21 13:22:57',0,'2026-07-14 11:22:57'),(35,21,'73d67a18-bb4b-4e7e-a64f-6852439fad26','2026-07-22 16:20:12',1,'2026-07-15 14:20:12'),(36,21,'f40b2eb7-130d-4c7b-b72b-f404ce84f06f','2026-07-22 19:15:26',0,'2026-07-15 17:15:26'),(37,21,'152e49bd-b469-4cf1-95a2-c3bfd590a4fe','2026-07-23 11:45:00',0,'2026-07-16 09:45:00'),(39,21,'fa68a931-a2d7-4b9d-98b2-8a338b41b31f','2026-07-23 18:08:16',1,'2026-07-16 16:08:16'),(43,21,'6b7d7490-17e5-47e7-90b1-405efbd33b39','2026-07-24 11:44:46',1,'2026-07-17 09:44:46'),(44,21,'2b5cf987-5f42-49ea-8ae0-2ee477f8619f','2026-07-24 11:50:22',1,'2026-07-17 09:50:22'),(45,21,'9ae5dc00-5b5a-4593-a533-23149b8abe10','2026-07-24 11:52:07',0,'2026-07-17 09:52:07'),(46,21,'c078d8ca-d446-4df8-a8b3-31b9edede79f','2026-07-24 13:07:40',1,'2026-07-17 11:07:40'),(47,21,'76bdd2b4-70b6-41ed-9a23-ab170e5c0ad7','2026-07-24 13:30:37',1,'2026-07-17 11:30:37'),(48,21,'ec851114-383e-478f-8393-e6a88441bce9','2026-07-24 13:52:03',1,'2026-07-17 11:52:03'),(49,15,'8b8bd0fa-0e19-405e-993b-c768d0af0494','2026-07-24 14:01:23',1,'2026-07-17 12:01:23'),(50,15,'955385b6-d95c-4b01-baa4-4c7db64d857b','2026-07-24 14:03:17',1,'2026-07-17 12:03:17'),(51,21,'c9c3cdaa-99b4-4f72-9818-5ebaac7ba9b1','2026-07-24 14:14:23',1,'2026-07-17 12:14:23'),(52,21,'87096c1b-7dd6-4e87-a66d-d55df076de3c','2026-07-24 14:19:22',1,'2026-07-17 12:19:22'),(53,21,'f4190be1-0d80-4ced-a4a6-2e2605c6ec47','2026-07-24 14:43:40',1,'2026-07-17 12:43:40'),(54,21,'577ec332-82ee-4b9b-bf9a-fcf70ffbd1dd','2026-07-24 14:44:27',1,'2026-07-17 12:44:27'),(55,21,'1c7ab897-49f3-4bb6-b636-f4d2ccf809a3','2026-07-24 14:47:15',1,'2026-07-17 12:47:15'),(56,21,'18795982-513a-4b02-a2f0-9a46e656b6a7','2026-07-24 14:49:18',1,'2026-07-17 12:49:18'),(57,21,'7a8a9743-7a9a-4c50-a347-662a0a7de480','2026-07-24 14:49:51',1,'2026-07-17 12:49:51'),(58,21,'a0ecc92b-442c-4bb3-b719-3e3fe86f1b6c','2026-07-24 14:50:11',1,'2026-07-17 12:50:11'),(59,21,'84184eaa-2a08-4e3d-a05d-2b38e1cc19d9','2026-07-24 14:50:31',1,'2026-07-17 12:50:31'),(60,21,'d0a2c0aa-830b-4db0-af9d-dbae74643b36','2026-07-24 14:51:27',1,'2026-07-17 12:51:27'),(61,21,'34c30046-aa64-40f7-95e5-5e2485f4f64b','2026-07-24 14:56:25',1,'2026-07-17 12:56:25'),(62,21,'19db9a79-9c30-4f12-b863-35e35e20a511','2026-07-24 14:56:54',1,'2026-07-17 12:56:54'),(63,21,'ec14ad9d-4610-4854-92ef-ba7590326a8f','2026-07-24 14:57:12',1,'2026-07-17 12:57:12'),(64,21,'a0b11acf-dd66-48eb-aa26-bf7e34c55ece','2026-07-24 14:58:18',1,'2026-07-17 12:58:18'),(65,21,'5144ea72-9ca6-4a61-a469-155e7a6d4059','2026-07-24 14:59:19',1,'2026-07-17 12:59:19'),(66,21,'8d8b461a-eca7-46ae-83f8-aa74c9e6c64e','2026-07-24 14:59:52',0,'2026-07-17 12:59:52'),(68,15,'c4aa1c54-a322-4dc7-9219-5d744a5cc8d8','2026-07-24 15:51:31',1,'2026-07-17 13:51:31'),(69,21,'71dcd2d8-3e6a-4359-9ff2-2fff37a0d280','2026-07-24 15:53:05',1,'2026-07-17 13:53:05'),(70,15,'1338b516-ee2a-4419-9f3a-b745f37c2872','2026-07-24 15:53:18',0,'2026-07-17 13:53:18'),(71,15,'2b7514d8-b70a-4d74-b567-e70a1ece7eb4','2026-07-24 18:27:49',0,'2026-07-17 16:27:49'),(72,15,'4fc65f19-7c75-4555-85ec-4bc86052474b','2026-07-25 10:27:40',1,'2026-07-18 08:27:40'),(73,21,'07813f9e-ffd4-4d64-a247-89e457f7f05a','2026-07-25 11:31:13',0,'2026-07-18 09:31:13'),(74,21,'4dabdbcb-f567-450e-a328-dc87dd057d55','2026-07-25 14:28:33',1,'2026-07-18 12:28:33'),(75,15,'d1a0af88-461f-44d2-bc30-2e6e662a492f','2026-07-25 15:27:46',1,'2026-07-18 13:27:46'),(76,15,'1a7f5408-6dfe-44ec-b69c-5e9de9dac406','2026-07-25 15:30:21',1,'2026-07-18 13:30:21'),(77,21,'cab525af-eb04-4fd3-b818-d809f30e1f6a','2026-07-25 15:41:12',0,'2026-07-18 13:41:12'),(78,15,'b9e9cab8-7794-4bcb-a300-e187c362b71f','2026-07-25 17:12:06',1,'2026-07-18 15:12:06'),(79,15,'b885a4ef-73cb-47e4-9f4c-e9e8ac97534a','2026-07-25 17:12:18',1,'2026-07-18 15:12:18'),(80,21,'4bed5357-94dd-42c3-b29b-e7530a002236','2026-07-25 17:14:00',1,'2026-07-18 15:14:00'),(81,15,'101a2774-2d76-44b6-af79-59749f25d044','2026-07-25 17:15:29',1,'2026-07-18 15:15:29'),(82,21,'dcf61fcc-eb79-4cb1-b432-b9689de5dc4c','2026-07-25 17:25:52',1,'2026-07-18 15:25:52'),(83,15,'0e59c92c-e6b1-4a44-9788-8122cc95332e','2026-07-25 17:27:46',0,'2026-07-18 15:27:46'),(84,15,'3e122fb7-5cf8-464a-afab-c1b389ec4bd3','2026-07-26 12:45:33',0,'2026-07-19 10:45:33'),(85,15,'f031bc1c-811b-40e7-bea5-c60ecd4937d6','2026-07-26 15:26:57',0,'2026-07-19 13:26:57'),(86,15,'42d2f6e3-4cbb-4db2-9dda-2a8041254f08','2026-07-26 19:55:34',0,'2026-07-19 17:55:34');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seller_profiles`
--

LOCK TABLES `seller_profiles` WRITE;
/*!40000 ALTER TABLE `seller_profiles` DISABLE KEYS */;
INSERT INTO `seller_profiles` VALUES (5,21,'Sklep internetowy','sklep-internetowy-firma-sklep-komputerowy-21','Sklep Komputerowy Sklep Komputerowy 1111111','logo-1784467920815.jpg',NULL,NULL,NULL,'1234567890','Firma Sklep Komputerowy ',0,1,'2026-07-15 17:56:25','2026-07-19 13:32:06','Senatorska 1111','Rzeszów','35-317');
/*!40000 ALTER TABLE `seller_profiles` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12,'milosz@example.com','$2b$10$i4/CGG1ocaWkKkd3JIEVOObA5pNpR4YG0FizcCMX9yxnHz9RrRGqW','Miłosz','','SELLER',0,1,'2026-07-14 10:59:21',NULL,NULL),(15,'admin@example.com','$2b$10$gEblIL8uejvniTKujA1Qo.MX3tr4Ht3CmJWF63T8JkzRkPRgHDPU6','Miłosz','Kowalski','ADMIN',1,1,'2026-07-14 11:11:16','123456789',NULL),(21,'miloszdubiel02@wp.pl','$2b$10$0Z68p8MBNJAHGrBmkBjfoe4lU/d1lUT7cTyT1UDtJczczMpy0dPc6','Miłoszek','Dubiel','SELLER',0,1,'2026-07-15 14:20:06','791417050',NULL);
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

-- Dump completed on 2026-07-19 21:07:00
