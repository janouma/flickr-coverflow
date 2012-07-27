# flickr-coverflow - a zepto.js plugin to display your public flickr gallery as a coverflow, on mobile and desktop html5 compliant browsers

To use flickr-coverflow, zepto.js *(<http://zeptojs.com/>)* is required.

If you are using a version of zepto.js where clone() method is missing, you can use the script "lib/zepto.clone.fix.js" provided by the current distribution to fix that.

# Example
## Html
    <div id="coverflow"/>
## Script
    $(function (){
        $("#coverflow").flickrCoverflow(
            "flickr api key",
            "flickr user",
            {
                size: "small",
                renderIn3D: true
            }
        );
    });

>- "**flickr api key**" can be obtained via your flickr account on <http://www.flickr.com/>
- "**flickr user**" can be obtained on <http://idgettr.com/>

## Options
It is possible to configure the **size** of loaded images and the **3D** effect of the coverflow via the third argument of the plugin like this:

    {size:"small", renderIn3D:true}

Available sizes are **tiny**, **small** and **medium**. If **renderIn3D** is set to false — *or if browser doesn't support css 3D transformation yet e.g. Opera*, pictures are displayed flatten as a card game.

If the third argument is not provided, the following default values are applied: **size = "tiny"** and **renderIn3D = false**

## Events
When tapping/clicking on the current picture a **zoom** event is triggered, allowing to show a larger version of the picture. The related event object provides a **zoomUrl** property which is the flickr url of the larger image:

    $("#coverflow").on("zoom", function(event) {
        console.log("Zoom Event has been triggered on " + ($(this).attr('id')) + ", url: " + event.zoomUrl);
    });

>*When using **medium** size, the **zoomUrl** property is set to the current picture url because larger version are not guaranteed*.

## Styling
Custom styling is possible via the following classes:

    .flickrCoverflow-image {
        min-width: 50px;
        min-height: 50px;
    }

    .flickrCoverflow-image,
    .flickrCoverflow-img {
        border:solid 0;
        border-radius: 5px;
    }

    .flickrCoverflow-title {
        background-color:#aaa;
        color:#ffffde;
        font-size:.8em;
        font-weight:bold;
    }

- **.flickrCoverflow-image** is the div containing each picture
- **.flickrCoverflow-img** is the actual **img** element of the picture
- **.flickrCoverflow-title** is the title displayed only on failure to load the picture

## FX
To get the animation on swipe, add a link to **flickr-coverflow-animated.min.css**.

Likewise, if you fancy a reflection effect *(only visible on webkit based browser — e.g. Safari and Chrome)*, add a link to **flickr-coverflow-fx.min.css** — *although bear in mind that it will cause a slightly drop of performances*.

# Mobile and desktop specifics
On mobile devices flickr-coverflow react to swipe gestures for navigation and tap for zoom event triggering, while click is used on desktop — *click on the left of the current picture to go backward and on the right to go forward*.

To prevent mobile browser window from moving on touch events, add the following code to your script:

    $(document).on("touchmove", function(event) {
        return event.preventDefault();
    });

# Preview
**[see jsFiddle preview](http://jsfiddle.net/7AAth/13/)**