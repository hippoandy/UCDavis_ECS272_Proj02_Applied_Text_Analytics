# ECS272-Applied-Text-Analytics
This is the second course project for the Winter 2018 course - ECS272 Information Visualization at UC Davis.
* Winter 2018

### DEMO Site: [https://hipposerver.ddns.net:8901/](https://hipposerver.ddns.net:6100/)

## Introduction

In this project, we will apply some natural language processing (NLP) technique to a text-oriented dataset, and then design a dashboard to visualize and analyze the results of this NLP application.
The datasets are provided by the professor and the student are allowed to choose one of the given datasets.
For this project, I chose to use the Yelp dataset.

The link to the datasets:
* [Yelp Dataset](https://www.yelp.com/dataset)

This project is required to have the followings be completed:
1. to use at least 1 NLP techniques
2. to use at least 3 visualization techniques showing the data
3. each visualization should have at least 2 levels of granularity

Library used:
1. [Compromise JS](https://github.com/spencermountain/compromise)
2. [Compendium JS](https://github.com/Ulflander/compendium-js)

The main interface of this system is a map powered by Google Maps API.
The markers are added based on the current scope of map and the availability of the business data.

The functionalities of this system are:
1. clikc one of a marker on the map to trigger a side panel to show up
2. see the NLP visualization on the side panel (Powered by Compromise lib.)
3. click on the user node in the graph chart will trigger another panel to show detail analysis
### Overlay Panel:
1. see the NLP visualization on the side panel (Powered by Compendium lib.)
2. select a sentence to further parse it. (Powered by Compendium lib.)

## Screenshots
### The System Overview
![Overview](https://github.com/hippoandy/ECS272-Applied-Text-Analytics/blob/master/screenshots/cover.png?raw=true)
### The Side Panel
![Side Panel 1](https://github.com/hippoandy/ECS272-Applied-Text-Analytics/blob/master/screenshots/cover1.png?raw=true)

![Side Panel 2](https://github.com/hippoandy/ECS272-Applied-Text-Analytics/blob/master/screenshots/cover2.png?raw=true)
### The Dashboard
![Dashboard 1](https://github.com/hippoandy/ECS272-Applied-Text-Analytics/blob/master/screenshots/cover3.png?raw=true)

![Dashboard 2](https://github.com/hippoandy/ECS272-Applied-Text-Analytics/blob/master/screenshots/cover4.png?raw=true)
