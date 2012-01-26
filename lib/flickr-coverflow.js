(function() {
  var FlickrCoverFlow, FlickrCoverFlowStyle, log;

  if (typeof console !== "undefined" && console !== null) {
    console.log("*** WARNING *** Enhancing String object with \"capitalize()\" method");
  }

  String.prototype.capitalize = function() {
    if (this.length > 1) {
      return "" + (this[0].toUpperCase()) + (this.slice(1, this.length + 1 || 9e9).toLowerCase());
    } else if (this.length = 1) {
      return this.toUpperCase();
    } else {
      return this;
    }
  };

  if (typeof Logger !== "undefined" && Logger !== null) {
    log = new Logger({
      level: LogLevel.INFO
    });
  }

  FlickrCoverFlowStyle = (function() {
    var layouts, positions3D, positionsFlat, transform;

    layouts = {
      tiny: {
        url: "url_t",
        height: "102px",
        width: "250px",
        imgMaxWidth: "71px",
        urlZoom: "url_s"
      },
      small: {
        url: "url_s",
        height: "202px",
        width: "480px",
        imgMaxWidth: "143px",
        urlZoom: "url_m"
      },
      medium: {
        url: "url_m",
        height: "302px",
        width: "960px",
        imgMaxWidth: "215px",
        urlZoom: "url_m"
      }
    };

    transform = function(transformations) {
      return "transform: " + transformations + ";\n-moz-transform: " + transformations + "; /* Firefox */\n-webkit-transform: " + transformations + "; /* Safari, Chrome */\n-o-transform: " + transformations + "; /* Opera */\n-ms-transform: " + transformations + "; /* ie 10 */";
    };

    positionsFlat = [];

    positions3D = [];

    FlickrCoverFlowStyle.prototype.style3d = function() {
      return "<style>\n	.flickrCoverflow-image[data-position='0'] {\n		" + (transform("scale(.2) translateX(" + (this.position(0, '3D')) + ") translateZ(0) perspective(0) rotateY(0)")) + ";\n	}\n\n	.flickrCoverflow-image[data-position='1'] {\n		" + (transform("scale(.6) translateX(0) translateZ(" + (this.position(1, '3D')) + ") perspective(700) rotateY(45deg)")) + ";\n	}\n\n	.flickrCoverflow-image[data-position='2'] {\n		" + (transform("scale(.8) translateX(" + (this.position(2, '3D')) + ") translateZ(100px) perspective(500) rotateY(45deg)")) + ";\n	}\n\n	.flickrCoverflow-image[data-position='3'] {\n		" + (transform("scale(1) translateX(" + (this.position(3, '3D')) + ") translateZ(200px) perspective(0) rotateY(0deg)")) + ";\n	}\n\n	.flickrCoverflow-image[data-position='4'] {\n		" + (transform("scale(.8) translateX(" + (this.position(4, '3D')) + ") translateZ(100px) perspective(500) rotateY(-45deg)")) + ";\n	}\n\n	.flickrCoverflow-image[data-position='5'] {\n		" + (transform("scale(.6) translateX(" + (this.position(5, '3D')) + ") translateZ(0) perspective(700) rotateY(-45deg)")) + ";\n	}\n\n	.flickrCoverflow-image[data-position='6'] {\n		" + (transform("scale(.2) translateX(" + (this.position(6, '3D')) + ") translateZ(0) perspective(0) rotateY(0)")) + ";\n	}\n	\n	.flickrCoverflow-previous,\n	.flickrCoverflow-next {\n		" + (transform("translateZ(199px)")) + "\n	}\n</style>";
    };

    FlickrCoverFlowStyle.prototype.style = function() {
      return "<style>\n	" + this.containerSelector + "{\n		text-align: center;\n		position: relative;\n		height: " + (this.height()) + ";\n		width: " + (this.width()) + ";\n	}\n\n	.flickrCoverflow-image {\n		display: inline-block;\n		min-width: 80px;\n		min-height: 80px;\n		margin: 0;\n		vertical-align: bottom;\n		text-align: center;\n		position: absolute;\n		left:0;\n		bottom: 0;\n		z-index: 0;\n	}\n\n	.flickrCoverflow-title {\n		display: none;\n		background-color: #000;\n		color: #fff;\n		font-family: Helvetica, Tahoma, Arial, Verdana;\n		font-size: .7em;\n		width: 80px;\n		word-wrap: break-word;\n		text-overflow: ellipsis;\n		overflow:hidden;\n		white-space: nowrap;\n		bottom: 0;\n	}\n\n	.flickrCoverflow-image[data-template=yes],\n	.flickrCoverflow-image[data-position='none'] {\n		display: none;\n		opacity: 0;\n	}\n\n	:not(.flickrCoverflow-image[data-position='none']) {\n		display: inline-block;\n		opacity: 1;\n	}\n	\n	.flickrCoverflow-previous,\n	.flickrCoverflow-next {\n		position: absolute;\n		z-index: 3;\n		width: 50%;\n		height: 100%;\n		cursor: pointer;\n	}\n	\n	.flickrCoverflow-previous {\n		left: 0;\n	}\n	\n	.flickrCoverflow-next {\n		right: 0;\n	}\n\n	/***/\n\n	.flickrCoverflow-image[data-position='0'] {\n		z-index: 0;\n		opacity: 0;\n		" + (transform("translateX(" + (this.position(0)) + ")")) + "\n	}\n\n	.flickrCoverflow-image[data-position='1'] {\n		z-index: 1;\n		" + (transform("translateX(" + (this.position(1)) + ")")) + "\n	}\n\n	.flickrCoverflow-image[data-position='2'] {\n		z-index: 2;\n		box-shadow: 0 0 10px #000;\n		" + (transform("translateX(" + (this.position(2)) + ")")) + "\n	}\n\n	.flickrCoverflow-image[data-position='3'] {\n		z-index: 4;\n		box-shadow: 0 0 20px #000;\n		" + (transform("translateX(" + (this.position(3)) + ")")) + "\n	}\n\n	.flickrCoverflow-image[data-position='4'] {\n		z-index: 2;\n		box-shadow: 0 0 10px #000;\n		" + (transform("translateX(" + (this.position(4)) + ")")) + "\n	}\n\n	.flickrCoverflow-image[data-position='5'] {\n		z-index: 1;\n		" + (transform("translateX(" + (this.position(5)) + ")")) + "\n	}\n\n	.flickrCoverflow-image[data-position='6'] {\n		z-index: 0;\n		opacity: 0;\n		" + (transform("translateX(" + (this.position(6)) + ")")) + "\n	}\n\n	/***/\n\n	.flickrCoverflow-img {\n		vertical-align: inherit;\n		max-height: 100%;\n	}\n</style>";
    };

    FlickrCoverFlowStyle.prototype.position = function(position, depth) {
      var positions;
      if (depth == null) depth = "Flat";
      if ((position != null ? position.constructor : void 0) !== Number) {
        throw new Error("position must be a not null Number");
      }
      positions = depth === "3D" ? positions3D : positionsFlat;
      if (log != null) log.debug("positions: " + positions);
      if (log != null) {
        log.debug("calculating position(" + position + ", " + depth + ") = " + positions[position]);
      }
      return positions[position];
    };

    FlickrCoverFlowStyle.prototype.width = function() {
      return layouts[this.size].width;
    };

    FlickrCoverFlowStyle.prototype.height = function() {
      return layouts[this.size].height;
    };

    FlickrCoverFlowStyle.prototype.url = function() {
      return layouts[this.size].url;
    };

    FlickrCoverFlowStyle.prototype.urlZoom = function() {
      return layouts[this.size].urlZoom;
    };

    FlickrCoverFlowStyle.prototype.maxWidth = function() {
      return layouts[this.size].imgMaxWidth;
    };

    function FlickrCoverFlowStyle(size, containerSelector, renderIn3D) {
      this.size = size;
      this.containerSelector = containerSelector;
      this.renderIn3D = renderIn3D != null ? renderIn3D : false;
      if (!layouts[this.size]) {
        throw new Error("" + this.size + " is not a valid flickr-coverflow size");
      }
      if (!this.containerSelector || !$(this.containerSelector)) {
        throw new Error("" + this.containerSelector + " is not a valid css selector");
      }
      if (log != null) log.info("Render in 3D: " + this.renderIn3D);
      Number.prototype.percentOf = function(width) {
        var units, value;
        if (!width) throw new Error("width cannot be null or empty");
        units = width.replace(/\d*/, "");
        value = parseInt(width);
        return "" + (Math.round((this / 100) * value)) + units;
      };
      positions3D = [0, 0, 20..percentOf(this.width()), 35..percentOf(this.width()), 65..percentOf(this.width()), 115..percentOf(this.width()), 115..percentOf(this.width())];
      positionsFlat = [0, 0, 20..percentOf(this.width()), 35..percentOf(this.width()), 50..percentOf(this.width()), 70..percentOf(this.width()), 70..percentOf(this.width())];
      delete Number.prototype.percentOf;
      if (log != null) log.debug("positions3D: " + positions3D);
      if (log != null) log.debug("positionsFlat: " + positionsFlat);
    }

    FlickrCoverFlowStyle.prototype.apply = function() {
      var head;
      if (log != null) log.debug("about to apply required style");
      head = $("head");
      if (this.renderIn3D) head.prepend(this.style3d());
      head.prepend("<style>\n	.flickrCoverflow-img {\n		max-width: " + (this.maxWidth()) + ";\n	}\n</style>");
      return head.prepend(this.style());
    };

    return FlickrCoverFlowStyle;

  })();

  FlickrCoverFlow = (function() {
    var endOfStream, isMobile, pendingImageSrc, touchMoveStep, version;

    pendingImageSrc = "data:image/png;base64,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";

    endOfStream = false;

    touchMoveStep = 70;

    version = "0.5.2";

    isMobile = function() {
      return $.os.ios || $.os.android || $.os.webos || $.os.touchpad || $.os.iphone || $.os.ipad || ($.os.blackberry && /7\.[1-9]\d*/g.test($.os.version));
    };

    FlickrCoverFlow.prototype.images = ".flickrCoverflow-image[data-template=no]";

    FlickrCoverFlow.prototype.previousButton = ".flickrCoverflow-previous";

    FlickrCoverFlow.prototype.nextButton = ".flickrCoverflow-next";

    FlickrCoverFlow.prototype.pageSize = 7;

    FlickrCoverFlow.prototype.source = "http://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&format=json&nojsoncallback=1&extras=url_t,url_s,url_m";

    function FlickrCoverFlow(apiKey, user, htmlNode, options) {
      var property, value, _base, _ref;
      this.apiKey = apiKey;
      this.user = user;
      this.htmlNode = htmlNode;
      this.options = options != null ? options : {
        size: "tiny"
      };
      if (log != null) {
        log.info("Coverflow html node: <" + (typeof (_base = this.htmlNode).prop === "function" ? _base.prop('tagName') : void 0) + ":" + this.htmlNode.selector + "/>");
      }
      if (this.pageSize % 2 === 0) {
        throw new Error("page size must be odd, actual = " + this.pageSize);
      }
      this.htmlNode.attr({
        "data-version": version
      });
      this.createImageTemplate();
      this.style = new FlickrCoverFlowStyle(this.options.size, this.htmlNode.selector, this.options.renderIn3D);
      this.style.apply();
      this.offset = this.startX = 0;
      this.photos = [];
      this.page = 1;
      this.median = (this.pageSize - 1) / 2;
      this.medianImage = ".flickrCoverflow-image[data-position='" + this.median + "']";
      this.source += "&api_key=" + this.apiKey + "&user_id=" + this.user + "&per_page=" + (this.pageSize * 2);
      this.attachEvents();
      if (typeof logLevelIsTrace === "function" ? logLevelIsTrace() : void 0) {
        for (property in this) {
          value = this[property];
          if (log != null) log.trace("" + property + ": " + value);
        }
      }
      if (typeof logLevelIsTrace === "function" ? logLevelIsTrace() : void 0) {
        _ref = this.htmlNode;
        for (property in _ref) {
          value = _ref[property];
          if (log != null) {
            log.trace("@htmlNode properties: \n" + property + ": " + value);
          }
        }
      }
    }

    FlickrCoverFlow.prototype.version = function() {
      return version;
    };

    FlickrCoverFlow.prototype.createImageTemplate = function() {
      return this.htmlNode.html("<div class=\"flickrCoverflow-previous\"></div>\n<div class=\"flickrCoverflow-next\"></div>\n<div class=\"flickrCoverflow-image\" data-template=\"yes\">\n	<img class=\"flickrCoverflow-img\" src=\"" + pendingImageSrc + "\"/>\n	<div class=\"flickrCoverflow-title\">No title</div>\n</div>");
    };

    FlickrCoverFlow.prototype.load = function() {
      var pageSource,
        _this = this;
      pageSource = "" + this.source + "&page=" + this.page;
      if (log != null) log.info("load > Page source: " + pageSource);
      return $.getJSON(pageSource, function(data) {
        var i, photo, visibleImages, _i, _j, _len, _len2, _ref;
        if (!_this.photos.length || (!data.photos.photo.length && !endOfStream)) {
          endOfStream = !data.photos.photo.length;
          photo = {
            placeHolder: true,
            title: "none",
            url_t: pendingImageSrc,
            url_s: pendingImageSrc,
            url_m: pendingImageSrc
          };
          for (i = 0; i <= 2; i++) {
            _this.photos.push(photo);
          }
        }
        _ref = data.photos.photo;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          photo = _ref[_i];
          _this.photos.push(photo);
        }
        if (log != null) log.debug("" + _this.photos.length + " loaded");
        if (log != null) log.debug("" + data.photos.total + " photos to handle");
        visibleImages = _this.photos.slice(_this.offset, _this.pageSize);
        for (_j = 0, _len2 = visibleImages.length; _j < _len2; _j++) {
          photo = visibleImages[_j];
          _this.appendPhoto(photo);
        }
        _this.setImagesPosition();
        return _this.addZoomEvent();
      });
    };

    FlickrCoverFlow.prototype.appendPhoto = function(photo, callback) {
      var image;
      if (callback == null) callback = null;
      if (log != null) log.debug("append photo");
      image = this.createImageFrom(photo);
      $("img", image).error(function() {
        if (log != null) {
          log.error("Cannot load '" + photo.title + "' (" + ($(this).attr('src')) + ")");
        }
        $(this).off("error").attr("src", pendingImageSrc);
        return $(".flickrCoverflow-title", image).show();
      });
      return this.htmlNode.append(image);
    };

    FlickrCoverFlow.prototype.createImageFrom = function(photo) {
      var image, innerImg;
      if (log != null) {
        log.debug("photo: " + photo.title + ", " + (this.style.url()) + ": " + photo[this.style.url()]);
      }
      image = $(".flickrCoverflow-image[data-template=yes]").clone();
      image.attr({
        "data-template": "no",
        "data-show": "yes",
        title: photo.title,
        "data-zoom-url": photo[this.style.urlZoom()]
      });
      innerImg = $("img", image);
      innerImg.attr({
        "src": photo[this.style.url()],
        "alt": photo.title
      });
      $(".flickrCoverflow-title", image).text(photo.title);
      if (photo.placeHolder) {
        image.css({
          "display": "none"
        });
      }
      return image;
    };

    FlickrCoverFlow.prototype.attachEvents = function() {
      if (log != null) log.debug("median = " + this.median);
      if (log != null) log.debug("offset in attachEvents: " + this.offset);
      if (isMobile()) {
        return this.attachTouchEvents();
      } else {
        this.attachNextEvent();
        return this.attachPreviousEvent();
      }
    };

    FlickrCoverFlow.prototype.attachNextEvent = function() {
      var _this = this;
      return $(this.nextButton, this.htmlNode).on("mousedown", function() {
        return _this.next();
      }).css("cursor", "pointer");
    };

    FlickrCoverFlow.prototype.attachPreviousEvent = function() {
      var _this = this;
      return $(this.previousButton, this.htmlNode).on("mousedown", function() {
        return _this.previous();
      }).css("cursor", "pointer");
    };

    FlickrCoverFlow.prototype.addZoomEvent = function() {
      var trigerringElement, triggeringEvent,
        _this = this;
      triggeringEvent = isMobile() ? "tap" : "click";
      if (log != null) {
        log.debug("median image selector: '" + this.medianImage + "'");
      }
      trigerringElement = $(this.medianImage, this.htmlNode).css({
        "cursor": "pointer"
      });
      return trigerringElement.on(triggeringEvent, function() {
        if (log != null) log.debug("about to trigger 'zoom' event");
        return _this.htmlNode.trigger($.Event("zoom", {
          zoomUrl: trigerringElement.attr("data-zoom-url")
        }));
      });
    };

    FlickrCoverFlow.prototype.hasNext = function() {
      return this.photos[this.offset + this.pageSize];
    };

    FlickrCoverFlow.prototype.next = function() {
      if (log != null) log.debug("next image");
      if (log != null) log.debug("offset before next: " + this.offset);
      if (typeof logLevelIsTrace === "function" ? logLevelIsTrace() : void 0) {
        if (log != null) {
          log.trace("nextPhotoIsLoaded: " + (this.nextPhotoIsLoaded()));
        }
      }
      if (this.hasNext()) {
        this.clearZoomEvent();
        $(this.images).eq(this.offset).attr({
          "data-show": "no",
          "data-position": "none"
        });
        if (this.nextPhotoIsLoaded()) {
          if (log != null) log.debug("next photo is loaded");
          this.showNextPhoto();
          this.offset++;
          this.loadNewPageIfPageChanged();
        } else {
          if (log != null) log.debug("next photo is NOT loaded");
          this.appendNextPhotoIfAny();
        }
        this.setImagesPosition();
        this.addZoomEvent();
      }
      return log != null ? log.debug("offset after next: " + this.offset) : void 0;
    };

    FlickrCoverFlow.prototype.nextPhotoIsLoaded = function() {
      var methodName;
      methodName = "nextPhotoIsLoaded";
      if (log != null) log.debug("" + methodName + ": images = " + this.images);
      if (log != null) log.debug("" + methodName + ": offset = " + this.offset);
      if (log != null) {
        log.debug("" + methodName + ": pageSize = " + this.pageSize);
      }
      return $(this.images).eq(this.offset + this.pageSize).attr("class");
    };

    FlickrCoverFlow.prototype.clearZoomEvent = function() {
      return $(this.medianImage, this.htmlNode).off("tap click");
    };

    FlickrCoverFlow.prototype.showNextPhoto = function() {
      if (log != null) log.debug("show photo");
      return $(this.images).eq(this.offset + this.pageSize).attr({
        "data-show": "yes"
      });
    };

    FlickrCoverFlow.prototype.loadNewPageIfPageChanged = function() {
      if (!this.isSamePage()) {
        this.page++;
        if (log != null) log.debug("page " + this.page);
        if (!this.nextPhotoIsLoaded()) return this.load();
      }
    };

    FlickrCoverFlow.prototype.isSamePage = function() {
      return this.offset % this.pageSize !== 0;
    };

    FlickrCoverFlow.prototype.appendNextPhotoIfAny = function() {
      var nextPhoto;
      if (nextPhoto = this.hasNext()) {
        if (log != null) {
          log.debug("photo '" + nextPhoto.title + "' exists at index " + (this.offset + this.pageSize));
        }
        this.offset++;
        this.appendPhoto(nextPhoto);
        return this.loadNewPageIfPageChanged();
      }
    };

    FlickrCoverFlow.prototype.setImagesPosition = function() {
      var image, position, _len, _ref, _results;
      _ref = $(".flickrCoverflow-image[data-show='yes']");
      _results = [];
      for (position = 0, _len = _ref.length; position < _len; position++) {
        image = _ref[position];
        if (log != null) {
          log.debug("position + median: " + position + ", image: " + image);
        }
        _results.push($(image).attr({
          "data-position": position
        }));
      }
      return _results;
    };

    FlickrCoverFlow.prototype.previous = function() {
      if (log != null) log.debug("previous image");
      if (log != null) log.debug("offset before previous: " + this.offset);
      if (this.offset) {
        this.clearZoomEvent();
        $(this.images).eq(this.offset + this.pageSize - 1).attr({
          "data-show": "no",
          "data-position": "none"
        });
        this.offset--;
        $(this.images).eq(this.offset).attr({
          "data-show": "yes"
        });
        this.setImagesPosition();
        this.addZoomEvent();
      }
      return log != null ? log.debug("offset after previous: " + this.offset) : void 0;
    };

    FlickrCoverFlow.prototype.touchMoveHandler = function() {
      var endX;
      endX = event.targetTouches[0].pageX;
      this.deltaX = endX - this.startX;
      if (log != null) log.trace("@deltaX: " + this.deltaX);
      if (this.deltaX > touchMoveStep) {
        if (log != null) log.debug("@deltaX before previous(): " + this.deltaX);
        this.startX = endX;
        this.deltaX = 0;
        this.previous();
        if (log != null) log.debug("@deltaX after previous(): " + this.deltaX);
      }
      if (this.deltaX < -touchMoveStep) {
        if (log != null) log.debug("@deltaX before next(): " + this.deltaX);
        this.startX = endX;
        this.deltaX = 0;
        this.next();
        return log != null ? log.debug("@deltaX after next(): " + this.deltaX) : void 0;
      }
    };

    FlickrCoverFlow.prototype.attachTouchEvents = function() {
      var _this = this;
      if (log != null) log.debug("attaching touch events");
      if (log != null) log.debug("@htmlNode.id: " + (this.htmlNode.attr('id')));
      this.htmlNode.on("touchstart", function(event) {
        _this.startX = event.targetTouches[0].pageX;
        return log != null ? log.debug("@startX: " + _this.startX) : void 0;
      });
      this.htmlNode.on("touchmove", function(event) {
        return _this.touchMoveHandler();
      });
      return this.htmlNode.on("touchend", function() {
        return _this.deltaX = 0;
      });
    };

    return FlickrCoverFlow;

  })();

  (function($) {
    return $.fn.flickrCoverflow = function(apiKey, user, options) {
      var coverflow;
      if (options == null) {
        options = {
          size: "tiny"
        };
      }
      if (log != null) log.info("Using flickrCoverflow jQuery plugin");
      if (this.css("display") !== "none") {
        coverflow = new FlickrCoverFlow(apiKey, user, this, options);
        coverflow.load();
        if (log != null) {
          log.info("flickrCoverflow selector: " + coverflow.htmlNode.selector);
        }
      } else {
        if (log != null) {
          log.info("" + (this.attr('id')) + " is not visible, no need to create coverflow");
        }
      }
      return this;
    };
  })($);

}).call(this);
