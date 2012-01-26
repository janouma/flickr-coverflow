# configuration
if Logger? then log = new Logger level:LogLevel.INFO

# Classes

class FlickrCoverFlowStyle

	layouts =
		tiny:
			url:"url_t"
			height:"102px"
			width:"250px"
			imgMaxWidth:"71px"
			urlZoom: "url_s"
		small:
			url:"url_s"
			height:"202px"
			width:"480px"
			imgMaxWidth:"143px"
			urlZoom: "url_m"
		medium:
			url:"url_m"
			height:"302px"
			width:"960px"
			imgMaxWidth:"215px"
			urlZoom: "url_m"
			
	transform = (transformations) ->
		"""
		transform: #{transformations};
		-moz-transform: #{transformations}; /* Firefox */
		-webkit-transform: #{transformations}; /* Safari, Chrome */
		-o-transform: #{transformations}; /* Opera */
		-ms-transform: #{transformations}; /* ie 10 */
		"""
		
	positionsFlat = []
	
	positions3D = []
	
	style3d:-> """
				<style>
					.flickrCoverflow-image[data-position='0'] {
						#{transform "scale(.2) translateX(#{@position 0, '3D'}) translateZ(0) perspective(0) rotateY(0)"};
					}

					.flickrCoverflow-image[data-position='1'] {
						#{transform "scale(.6) translateX(0) translateZ(#{@position 1, '3D'}) perspective(700) rotateY(45deg)"};
					}

					.flickrCoverflow-image[data-position='2'] {
						#{transform "scale(.8) translateX(#{@position 2, '3D'}) translateZ(100px) perspective(500) rotateY(45deg)"};
					}

					.flickrCoverflow-image[data-position='3'] {
						#{transform "scale(1) translateX(#{@position 3, '3D'}) translateZ(200px) perspective(0) rotateY(0deg)"};
					}

					.flickrCoverflow-image[data-position='4'] {
						#{transform "scale(.8) translateX(#{@position 4, '3D'}) translateZ(100px) perspective(500) rotateY(-45deg)"};
					}

					.flickrCoverflow-image[data-position='5'] {
						#{transform "scale(.6) translateX(#{@position 5, '3D'}) translateZ(0) perspective(700) rotateY(-45deg)"};
					}

					.flickrCoverflow-image[data-position='6'] {
						#{transform "scale(.2) translateX(#{@position 6, '3D'}) translateZ(0) perspective(0) rotateY(0)"};
					}
					
					.flickrCoverflow-previous,
					.flickrCoverflow-next {
						#{transform "translateZ(199px)"}
					}
				</style>
				"""
				
	style:-> """
			<style>
				#{@containerSelector}{
					text-align: center;
					position: relative;
					height: #{@height()};
					width: #{@width()};
				}
			
				.flickrCoverflow-image {
					display: inline-block;
					min-width: 80px;
					min-height: 80px;
					margin: 0;
					vertical-align: bottom;
					text-align: center;
					position: absolute;
					left:0;
					bottom: 0;
					z-index: 0;
				}

				.flickrCoverflow-title {
					display: none;
					background-color: #000;
					color: #fff;
					font-family: Helvetica, Tahoma, Arial, Verdana;
					font-size: .7em;
					width: 80px;
					word-wrap: break-word;
					text-overflow: ellipsis;
					overflow:hidden;
					white-space: nowrap;
					bottom: 0;
				}

				.flickrCoverflow-image[data-template=yes],
				.flickrCoverflow-image[data-position='none'] {
					display: none;
					opacity: 0;
				}

				:not(.flickrCoverflow-image[data-position='none']) {
					display: inline-block;
					opacity: 1;
				}
				
				.flickrCoverflow-previous,
				.flickrCoverflow-next {
					position: absolute;
					z-index: 3;
					width: 50%;
					height: 100%;
					cursor: pointer;
				}
				
				.flickrCoverflow-previous {
					left: 0;
				}
				
				.flickrCoverflow-next {
					right: 0;
				}

				/***/

				.flickrCoverflow-image[data-position='0'] {
					z-index: 0;
					opacity: 0;
					#{transform "translateX(#{@position 0})"}
				}

				.flickrCoverflow-image[data-position='1'] {
					z-index: 1;
					#{transform "translateX(#{@position 1})"}
				}

				.flickrCoverflow-image[data-position='2'] {
					z-index: 2;
					box-shadow: 0 0 10px #000;
					#{transform "translateX(#{@position 2})"}
				}

				.flickrCoverflow-image[data-position='3'] {
					z-index: 4;
					box-shadow: 0 0 20px #000;
					#{transform "translateX(#{@position 3})"}
				}

				.flickrCoverflow-image[data-position='4'] {
					z-index: 2;
					box-shadow: 0 0 10px #000;
					#{transform "translateX(#{@position 4})"}
				}

				.flickrCoverflow-image[data-position='5'] {
					z-index: 1;
					#{transform "translateX(#{@position 5})"}
				}

				.flickrCoverflow-image[data-position='6'] {
					z-index: 0;
					opacity: 0;
					#{transform "translateX(#{@position 6})"}
				}

				/***/

				.flickrCoverflow-img {
					vertical-align: inherit;
					max-height: 100%;
				}
			</style>
			"""
			
	position: (position, depth = "Flat") ->
		throw new Error "position must be a not null Number" if position?.constructor isnt Number
		positions = if depth is "3D" then positions3D else positionsFlat
		log?.debug "positions: #{positions}"
		log?.debug "calculating position(#{position}, #{depth}) = #{positions[position]}"
		positions[position]
	
	width: -> layouts[@size].width
	height: -> layouts[@size].height
	url: -> layouts[@size].url
	urlZoom: -> layouts[@size].urlZoom
	maxWidth: -> layouts[@size].imgMaxWidth
	
	constructor: (@size, @containerSelector, @renderIn3D = false) ->
		throw new Error "#{@size} is not a valid flickr-coverflow size" if !layouts[@size]
		throw new Error "#{@containerSelector} is not a valid css selector" if !@containerSelector or !$(@containerSelector)
		log?.info "Render in 3D: #{@renderIn3D}"
		
		Number.prototype.percentOf = (width) ->
			throw new Error "width cannot be null or empty" if !width
			units = width.replace /\d*/, ""
			value = parseInt(width)
			"#{Math.round((@/100)*value)}#{units}"

		positions3D = [
			0
			0
			20.percentOf @width() #"96px"
			35.percentOf @width() #"168px"
			65.percentOf @width() #"312px"
			115.percentOf @width() #"552px"
			115.percentOf @width() #"552px"
		]
		
		positionsFlat = [
			0
			0
			20.percentOf @width() #"96px"
			35.percentOf @width() #"168px"
			50.percentOf @width() #"241px"
			70.percentOf @width() #"337px"
			70.percentOf @width() #"337px"
		]
		
		delete Number.prototype.percentOf
		
		log?.debug "positions3D: #{positions3D}"
		log?.debug "positionsFlat: #{positionsFlat}"
		
	apply: ->
		log?.debug "about to apply required style"
		head = $("head")
		head.prepend @style3d() if @renderIn3D
		head.prepend(
						  """
							<style>
								.flickrCoverflow-img {
									max-width: #{@maxWidth()};
								}
							</style>
						  """
						)
		head.prepend @style()


class FlickrCoverFlow
			
	pendingImageSrc = "data:image/png;base64,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"
	
	endOfStream = false
	
	touchMoveStep = 70 #px
	
	version = "0.5.2"
	
	isMobile =-> $.os.ios or $.os.android or $.os.webos or $.os.touchpad or $.os.iphone or $.os.ipad or ($.os.blackberry and /7\.[1-9]\d*/g.test($.os.version))
					
	images: ".flickrCoverflow-image[data-template=no]"
	previousButton: ".flickrCoverflow-previous"
	nextButton: ".flickrCoverflow-next"
	pageSize: 7
	source: "http://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&format=json&nojsoncallback=1&extras=url_t,url_s,url_m"
		
	constructor: (@apiKey, @user, @htmlNode, @options = size:"tiny") ->
		log?.info "Coverflow html node: <#{@htmlNode.prop? 'tagName'}:#{@htmlNode.selector}/>"
		throw new Error "page size must be odd, actual = #{@pageSize}" if @pageSize % 2 == 0

		@htmlNode.attr "data-version":version
		@createImageTemplate()
		@style = new FlickrCoverFlowStyle @options.size, @htmlNode.selector, @options.renderIn3D
		@style.apply()
		
		@offset = @startX = 0
		@photos = []
		@page = 1
		@median = (@pageSize - 1)/2
		@medianImage = ".flickrCoverflow-image[data-position='#{@median}']"
		@source += "&api_key=#{@apiKey}&user_id=#{@user}&per_page=#{@pageSize*2}"
		@attachEvents()
		log?.trace "#{property}: #{value}" for property, value of @ if logLevelIsTrace?()
		log?.trace "@htmlNode properties: \n#{property}: #{value}" for property, value of @htmlNode if logLevelIsTrace?()
	
	version: -> version
		
	createImageTemplate: ->
		@htmlNode.html """
						<div class="flickrCoverflow-previous"></div>
						<div class="flickrCoverflow-next"></div>
						<div class="flickrCoverflow-image" data-template="yes">
							<img class="flickrCoverflow-img" src="#{pendingImageSrc}"/>
							<div class="flickrCoverflow-title">No title</div>
						</div>
					   """
						
	load: ->
		pageSource = "#{@source}&page=#{@page}"
		log?.info "load > Page source: #{pageSource}"
		$.getJSON(
				pageSource
				(data) =>
					if !@photos.length or (!data.photos.photo.length and !endOfStream)
						endOfStream = !data.photos.photo.length
						photo =
							placeHolder: true
							title:"none"
							url_t: pendingImageSrc
							url_s: pendingImageSrc
							url_m: pendingImageSrc
							
						@photos.push photo for i in [0..2]
							
					@photos.push photo for photo in data.photos.photo
					log?.debug "#{@photos.length} loaded"
					log?.debug "#{data.photos.total} photos to handle"		
					visibleImages = @photos[@offset...@pageSize]
					@appendPhoto(photo) for photo in visibleImages
					@setImagesPosition()
					@addZoomEvent()
		)

	appendPhoto: (photo, callback=null) ->
		log?.debug "append photo"
		image = @createImageFrom photo
		
		$("img", image).error ->
			log?.error "Cannot load '#{photo.title}' (#{$(this).attr 'src'})"
			$(this).off("error").attr "src", pendingImageSrc
			$(".flickrCoverflow-title", image).show()
		
		@htmlNode.append(image)
	
	createImageFrom: (photo)->
		log?.debug "photo: #{photo.title}, #{@style.url()}: #{photo[@style.url()]}"
		image = $(".flickrCoverflow-image[data-template=yes]").clone()
		
		image.attr(
			"data-template":"no"
			"data-show":"yes"
			title: photo.title
			"data-zoom-url": photo[@style.urlZoom()]
		)
		
		innerImg = $("img", image)
		innerImg.attr "src":photo[@style.url()], "alt":photo.title
		$(".flickrCoverflow-title", image).text photo.title
		image.css "display":"none" if photo.placeHolder
		image
		
	attachEvents: ->
		log?.debug "median = #{@median}"
		log?.debug "offset in attachEvents: #{@offset}"
		
		if isMobile()
			@attachTouchEvents()
		else
			@attachNextEvent()
			@attachPreviousEvent()
		
	attachNextEvent: -> $(@nextButton, @htmlNode).on("mousedown", =>@next()).css("cursor", "pointer")

	attachPreviousEvent: -> $(@previousButton, @htmlNode).on("mousedown", =>@previous()).css("cursor", "pointer")
	
	addZoomEvent: ->
		triggeringEvent = if isMobile() then "tap" else "click"
		log?.debug "median image selector: '#{@medianImage}'"
		trigerringElement = $(@medianImage, @htmlNode).css "cursor":"pointer"
		trigerringElement.on triggeringEvent, =>
													log?.debug "about to trigger 'zoom' event"
													@htmlNode.trigger (
														$.Event(
															"zoom"
															{ zoomUrl: trigerringElement.attr "data-zoom-url" }
														)
													)
	
	hasNext: -> @photos[@offset+@pageSize]
		
	next: ->
		log?.debug "next image"
		log?.debug "offset before next: #{@offset}"
		log?.trace "nextPhotoIsLoaded: #{@nextPhotoIsLoaded()}" if logLevelIsTrace?()
		
		if @hasNext()
			@clearZoomEvent()
			$(@images).eq(@offset).attr "data-show":"no", "data-position":"none"
		
			if @nextPhotoIsLoaded()
				log?.debug "next photo is loaded"
				@showNextPhoto()
				@offset++
				@loadNewPageIfPageChanged()
			else
				log?.debug "next photo is NOT loaded"
				@appendNextPhotoIfAny()
		
			@setImagesPosition()
			@addZoomEvent()
			
		log?.debug "offset after next: #{@offset}"
				
	nextPhotoIsLoaded: ->
		methodName = "nextPhotoIsLoaded"
		log?.debug "#{methodName}: images = #{@images}"
		log?.debug "#{methodName}: offset = #{@offset}"
		log?.debug "#{methodName}: pageSize = #{@pageSize}"
		$(@images).eq(@offset+@pageSize).attr "class"
			
	clearZoomEvent: -> $(@medianImage, @htmlNode).off "tap click"
		
	showNextPhoto: ->
		log?.debug "show photo"
		$(@images).eq(@offset+@pageSize).attr "data-show":"yes"
		
	loadNewPageIfPageChanged: ->
		if !@isSamePage()
			@page++
			log?.debug "page #{@page}"
			@load() if !@nextPhotoIsLoaded()
			
	isSamePage: -> @offset%@pageSize != 0
		
	appendNextPhotoIfAny: ->
		if nextPhoto = @hasNext()
		                       log?.debug "photo '#{nextPhoto.title}' exists at index #{@offset+@pageSize}"
		                       @offset++
		                       @appendPhoto nextPhoto
		                       @loadNewPageIfPageChanged()
		
	setImagesPosition: ->
		for image, position in $(".flickrCoverflow-image[data-show='yes']")
			log?.debug "position + median: #{position}, image: #{image}"
			$(image).attr "data-position": position
	
	previous: ->
		log?.debug "previous image"
		log?.debug "offset before previous: #{@offset}"
		if @offset
			@clearZoomEvent()
			$(@images).eq(@offset+@pageSize-1).attr "data-show":"no", "data-position":"none"
			@offset--
			$(@images).eq(@offset).attr "data-show":"yes"
			@setImagesPosition()
			@addZoomEvent()
			
		log?.debug "offset after previous: #{@offset}"
		
	touchMoveHandler: ->
		endX = event.targetTouches[0].pageX
		@deltaX = endX - @startX
		log?.trace "@deltaX: #{@deltaX}"
		
		if @deltaX > touchMoveStep
			log?.debug "@deltaX before previous(): #{@deltaX}"
			@startX = endX
			@deltaX = 0
			@previous()
			log?.debug "@deltaX after previous(): #{@deltaX}"
			
		if @deltaX < -touchMoveStep
			log?.debug "@deltaX before next(): #{@deltaX}"
			@startX = endX
			@deltaX = 0
			@next()
			log?.debug "@deltaX after next(): #{@deltaX}"
		
	attachTouchEvents: ->
		log?.debug "attaching touch events"
		log?.debug "@htmlNode.id: #{@htmlNode.attr 'id'}"
		
		@htmlNode.on "touchstart", (event) =>
										@startX = event.targetTouches[0].pageX
										log?.debug "@startX: #{@startX}"
								
		@htmlNode.on "touchmove", (event) =>@touchMoveHandler()					
		@htmlNode.on "touchend", => @deltaX = 0


# The jQuery plugin

do ($) ->
	$.fn.flickrCoverflow = (apiKey, user, options = size:"tiny") ->
		log?.info "Using flickrCoverflow jQuery plugin"
		
		if this.css("display") != "none"
			coverflow = new FlickrCoverFlow(
					apiKey
					user
					this
					options
				)
			
			coverflow.load()
			
			log?.info "flickrCoverflow selector: #{coverflow.htmlNode.selector}"
		else
			log?.info "#{this.attr 'id'} is not visible, no need to create coverflow"
			
		this

