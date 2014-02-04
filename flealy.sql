-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 04, 2014 at 02:13 AM
-- Server version: 5.6.12
-- PHP Version: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `flealy`
--
CREATE DATABASE IF NOT EXISTS `flealy` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `flealy`;

-- --------------------------------------------------------

--
-- Table structure for table `authorisation_token`
--

CREATE TABLE IF NOT EXISTS `authorisation_token` (
  `user_id` int(11) NOT NULL,
  `token` varchar(512) NOT NULL,
  `created` int(11) NOT NULL,
  `last_use` int(11) NOT NULL,
  `remote_address` varchar(15) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `authorisation_token`
--

INSERT INTO `authorisation_token` (`user_id`, `token`, `created`, `last_use`, `remote_address`) VALUES
(21, '4yKNe0OIKIHXlAjw55f8xOF1rFePSOm6HGZIVhJ6bfuUiCtRSQFjzv1UrULBOlOkwwcJh2KIkobfJ3YimxwkxSxLjvrraJYRmJGShSLlKcnzna8k8jGmoFyKKbXCJcrEX0lBKOMM5uait8KF8CiajXT5xem5iML1XqDwMsEGUVeGPlIr22eXXJ8beVYWdLzA6QRT08uKhX6hj7RtEv1K9nv9zPwIecGgc3Q7VPZwEEf3LinDAYdMLx1gqRNkiZ6n0AoLvWIYHbrXmNz7CEivr3XxJErCD6zSU1tic69yfuA4ExPzc24tbtYFoeAE6Eilyz3HE9lz9lrkyk0yfRsLVTm3zU1zXrXx0HjaiiEp2nA0XD5DH7CUPsyrRYkTeuZQonpvNtgG5ZGwe8vlVmCEwblCBnBMb1GLrKqZiCuxm7gtMoYZAzCJPuglync9jUHI2aFPPXAqY9ZH9cLnBphFrfODBtLJx9h4Nouh8XZQOSEJXN6aBWsg2bDnDuK63W5b', 1391462208, 0, '127.0.0.1');

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE IF NOT EXISTS `cards` (
  `card_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `last_four_digits` int(11) NOT NULL,
  `type` varchar(32) NOT NULL,
  `stripe_card_id` varchar(128) NOT NULL,
  `exp_month` int(11) NOT NULL,
  `exp_year` int(11) NOT NULL,
  `stripe_fingerprint` varchar(64) NOT NULL,
  PRIMARY KEY (`card_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE IF NOT EXISTS `carts` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `user_id` (`user_id`),
  KEY `item_id` (`item_id`),
  KEY `user_id_2` (`user_id`),
  KEY `cart_id` (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `latitude` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `average_rating` float NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=27 ;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `name`, `description`, `price`, `image_url`, `latitude`, `longitude`, `user_id`, `average_rating`) VALUES
(9, 'Best "coffee" beans!', 'Imported from the best place to make coffee in the world. Produced by the best plants. It tastes damn good.', 6.25, 'http://www.cabercoffee.com/Media/Default/images/Drinks/Espresso/beans-index-4.jpg', '51.488717', '-3.175950', 12, 1),
(10, 'Daily Routine - 12x18', 'The mantra for creating awesome products. Perfect for any productive environment. Get some startup motivation. Size: 12x18. Frame not included.', 30, 'http://d3u67r7pp2lrq5.cloudfront.net/product_photos/8974741/Screen_20Shot_202013-11-17_20at_209.19.08_20PM_original.png', '51.490962', '-3.178310', 12, 0);

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE IF NOT EXISTS `purchases` (
  `purchase_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `card_id` varchar(32) NOT NULL,
  `stripe_transaction_id` varchar(255) NOT NULL,
  `purchase_epoch` int(11) NOT NULL,
  PRIMARY KEY (`purchase_id`),
  KEY `item_id` (`item_id`),
  KEY `buyer_id` (`buyer_id`),
  KEY `card_id` (`card_id`),
  KEY `card_id_2` (`card_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`purchase_id`, `item_id`, `buyer_id`, `card_id`, `stripe_transaction_id`, `purchase_epoch`) VALUES
(37, 9, 12, 'card_10339u2LkSaODyguFImvtfSV', 'tok_10339u2LkSaODygusUW4M7gw', 1386017116);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE IF NOT EXISTS `ratings` (
  `rating_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `rater_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL COMMENT '1 == thumbs up, 0 == thumbs down',
  PRIMARY KEY (`rating_id`),
  KEY `item_id` (`item_id`),
  KEY `rater_id` (`rater_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=29 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password` varchar(64) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `location` varchar(128) NOT NULL,
  `description` varchar(255) NOT NULL,
  `sales` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `image_url`, `location`, `description`, `sales`) VALUES
(12, 'kiran', 'kiransinghpanesar@googlemail.com', 'df24c0e28b8695918120e11730d322e06fba7a04', 'http://flea.ly/items/2O3f3L1J0B200Z3g0m2d/Image%202013.11.26%2021%3A44%3A53.png', 'Cardiff, Wales', 'I create numerous motivational startup posters. I also sell tasty coffee!', 2),
(21, 'DanielKoehler', 'koehlerda@cardiff.ac.uk', 'b84b6744b75490d022123c9c6f6aaa1af7c29f64', 'https://flealy/api/media/c6090986ae033e08b8996facac95d0a2cbbe4441.png', 'Cardiff', 'Bla bla bla\n', 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cards`
--
ALTER TABLE `cards`
  ADD CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`rater_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
