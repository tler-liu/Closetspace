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


Closetspace uses a purely content-based approach to making recommendations. The setup is that we have an inventory dataset (~7000 items scraped from [Nordstrom](https://www.nordstrom.com/)) from which recommendations can be drawn from and as input we take a user dataset with all items from a user's closet. Each item consists of two parts, the image of the item and metadata about the item, including the item name and brand. We use neural nets to embed both the image and metadata for all items into a smaller dimensional space which aims to capture the important latent information about an item. On a high level, items which are similar should have embeddings that are similar. Therefore, a natural approach to making recommendations, which we adopt, is to recommend items that have a similar embedding to items within a user's wardrobe. To capture information about a user's wardrobe as a whole instead of just individual items, we recommend items that have an embedding close to the mean embedding of all items in a user's wardrobe. 


To embed images into a lower dimensional space, we initially start with a pretrained ResNet50 model provided by PyTorch and removed the fully connected layer at the end used for classification. To make this model more suited to creating good embeddings for fashion items, we trained the model by treating it as an encoder and pairing it with a simple decoder, and optimizing for reconstruction loss. This is because good embeddings should be ones that can be fed through a decoder and reproduce the original image. We freeze the first 3 layers of the ResNet50 model during training to keep the learned information of its pretrained parameters. We used a [fashion dataset on kaggle](https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-dataset) with ~44k images for training. 


To embed the metadata, we simply fed the metadata through a pretrained SBERT. Then to produce a final embedding that takes into account both the image and metadata, we simply concatenated the image embedding with the metadata embedding. Lastly, we use the approximate nearest neighbors oh yeah algorithm (ANNOY) with a euclidean distance metric to efficiently find similar embeddings and return recommendations.

**IMPORTANT**: when making recommendations, we introduce a bit of gaussian noise to the inventory embeddings to make the recommendations nondeterministic. This is just so that a user can keep refreshing the page for additional recommendations.

## Results
