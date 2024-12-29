# Closetspace

A content-based recommender system that provides personalized fashion recommendations based on your wardrobe 

## Table of Contents

- [About](#About)
- [Installation and Usage](#Installation-and-Usage)
- [Motivation](#Motivation)
- [Methodology](#Methodology)
- [Results](#Results)

## About
Closetspace is a wardrobe management app designed to help users build and maintain an intentional wardrobe that enhances their personal style. Users can upload images of their clothing items and view their entire wardrobe in a modern UI. The app analyzes the user's wardrobe content using machine learning to offer personalized recommendations that complement the user's style. By leveraging modern neural nets, Closetspace can pick up on nuances in a user's fashion choices while avoiding the need to collect tons of user data, which traditional recommender systems using collaborative filtering techniques fail to achieve in the fashion context. 

## Installation and Usage

## Motivation
Many people, myself included, are interested in fashion and dressing to impress. The high prices of clothing in today's economy combined with the overwhelming number of clothing options and retailers, however, has made me regret many of the purchases I've made in the past. A good fashion recommender system can filter out the bad purchases and help you be more intentional about where your money goes. 


Existing systems have some notable flaws. 
1. Modern approaches based on collaborative filtering algorithms can lead to predictable and boring recommendations. Style is personal, and shouldn't be purely based on what other people like. These recommendations can lead to homogenity and be overly basic.
2. Low serendipity: apps like instagram use implicit data (e.g. sites you recently visited) to recommend to you items that you've already seen. There isn't a point in recommending to someone something that they were already actively searching for.
3. Systems don't take into account items you already have in your wardrobe. Perhaps the best indication of what someone's style is can be derived from what they have already bought, so why not use this data?


Closetspace's recommender system was built with these flaws in mind.

## Methodology
![Block Diagram](images/block_diagram.jpeg)

## Results
