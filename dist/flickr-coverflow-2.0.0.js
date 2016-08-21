'use strict';

System.register('coverflow', ['flickr-coverflow/logger', 'flickr-coverflow/sheet-list', 'flickr-coverflow/style', 'flickr-coverflow/signal', 'flickr-coverflow/validator'], function (_export, _context) {
  var Logger, SheetList, Style, Signal, Validator;
  return {
    setters: [function (_flickrCoverflowLogger) {
      Logger = _flickrCoverflowLogger.default;
    }, function (_flickrCoverflowSheetList) {
      SheetList = _flickrCoverflowSheetList.default;
    }, function (_flickrCoverflowStyle) {
      Style = _flickrCoverflowStyle.default;
    }, function (_flickrCoverflowSignal) {
      Signal = _flickrCoverflowSignal.default;
    }, function (_flickrCoverflowValidator) {
      Validator = _flickrCoverflowValidator.default;
    }],
    execute: function () {

      const MEDIAN = 3;
      const STARTING_FRAME = MEDIAN;
      const TOUCH_MOVE_STEP = 70;
      const INDEX_ATT = 'data-flickrCoverflow-index';
      const VISIBLE_CSS_CLS = 'flickrCoverflow--visible';
      const TEMPLATE_ATT = 'data-template';
      const FRAME_CSS_CLS = 'flickrCoverflow-frame';
      const ZOOM_ATT = 'data-zoom-url';
      const PAGE_SIZE = 7;
      const CLICK = 'click';
      const TAP_THRESHOLD_DURATION = 100;

      /* Flickr Coverflow 0.1.0 */
      class Coverflow {

        static get PAGE_SIZE() {
          return PAGE_SIZE;
        }

        static get logLevel() {
          return Logger.level;
        }

        static set logLevel(level) {
          Logger.level = level;
          Logger.info('%cFlickr Coverflow 0.1.0', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;');
        }

        static get _touchEnabled() {
          return 'ontouchstart' in window;
        }

        get _bufferEndReached() {
          return !this._images[this._offset + PAGE_SIZE];
        }

        get _nextImage() {
          return this._images[this._offset + PAGE_SIZE - STARTING_FRAME];
        }

        get _nextMounted() {
          return this._allFrames[this._offset + PAGE_SIZE];
        }

        get _allFrames() {
          return Array.from(this._container.querySelectorAll(`.${ FRAME_CSS_CLS }:not([${ TEMPLATE_ATT }])`));
        }

        get _visibleFrames() {
          return Array.from(this._container.querySelectorAll(`.${ VISIBLE_CSS_CLS }`));
        }

        get _median() {
          return this._visibleFrames[MEDIAN];
        }

        get _frameRightOfMedian() {
          return this._visibleFrames[MEDIAN + 1];
        }

        get _pageChanged() {
          return this._offset % PAGE_SIZE === 0;
        }

        constructor({ dataSource, container, size = 'medium', '3d': d3 = false } = {
          dataSource: undefined,
          container: undefined,
          size: undefined,
          '3d': undefined
        }) {
          this._3d = false;
          this._size = 'small';
          this._startX = 0;
          this._deltaX = 0;
          this._offset = 0;
          this._images = [];
          this._initialized = false;
          this._startTime = Number.NEGATIVE_INFINITY;
          this._on = {
            init: new Signal(),
            load: new Signal(),
            zoom: new Signal(),
            previous: new Signal(),
            next: new Signal()
          };

          Logger.log(`${ Coverflow._CLASS_ID } - constructor`);
          Logger.debug(`${ Coverflow._CLASS_ID } - constructor -`, { size, d3 });

          let validator = new Validator(Coverflow._CLASS_ID).method('constructor');

          validator.checkDefined({ dataSource });
          validator.checkString({ size }, ['small', 'medium', 'large']);

          if (!container || !(container instanceof window.HTMLElement)) {
            throw Error(`${ Coverflow._CLASS_ID } - constructor - parameter container is required and must be an HTMLElement. Actual: ${ container }`);
          }

          if (!container.id || document.querySelectorAll(`#${ container.id }`).length > 1) {
            throw Error(`${ Coverflow._CLASS_ID } - constructor - parameter container must have a unique id. Actual: ${ container.id }`);
          }

          if (container.classList.contains(SheetList.cssClass)) {
            Logger.warn(`${ Coverflow._CLASS_ID } - constructor - #${ container.id } is already a coverflow`);
            return;
          }

          this._container = container;
          this._3d = d3;
          this._size = size;
          this._dataSource = dataSource;

          this._generateEventRegisterers();
        }

        _generateEventRegisterers() {
          for (let event of Object.keys(this._on)) {
            let methodName = `on${ event[0].toUpperCase() }${ event.substring(1) }`;

            if (!this[methodName]) {
              this[methodName] = function dynamicEventRegisterer(listener) {
                this._on[event].register(listener);
                return { off: () => this._on[event].unregister(listener) };
              };
            }
          }
        }

        _createFrameTemplate() {
          let template = this._template = document.createElement('div');

          template.classList.add(FRAME_CSS_CLS);
          template.setAttribute(TEMPLATE_ATT, 'yes');

          template.innerHTML = `<div class="flickrCoverflow-inner-frame">
				<img class="flickrCoverflow-image" src="${ Coverflow._placeholder }" />
				<div class="flickrCoverflow-title">No title</div>
			</div>`;
        }

        _insertGhostFrame() {
          let frame = this._template.cloneNode(true);
          frame.style.display = 'none';
          frame.removeAttribute(TEMPLATE_ATT);
          this._container.appendChild(frame);
          return frame;
        }

        _insertFrame(image) {
          let frame = this._template.cloneNode(true);

          let imageNode = frame.querySelector('img.flickrCoverflow-image');
          let { url, zoom } = this._getImageUrls(image);
          let title = frame.querySelector('.flickrCoverflow-title');

          imageNode.setAttribute(ZOOM_ATT, zoom);
          imageNode.setAttribute('alt', image.title);
          imageNode.style.backgroundImage = `url(${ Coverflow._placeholder })`;
          title.textContent = image.title;

          imageNode.addEventListener('error', function errorListener(e) {
            Logger.error(`${ Coverflow._CLASS_ID } - _insertFrame - fail to load\
        image "${ url }" due to error ${ e }`);
            imageNode.removeEventListener('error', errorListener);
            imageNode.setAttribute('src', Coverflow._placeholder);
          }, false);

          imageNode.addEventListener('load', () => {
            imageNode.style.backgroundImage = '';
          }, false);

          imageNode.setAttribute('src', url);
          frame.removeAttribute(TEMPLATE_ATT);

          this._container.appendChild(frame);
          return frame;
        }

        _getImageUrls(image) {
          let zoom;
          let size = this._size;

          switch (size) {
            case 'medium':
              {
                zoom = 'large';
                break;
              }

            case 'large':
              {
                zoom = 'large';
                break;
              }

            case 'small':
            default:
              {
                zoom = 'medium';
              }
          }

          return { url: image[size], zoom: image[zoom] };
        }

        _attachEvents() {
          Logger.debug(`${ Coverflow._CLASS_ID } - _attachEvents - this._offset:`, this._offset);

          if (Coverflow._touchEnabled) {
            this._attachTouchEvents();
          } else {
            this._attachZoomEvent();
            this._attachPreviousEvent();
            this._attachNextEvent();
          }
        }

        _attachZoomEvent() {
          this._container.addEventListener(CLICK, event => this._detectZoom(event.target), false);
        }

        _detectZoom(target) {
          let frame = target.parentElement.parentElement;

          if (frame.classList.contains(FRAME_CSS_CLS) && parseInt(frame.getAttribute(INDEX_ATT), 10) === MEDIAN) {
            Logger.debug(`${ Coverflow._CLASS_ID } - _detectZoom - "zoom" event detected, dispatching event`);

            this._on.zoom.send({
              frame,
              frameIndex: this._offset + MEDIAN,
              imageIndex: this._offset,
              target,
              url: target.getAttribute(ZOOM_ATT)
            });
          }
        }

        _attachTouchEvents() {
          Logger.log(`${ Coverflow._CLASS_ID } - _attachTouchEvents`);

          let container = this._container;

          container.addEventListener('touchstart', this._onTouchStart.bind(this), false);
          container.addEventListener('touchmove', this._onTouchMove.bind(this), false);
          container.addEventListener('touchend', this._onTouchEnd.bind(this), false);
        }

        _onTouchStart(event) {
          let firstTouch = event.targetTouches[0];
          this._startX = firstTouch.pageX;
          this._startTime = Date.now();
          this._startTarget = firstTouch.target;
          Logger.debug(`${ Coverflow._CLASS_ID } - _onTouchStart - this._startX:`, this._startX);
        }

        _onTouchMove(event) {
          let endX = event.targetTouches[0].pageX;
          let deltaX = this._deltaX = endX - this._startX;

          event.preventDefault();

          const reset = () => {
            this._startX = endX;
            this._deltaX = deltaX = 0;
          };

          Logger.debug(`${ Coverflow._CLASS_ID } - _onTouchMove - this._deltaX:`, deltaX);

          if (deltaX > TOUCH_MOVE_STEP) {
            reset();
            this._goToPreviousFrame();
          }

          if (deltaX < -TOUCH_MOVE_STEP) {
            reset();
            this._goToNextFrame();
          }
        }

        _onTouchEnd(event) {
          let deltaTime = Date.now() - this._startTime;
          let startTarget = this._startTarget;
          this._startTime = Number.NEGATIVE_INFINITY;
          this._startTarget = undefined;
          this._deltaX = 0;

          if (startTarget === event.changedTouches[0].target && deltaTime <= TAP_THRESHOLD_DURATION) {
            this._detectZoom(startTarget);
          }
        }

        _goToPreviousFrame() {
          let offset = this._offset;

          if (offset) {
            let frames = this._allFrames;
            let lastFrame = frames[offset + PAGE_SIZE - 1];
            lastFrame.classList.remove(VISIBLE_CSS_CLS);
            lastFrame.removeAttribute(INDEX_ATT);
            this._offset = --offset;
            let previous = frames[offset];
            previous.classList.add(VISIBLE_CSS_CLS);
            this._setVisibleFramesPosition();

            let currentFrame = this._median;

            this._on.previous.send({
              frame: currentFrame,
              frameIndex: offset + MEDIAN,
              imageIndex: offset,
              url: currentFrame.querySelector('.flickrCoverflow-image').getAttribute(ZOOM_ATT)
            });

            return true;
          }

          Logger.debug(`${ Coverflow._CLASS_ID } - _goToPreviousFrame - this._offset:`, offset);
        }

        _setVisibleFramesPosition() {
          this._visibleFrames.forEach((frame, position) => {
            frame.setAttribute(INDEX_ATT, position);
          });
        }

        _goToNextFrame() {
          let nextMounted = this._nextMounted;
          let frameRightOfMedian = this._frameRightOfMedian;

          if (this._nextImage || nextMounted && frameRightOfMedian && frameRightOfMedian.style.display !== 'none') {
            let offset = this._offset;
            let firstVisibleFrame = this._allFrames[offset];

            firstVisibleFrame.classList.remove(VISIBLE_CSS_CLS);
            firstVisibleFrame.removeAttribute(INDEX_ATT);

            if (nextMounted) {
              nextMounted.classList.add(VISIBLE_CSS_CLS);
              this._offset = ++offset;
              this._loadNextPageOnChange();
            } else {
              this._appendNextFrame();
            }
            this._setVisibleFramesPosition();

            let currentFrame = this._median;

            this._on.next.send({
              frame: currentFrame,
              frameIndex: offset + MEDIAN,
              imageIndex: offset,
              url: currentFrame.querySelector('.flickrCoverflow-image').getAttribute(ZOOM_ATT)
            });

            return true;
          }

          Logger.debug(`${ Coverflow._CLASS_ID } - _goToNextFrame - this._offset:`, this._offset);
        }

        _loadNextPageOnChange() {
          if (this._pageChanged && this._bufferEndReached) {
            this.loadNextPage();
          }
        }

        _appendNextFrame() {
          let nextImage = this._nextImage;

          if (nextImage) {
            this._offset++;
            this._insertFrame(nextImage);
            this._loadNextPageOnChange();
          }
        }

        _attachPreviousEvent() {
          this._attachSwitchFrameEvent(index => index < MEDIAN, this._goToPreviousFrame.bind(this));
        }

        _attachNextEvent() {
          this._attachSwitchFrameEvent(index => index > MEDIAN, this._goToNextFrame.bind(this));
        }

        _attachSwitchFrameEvent(check, changeFrame) {
          this._container.addEventListener(CLICK, event => {
            let frame = event.target.parentElement.parentElement;

            if (frame.classList.contains(FRAME_CSS_CLS)) {
              const index = parseInt(frame.getAttribute(INDEX_ATT), 10);
              if (check(index)) {
                changeFrame();
              }
            }
          }, false);
        }

        loadNextPage() {
          this._dataSource.nextPage().then(rawImages => {
            let images = this._images;
            let imagesCount = images.length;
            let firstLoad = !imagesCount;

            images.push(...rawImages.map(rawImage => {
              let image = {
                title: rawImage.title,
                small: rawImage.url_t,
                medium: rawImage.url_s,
                large: rawImage.url_m
              };

              let frame = this._insertFrame(image);

              if (imagesCount++ < PAGE_SIZE - STARTING_FRAME) {
                Logger.debug(`${ Coverflow._CLASS_ID } - loadNextPage - imagesCount: ${ imagesCount }`);
                frame.classList.add(VISIBLE_CSS_CLS);
              }

              return image;
            }));

            if (firstLoad) {
              this._setVisibleFramesPosition();
              this._on.init.send();
            }

            if (rawImages.length) {
              this._on.load.send();
            }

            if (rawImages.length < PAGE_SIZE) {
              for (let index = STARTING_FRAME; index--;) {
                this._insertGhostFrame();
              }
            }
          });
        }

        init() {
          if (!this._initialized) {
            let style;

            style = new Style({
              containerId: this._container.id,
              size: this._size,
              '3d': this._3d
            });

            style.insertSheets();

            this._createFrameTemplate();
            this._attachEvents();

            for (let index = STARTING_FRAME; index--;) {
              this._insertGhostFrame().classList.add(VISIBLE_CSS_CLS);
            }

            this.loadNextPage();

            this._initialized = true;
          } else {
            Logger.warn(`${ Coverflow._CLASS_ID } - init - already initialized`);
          }
        }

        next() {
          return this._goToNextFrame();
        }

        previous() {
          return this._goToPreviousFrame();
        }
      }

      Coverflow._CLASS_ID = '[flickr-coverflow/Coverflow]';
      Coverflow._placeholder = 'data:image/png;base64,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';

      _export('default', Coverflow);
    }
  };
});
'use strict';

System.register('flickr-data-source', ['flickr-coverflow/logger', 'flickr-coverflow/request', 'flickr-coverflow/validator'], function (_export, _context) {
  var Logger, Request, Validator;
  return {
    setters: [function (_flickrCoverflowLogger) {
      Logger = _flickrCoverflowLogger.default;
    }, function (_flickrCoverflowRequest) {
      Request = _flickrCoverflowRequest.default;
    }, function (_flickrCoverflowValidator) {
      Validator = _flickrCoverflowValidator.default;
    }],
    execute: function () {

      class FlickrDataSource {

        constructor({ apiKey, user, pageSize }) {
          this._currentPage = 1;
          this._endOfStream = false;

          let validator = new Validator(FlickrDataSource._CLASS_ID).method('constructor');

          validator.checkString({ apiKey });
          validator.checkString({ user });
          validator.checkNumber({ pageSize });

          this._apiKey = apiKey;
          this._user = user;
          this._source = `https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&format=json&nojsoncallback=1&extras=url_t,url_s,url_m&api_key=${ apiKey }&user_id=${ user }&per_page=${ pageSize * 2 }`;
        }

        nextPage() {
          if (this._endOfStream) {
            return Promise.resolve(FlickrDataSource.EMPTY_RESULTS);
          }

          return new Request(`${ this._source }&page=${ this._currentPage++ }`).send().then(response => {
            let data = JSON.parse(response.text);
            this._endOfStream = !data.photos.photo.length;

            Logger.debug('[FlickrCoverflow.FlickrDataSource] - nextPage -', {
              loaded: data.photos.photo.length,
              total: data.photos.total,
              photo: data.photos.photo
            });

            if (!this._endOfStream) {
              return data.photos.photo;
            } else {
              return FlickrDataSource.EMPTY_RESULTS;
            }
          });
        }

      }

      FlickrDataSource._CLASS_ID = '[flickr-coverflow/FlickrDataSource]';
      FlickrDataSource.EMPTY_RESULTS = Object.freeze([]);

      _export('default', FlickrDataSource);
    }
  };
});
'use strict';

System.register('logger', [], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      let Logger = {
        _level: 'info',

        _levels: ['debug', 'log', 'info', 'warn', 'error'],

        get level() {
          return this._level;
        },

        set level(newLevel) {
          let levelIndex;
          let _levels = this._levels;

          newLevel = (newLevel && newLevel.trim() || '').toLowerCase();

          if (!newLevel) {
            throw Error(`[FlickrCoverflow.Logger] - set level - level argument must be provided. actual: "${ newLevel }"`);
          }

          levelIndex = _levels.indexOf(newLevel);

          if (levelIndex < 0) {
            throw Error(`[FlickrCoverflow.Logger] - set level - "${ newLevel }" log level is not supported`);
          }

          this._level = newLevel;

          if (levelIndex > 0) {
            for (let level of _levels.slice(0, levelIndex)) {
              this[level] = this._noaction;
            }
          }

          for (let level of _levels.slice(levelIndex)) {
            this[level] = this._trace.bind(this, level);
          }

          this.info(`[FlickrCoverflow.Logger] - set level - Level has been set to "${ newLevel }"`);
        },

        _trace(level, ...params) {
          if (!(level in console)) {
            level = 'log';
          }
          console[level](...params);
        },

        _noaction() {}

      };

      for (let level of Logger._levels) {
        Logger[level] = Logger._noaction;
      }

      _export('default', Logger);
    }
  };
});
'use strict';

System.register('mock-data-source', [], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      class MockDataSource {
        constructor() {
          this._endOfStream = false;
        }

        nextPage() {
          if (this._endOfStream) {
            return Promise.resolve(MockDataSource.EMPTY_RESULTS);
          } else {
            this._endOfStream = true;
            return Promise.resolve([{
              title: 'pulsar',
              url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fnizwalls.files.wordpress.com%2F2009%2F04%2Fspace-and-planets_00022.jpg&f=1',
              url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fnizwalls.files.wordpress.com%2F2009%2F04%2Fspace-and-planets_00022.jpg&f=1',
              url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fnizwalls.files.wordpress.com%2F2009%2F04%2Fspace-and-planets_00022.jpg&f=1'
            }, {
              title: 'milky way',
              url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fmomentumbooks.com.au%2Fwp-content%2Fuploads%2F2013%2F06%2Fspace.jpg&f=1',
              url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fmomentumbooks.com.au%2Fwp-content%2Fuploads%2F2013%2F06%2Fspace.jpg&f=1',
              url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fmomentumbooks.com.au%2Fwp-content%2Fuploads%2F2013%2F06%2Fspace.jpg&f=1'
            }, {
              title: 'planet rain',
              url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.wonderfulengineering.com%2Fwp-content%2Fuploads%2F2014%2F04%2Fspace-wallpapers-3.jpg&f=1',
              url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.wonderfulengineering.com%2Fwp-content%2Fuploads%2F2014%2F04%2Fspace-wallpapers-3.jpg&f=1',
              url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.wonderfulengineering.com%2Fwp-content%2Fuploads%2F2014%2F04%2Fspace-wallpapers-3.jpg&f=1'
            }, {
              title: 'stars ocean',
              url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-TDFRxAhzDIM%2FUNTp-W-zbsI%2FAAAAAAAAKyw%2FptSswHxO5XY%2Fs1600%2Flrg_christmas_tree_cluster_fox_fur_nebula_cone_nebula_ngc2264.jpg&f=1',
              url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-TDFRxAhzDIM%2FUNTp-W-zbsI%2FAAAAAAAAKyw%2FptSswHxO5XY%2Fs1600%2Flrg_christmas_tree_cluster_fox_fur_nebula_cone_nebula_ngc2264.jpg&f=1',
              url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-TDFRxAhzDIM%2FUNTp-W-zbsI%2FAAAAAAAAKyw%2FptSswHxO5XY%2Fs1600%2Flrg_christmas_tree_cluster_fox_fur_nebula_cone_nebula_ngc2264.jpg&f=1'
            }, {
              title: 'jupiter rise',
              url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F1.bp.blogspot.com%2F_DJZSrQkWQCo%2FS8fFRvrhUeI%2FAAAAAAAAAM0%2Fy3YHWYY4EBs%2Fs1600%2FSunrise_in_Space_by_gucken.jpg&f=1',
              url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F1.bp.blogspot.com%2F_DJZSrQkWQCo%2FS8fFRvrhUeI%2FAAAAAAAAAM0%2Fy3YHWYY4EBs%2Fs1600%2FSunrise_in_Space_by_gucken.jpg&f=1',
              url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F1.bp.blogspot.com%2F_DJZSrQkWQCo%2FS8fFRvrhUeI%2FAAAAAAAAAM0%2Fy3YHWYY4EBs%2Fs1600%2FSunrise_in_Space_by_gucken.jpg&f=1'
            } /**/
            ]);
          }
        }
      }

      MockDataSource.EMPTY_RESULTS = Object.freeze([]);

      _export('default', MockDataSource);
    }
  };
});
'use strict';

System.register('request', [], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      let ReadyState = {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4,

        0: 'UNSENT',
        1: 'OPENED',
        2: 'HEADERS_RECEIVED',
        3: 'LOADING',
        4: 'DONE'
      };

      let Status = {
        SUCCESS: 200,
        NOT_MODIFIED: 302,

        BAD_REQUEST: 400,
        AUTHENTICATION_FAILED: 401,
        AUTHENTICATION_REQUIRED: 403,
        NOT_FOUND: 404,

        SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503,

        200: 'SUCCESS',
        302: 'NOT_MODIFIED',

        400: 'BAD_REQUEST',
        401: 'AUTHENTICATION_FAILED',
        403: 'AUTHENTICATION_REQUIRED',
        404: 'NOT_FOUND',

        500: 'SERVER_ERROR',
        503: 'SERVICE_UNAVAILABLE'
      };

      class Request {

        static _init() {
          let errors = Request.ERRORS;

          Object.keys(errors).forEach(name => {
            if (!errors[name]) {
              errors[name] = name;
            }
          });

          Object.keys(Status).filter(id => {
            return isNaN(parseInt(id, 10)) && Status[id] !== Status.SUCCESS && Status[id] !== Status.NOT_MODIFIED;
          }).forEach(name => errors[name] = name);

          Request.ERRORS = Object.freeze(errors);
        }

        set method(method) {
          let methods;

          if (!Request.METHODS[method]) {
            methods = Object.keys(Request.METHODS).join(', ');
            throw Error('method must be one of ' + methods);
          } else {
            this._method = method;
          }
        }

        get method() {
          return this._method;
        }

        constructor(url) {
          if (typeof url !== 'string' || !url.trim()) {
            throw 'url argument must be a non-empty string';
          }

          this._url = url;
        }

        send(data, queryParams) {
          return new Promise((resolve, reject) => {
            let httpRequest;
            let headers = this.headers;
            let parametrizedUrl = this._url;
            let hasBody = false;

            if (typeof XMLHttpRequest !== undefined) {
              httpRequest = new XMLHttpRequest();

              if (queryParams) {
                parametrizedUrl += (parametrizedUrl.indexOf('?') < 0 ? '?' : '&') + this._toQueryParams(queryParams);
              }

              if (data) {
                if (this._method !== Request.METHODS.POST && this._method !== Request.METHODS.PUT) {
                  parametrizedUrl += (parametrizedUrl.indexOf('?') < 0 ? '?' : '&') + this._toQueryParams(data);
                } else {
                  hasBody = true;
                }
              }

              httpRequest.onreadystatechange = this._onreadystatechange.bind(this, httpRequest, parametrizedUrl, resolve, reject);

              httpRequest.open(this._method || Request.DEFAULT_METHOD, parametrizedUrl);

              if (headers) {
                Object.keys(headers).forEach(function addHeader(header) {
                  httpRequest.setRequestHeader(header, headers[header]);
                });
              }

              httpRequest.send(hasBody && JSON.stringify(data));
            } else {
              reject(Error('"XMLHttpRequest" is not supported by the browser'));
            }
          });
        }

        _toQueryParams(data) {
          let queryString;

          if (typeof data === 'object') {
            queryString = [];

            Object.keys(data).forEach(property => {
              queryString.push([property, data[property]].join('='));
            });

            return encodeURI(queryString.join('&'));
          } else {
            return encodeURI(data.replace(/^\?/, ''));
          }
        }

        _onreadystatechange(httpRequest, parametrizedUrl, resolve, reject) {
          let response;
          let error;

          if (httpRequest.readyState === ReadyState.DONE) {
            switch (httpRequest.status) {
              case Status.NOT_MODIFIED:
              case Status.SUCCESS:
                {

                  response = {
                    text: httpRequest.responseText,

                    get headers() {
                      var responseHeaders = {};

                      httpRequest.getAllResponseHeaders().split(/\r?\n/).forEach(header => {
                        var colonIndex = header.indexOf(':');
                        responseHeaders[header.substring(0, colonIndex)] = header.substring(colonIndex + 1).trim();
                      });

                      // caching processed headers
                      Object.defineProperty(this, 'headers', { value });

                      return responseHeaders;
                    }
                  };

                  resolve(response);
                  break;
                }

              default:
                {
                  error = this._buildError(httpRequest.status, parametrizedUrl);
                  Logger.error(error.toString());
                  reject(error);
                }

            }
          }
        }

        _buildError(status, url) {
          var error = Error([status, ' HTTP ERROR occurred on url "', url, '"'].join(''));
          var name = Status[status];

          if (!name) {
            if (status >= Status.BAD_REQUEST && status < Status.SERVER_ERROR) {
              name = Request.ERRORS.UNKNOWN_CLIENT_ERROR;
            } else {
              if (status >= Status.SERVER_ERROR) {
                name = Request.ERRORS.UNKNOWN_SERVER_ERROR;
              } else {
                name = Request.ERRORS.UNKNOWN;
              }
            }
          }

          error.name = name;
          return error;
        }
      }

      Request.METHODS = Object.freeze({
        GET: 'GET',
        PUT: 'PUT',
        POST: 'POST',
        DELETE: 'DELETE'
      });
      Request.ERRORS = {
        UNKNOWN: '',
        UNKNOWN_CLIENT_ERROR: '',
        UNKNOWN_SERVER_ERROR: ''
      };
      Request.DEFAULT_METHOD = Request.METHODS.GET;
      Request._init();

      _export('default', Request);
    }
  };
});
'use strict';

System.register('sheet-list', [], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      class SheetList {

        get containerId() {
          return this._containerId;
        }

        get size() {
          return this._size;
        }

        get container2DSheet() {
          return `.${ SheetList.cssClass }{display:block;height:100%;min-height:${ this._sizes[this._size].minHeight }px;position:relative;width:100%;}`;
        }

        get frame2DSheet() {
          return `.flickrCoverflow-frame{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;height:100%;left:0;margin-left:33.5%;margin-right:33.5%;position:absolute;top:0;width:33%;}.flickrCoverflow-frame[data-template]{display:none;}.flickrCoverflow--visible[data-flickrCoverflow-index='0']{-webkit-transform:translateX(-101.25%);transform:translateX(-101.25%);}.flickrCoverflow--visible[data-flickrCoverflow-index='1']{-webkit-transform:translateX(-66%);transform:translateX(-66%);}.flickrCoverflow--visible[data-flickrCoverflow-index='2']{-webkit-transform:translateX(-33%);transform:translateX(-33%);}.flickrCoverflow--visible[data-flickrCoverflow-index='3']{-webkit-transform:translateX(0);transform:translateX(0);z-index:3;}.flickrCoverflow--visible[data-flickrCoverflow-index='4']{-webkit-transform:translateX(33%);transform:translateX(33%);z-index:2;}.flickrCoverflow--visible[data-flickrCoverflow-index='5']{-webkit-transform:translateX(66%);transform:translateX(66%);z-index:1;}.flickrCoverflow--visible[data-flickrCoverflow-index='6']{-webkit-transform:translateX(101.25%);transform:translateX(101.25%);}.flickrCoverflow--before{-webkit-transform:translateX(-101.25%);transform:translateX(-101.25%);}.flickrCoverflow--after{-webkit-transform:translateX(101.25%);transform:translateX(101.25%);}.flickrCoverflow-inner-frame{align-content:center;align-items:center;display:flex;flex-direction:column;height:100%;justify-content:flex-end;}.flickrCoverflow-image{flex:0 1 auto;max-height:100%;max-width:100%;vertical-align:middle;}.flickrCoverflow-title{bottom:0;font-family:Helvetica;left:0;position:absolute;text-align:center;width:100%;}.flickrCoverflow-frame:not(.flickrCoverflow--visible){opacity:0;visibility:hidden;}.flickrCoverflow--visible{display:block;opacity:1;visibility:visible;}.flickrCoverflow-image{pointer-events:auto;}`;
        }

        constructor({ containerId, size }) {
          this._sizes = {
            small: { minHeight: 102 },
            medium: { minHeight: 202 },
            large: { minHeight: 302 }
          };

          this._containerId = containerId;
          this._size = size;
        }

        getContainer3DSheet(...containerIDs) {
          return `#${ containerIDs.join(',#') }{-webkit-transform-style:preserve-3d;perspective:1000px;transform-style:preserve-3d;}`;
        }

        getFrame3DSheet(...containerIDs) {
          let placeHolder = /\$IDs ([^,\{]+)/g;
          let template = SheetList._frame3dSheetTemplate;

          return template.replace(placeHolder, this._replacer.bind(Object.create(null), containerIDs));
        }

        _replacer(ids, placeholder, selector) {
          return ids.map(id => `#${ id } ${ selector }`).join(',');
        }

      }

      SheetList.cssClass = 'flickrCoverflow';
      SheetList._frame3dSheetTemplate = "$IDs .flickrCoverflow--visible[data-flickrCoverflow-index='0']{-webkit-transform:translateX(-101.25%) rotateY(45deg);transform:translateX(-101.25%) rotateY(45deg);}$IDs .flickrCoverflow--visible[data-flickrCoverflow-index='1']{-webkit-transform:translateX(-66%) rotateY(45deg);transform:translateX(-66%) rotateY(45deg);}$IDs .flickrCoverflow--visible[data-flickrCoverflow-index='2']{-webkit-transform:translateX(-33%) rotateY(45deg);transform:translateX(-33%) rotateY(45deg);}$IDs .flickrCoverflow--visible[data-flickrCoverflow-index='3']{-webkit-transform:translateX(0) rotateY(0);transform:translateX(0) rotateY(0);}$IDs .flickrCoverflow--visible[data-flickrCoverflow-index='4']{-webkit-transform:translateX(33%) rotateY(-45deg);transform:translateX(33%) rotateY(-45deg);}$IDs .flickrCoverflow--visible[data-flickrCoverflow-index='5']{-webkit-transform:translateX(66%) rotateY(-45deg);transform:translateX(66%) rotateY(-45deg);}$IDs .flickrCoverflow--visible[data-flickrCoverflow-index='6']{-webkit-transform:translateX(101.25%) rotateY(-45deg);transform:translateX(101.25%) rotateY(-45deg);}$IDs [data-flickrCoverflow-index='0'],$IDs [data-flickrCoverflow-index='1'],$IDs [data-flickrCoverflow-index='2'],$IDs .flickrCoverflow--before{-webkit-transform-origin:left center;transform-origin:left center;}$IDs [data-flickrCoverflow-index='4'],$IDs [data-flickrCoverflow-index='5'],$IDs [data-flickrCoverflow-index='6'],$IDs .flickrCoverflow--after{-webkit-transform-origin:right center;transform-origin:right center;}$IDs .flickrCoverflow--before{-webkit-transform:translateX(-101.25%) rotateY(45deg);transform:translateX(-101.25%) rotateY(45deg);}$IDs .flickrCoverflow--after{-webkit-transform:translateX(101.25%) rotateY(-45deg);transform:translateX(101.25%) rotateY(-45deg);}";

      _export('default', SheetList);
    }
  };
});
'use strict';

System.register('signal', [], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      const Ø = Object.freeze(Object.create(null));

      class Signal {
        register(listener) {
          if (typeof listener === 'function') {
            (this._listeners != null ? this._listeners : this._listeners = []).push(listener);
          }
        }

        unregister(listener) {
          if (this._listeners) {
            let index = this._listeners.indexOf(listener);
            if (index >= 0) {
              return this._listeners.splice(index, 1);
            }
          }
        }

        clear() {
          this._listeners = undefined;
        }

        send(data) {
          if (this._listeners) {
            // making a copy of this._listeners
            // to prevent "unregister()" to mess with listeners notification
            for (let listener of this._listeners.slice()) {
              listener.call(Ø, data);
            }
          }
        }
      }

      _export('default', Signal);
    }
  };
});
'use strict';

System.register('style', ['flickr-coverflow/logger', 'flickr-coverflow/sheet-list'], function (_export, _context) {
  var Logger, SheetList;
  return {
    setters: [function (_flickrCoverflowLogger) {
      Logger = _flickrCoverflowLogger.default;
    }, function (_flickrCoverflowSheetList) {
      SheetList = _flickrCoverflowSheetList.default;
    }],
    execute: function () {

      class Style {

        get config() {
          return this._sheetList && {
            containerId: this._sheetList.containerId,
            size: this._sheetList.size,
            '3d': this._3d
          };
        }

        constructor({ containerId, size = 'small', '3d': d3 = false }) {
          if (!containerId) {
            throw Error('containerId is required');
          }

          this._sheetList = new SheetList({ containerId, size });
          this._3d = d3;
        }

        insertSheets() {
          if (!this._sheetList.containerId) {
            throw Error('containerId must be configured first');
          }

          this._addCssClass();

          const containerIdsAttribute = 'container-ids';

          let containerId = this._sheetList.containerId;
          let cssClass = SheetList.cssClass;
          let d2ContainerId = `${ cssClass }-2D`;
          let d2ContainerStyle;
          let d2Id = `${ cssClass }-sheet-2D`;
          let d2Style;
          let d3ContainerId = `${ cssClass }-3D`;
          let d3ContainerStyle;
          let d3Id = `${ cssClass }-sheet-3D`;
          let d3Style;

          if (!(d2ContainerStyle = document.getElementById(d2ContainerId))) {
            d2ContainerStyle = this._insertSheet(d2ContainerId, this._sheetList.container2DSheet);
          }

          if (!(d2Style = document.getElementById(d2Id))) {
            d2Style = this._insertSheet(d2Id, this._sheetList.frame2DSheet, d2ContainerStyle);
          }

          if (this._3d) {
            if (!(d3ContainerStyle = document.getElementById(d3ContainerId))) {
              d3ContainerStyle = this._insertSheet(d3ContainerId, this._sheetList.getContainer3DSheet(containerId), d2Style);

              d3ContainerStyle.setAttribute(containerIdsAttribute, containerId);
            } else {
              let base64Style;
              let ids = d3ContainerStyle.getAttribute(containerIdsAttribute).split(',');

              ids.push(containerId);
              base64Style = window.btoa(this._sheetList.getContainer3DSheet(...ids));
              d3ContainerStyle.href = `data:text/css;base64,${ base64Style }`;
              d3ContainerStyle.setAttribute(containerIdsAttribute, ids.join(','));
            }

            if (!(d3Style = document.getElementById(d3Id))) {
              d3Style = this._insertSheet(d3Id, this._sheetList.getFrame3DSheet(containerId), d3ContainerStyle);

              d3Style.setAttribute(containerIdsAttribute, containerId);
            } else {
              let base64Style;
              let ids = d3Style.getAttribute(containerIdsAttribute).split(',');

              ids.push(containerId);
              base64Style = window.btoa(this._sheetList.getFrame3DSheet(...ids));
              d3Style.href = `data:text/css;base64,${ base64Style }`;
              d3Style.setAttribute(containerIdsAttribute, ids.join(','));
            }
          }
        }

        _addCssClass() {
          document.getElementById(this._sheetList.containerId).classList.add(SheetList.cssClass);
        }

        _insertSheet(id, content, previous) {
          let base64Style;
          let style = document.createElement('link');

          style.id = id;
          style.rel = 'stylesheet';
          base64Style = window.btoa(content);
          style.href = `data:text/css;base64,${ base64Style }`;

          Logger.debug(`[flickr-coverflow/Style] - insertSheet - ${ id }:`, content);

          if (previous) {
            previous.insertAdjacentElement('afterend', style);
          } else {
            document.head.insertAdjacentElement('afterbegin', style);
          }

          return style;
        }

      }

      _export('default', Style);
    }
  };
});
'use strict';

System.register('validator', [], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      class Validator {
        constructor(host = '[Validator]', method = 'check') {
          this._host = host;
          this._method = method;
        }

        method(method) {
          let validator = Object.create(this);
          validator._method = method;
          return validator;
        }

        checkDefined(parameter) {
          let name = Object.keys(parameter)[0];
          let value = parameter[name];
          let host = this._host;
          let method = this._method;

          if (value === undefined || value === null) {
            throw Error(`${ host } - ${ method } - parameter ${ name } is required`);
          }
        }

        checkNumber(parameter, possibleValues) {
          let name = Object.keys(parameter)[0];
          let value = parameter[name];
          let host = this._host;
          let method = this._method;

          if (!possibleValues) {
            if (typeof value !== 'number') {
              throw Error(`${ host } - ${ method } - parameter ${ name } is required and must be a number. Actual: ${ value }`);
            }
          } else {
            if (possibleValues.indexOf(value) < 0) {
              throw Error(`${ host } - ${ method } - parameter ${ name } must be one of ${ possibleValues }. Actual: ${ value }`);
            }
          }
        }

        checkString(parameter, possibleValues) {
          let name = Object.keys(parameter)[0];
          let value = parameter[name];
          let host = this._host;
          let method = this._method;

          if (!possibleValues) {
            if (typeof value !== 'string' || !value.trim()) {
              throw Error(`${ host } - ${ method } - parameter ${ name } is required and must be a non-empty string. Actual: ${ value }`);
            }
          } else {
            if (possibleValues.indexOf(value) < 0) {
              throw Error(`${ host } - ${ method } - parameter ${ name } must be one of ${ possibleValues }. Actual: ${ value }`);
            }
          }
        }
      }

      _export('default', Validator);
    }
  };
});
