---
title: "Nasa Earth Imagery API"
slug: "nasa-earth-imagery-api"
date: "2015-04-28T12:37:34Z"
author: "Alex Ellis"
---

I recently read on [Hacker News](https://news.ycombinator.com/item?id=9416490) about NASA releasing/opening a [set of APIs](https://data.nasa.gov/developer) which offer up access to a wealth of datasets gathered other the years.

I looked at the different datasets and decided to try to work with the Earth Imagery API which contains images taken from space by the LandSat 8 satellite. Nasa state that the satellite may pass a set location up to once very 16 days and provide a 'fly by' type service which for a given latitude and longitude can give a list of all dates where an image is available.
We can then use that list of dates to request individual thumbnails and a zoom or scale factor.

My code is available as a 'gist' on GitHub with some minimal comments.

Why don't you try downloading the code and pasting in an interesting location such as the Chernobyl exclusion zone, where it's possible to see a new bright metal object being placed over the old reactor shelter? See what happens when you change the tileDimension variable to set the scale and zoom.

![Chernobyl at 1.25 scale](/content/images/2015/04/f0354d715ffb6252faef3a959e0e0aeb.jpg)

Scaled at 1.25

![Chernobyl at 0.35 scale](/content/images/2015/04/37dba56128a96771b5bc1f7212529b44.jpg)

Scaled at 0.35

#### The node.js code

<script src="https://gist.github.com/alexellis/0bb982253f3619e29f18.js"></script>

#### Things I learnt

Things I learnt about or tried with this coding session:

* request library for pulling .jpg images
* async library for both sequencing my request of thumbnail URLs from the service
* async service for queuing .jpg download requests in batches of 5 - so that we do not throttle our connection
* I applied for a generic US data API key, which has a limit of 1000 requests per hour. That soon got used up in debugging so I introduced a 'cap' variable.
* The demo API key is useful for 50 requests per hour


#### Let me know what you think in the comments.