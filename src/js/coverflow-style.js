let CoverflowStyle = {

	_3d: false,


	_sheet: {
		size: "small",

		sizes: {
			small: {minHeight: 102},
			medium: {minHeight: 202},
			large: {minHeight: 302}
		},

		cssClass: "flickrCoverflow",

		get "2dContainer"() {
			return `.${this.cssClass}{display:block;height:100%;min-height:${this.sizes[this.size].minHeight}px;position:relative;width:100%;}`;
		},

		get "2d"() {return `#${this.containerId} .flickrCoverflow-frame{height:100%;left:0;margin-left:33.5%;margin-right:33.5%;position:absolute;top:0;width:33%;}#${this.containerId} .flickrCoverflow-frame[data-template]{display:none;}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='0']{-webkit-transform:translateX(-101.25%);transform:translateX(-101.25%);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='1']{-webkit-transform:translateX(-66%);transform:translateX(-66%);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='2']{-webkit-transform:translateX(-33%);transform:translateX(-33%);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='3']{-webkit-transform:translateX(0);transform:translateX(0);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='4']{-webkit-transform:translateX(33%);transform:translateX(33%);z-index:-1;}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='5']{-webkit-transform:translateX(66%);transform:translateX(66%);z-index:-2;}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='6']{-webkit-transform:translateX(101.25%);transform:translateX(101.25%);z-index:-3;}#${this.containerId} .flickrCoverflow--before{-webkit-transform:translateX(-101.25%);transform:translateX(-101.25%);}#${this.containerId} .flickrCoverflow--after{-webkit-transform:translateX(101.25%);transform:translateX(101.25%);}#${this.containerId} .flickrCoverflow-inner-frame{align-content:center;align-items:center;display:flex;flex-direction:column;height:100%;justify-content:flex-end;}#${this.containerId} .flickrCoverflow-image{flex:0 1 auto;max-height:100%;max-width:100%;vertical-align:middle;}#${this.containerId} .flickrCoverflow-title{bottom:0;font-family:Helvetica;left:0;position:absolute;text-align:center;width:100%;}#${this.containerId} .flickrCoverflow-frame:not(#${this.containerId} .flickrCoverflow--visible){opacity:0;visibility:hidden;z-index:-4;}#${this.containerId} .flickrCoverflow--visible{display:block;opacity:1;visibility:visible;}`;},

		get "3dContainer"(){
			return `.${this.cssClass}{-webkit-transform-style:preserve-3d;perspective:1000px;transform-style:preserve-3d;}`;
		},

		get "3d"() {return `#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='0']{-webkit-transform:translateX(-101.25%) rotateY(45deg);transform:translateX(-101.25%) rotateY(45deg);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='1']{-webkit-transform:translateX(-66%) rotateY(45deg);transform:translateX(-66%) rotateY(45deg);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='2']{-webkit-transform:translateX(-33%) rotateY(45deg);transform:translateX(-33%) rotateY(45deg);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='3']{-webkit-transform:translateX(0) rotateY(0);transform:translateX(0) rotateY(0);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='4']{-webkit-transform:translateX(33%) rotateY(-45deg);transform:translateX(33%) rotateY(-45deg);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='5']{-webkit-transform:translateX(66%) rotateY(-45deg);transform:translateX(66%) rotateY(-45deg);}#${this.containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='6']{-webkit-transform:translateX(101.25%) rotateY(-45deg);transform:translateX(101.25%) rotateY(-45deg);}[data-flickrCoverflow-index='0'],[data-flickrCoverflow-index='1'],[data-flickrCoverflow-index='2'],#${this.containerId} .flickrCoverflow--before{-webkit-transform-origin:left center;transform-origin:left center;}[data-flickrCoverflow-index='4'],[data-flickrCoverflow-index='5'],[data-flickrCoverflow-index='6'],#${this.containerId} .flickrCoverflow--after{-webkit-transform-origin:right center;transform-origin:right center;}#${this.containerId} .flickrCoverflow--before{-webkit-transform:translateX(-101.25%) rotateY(45deg);transform:translateX(-101.25%) rotateY(45deg);}#${this.containerId} .flickrCoverflow--after{-webkit-transform:translateX(101.25%) rotateY(-45deg);transform:translateX(101.25%) rotateY(-45deg);}`;}
	},

	_sheetFormater: /\n|\r|\t/g,


	get config(){
		return {
			containerId: this._sheet.containerId,
			size: this._sheet.size,
			"3d": this._3d
		};
	},


	set config({containerId, size = "small", "3d": d3 = false}){
		if( ! containerId ){
			throw "containerId is required";
		}

		this._sheet.containerId = containerId;
		this._sheet.size = size;
		this._3d = d3;
	},


	insertSheets(){
		if( ! this._sheet.containerId ){
			throw "containerId must be configured first";
		}

		this._addCssClass();

		let containerId = this._sheet.containerId;
		let cssClass = this._sheet.cssClass;
		let d2ContainerId = `${cssClass}-2D`;
		let d2ContainerStyle;
		let d2Id = `${containerId}-sheet-2D`;
		let d3ContainerId = `${cssClass}-3D`;
		let d3ContainerStyle;
		let d3Id = `${containerId}-sheet-3D`;

		if(!(d2ContainerStyle = document.getElementById(d2ContainerId))){
			d2ContainerStyle = this._insertSheet(d2ContainerId, this._sheet["2dContainer"]);
		}

		let d2Style = this._insertSheet(d2Id, this._sheet["2d"], d2ContainerStyle);

		if(this._3d){
			if(!(d3ContainerStyle = document.getElementById(d3ContainerId))){
				d3ContainerStyle = this._insertSheet(d3ContainerId, this._sheet["3dContainer"], d2Style);
			}

			this._insertSheet(d3Id, this._sheet["3d"], d3ContainerStyle);
		}
	},


	_addCssClass(){
		document.getElementById(this._sheet.containerId).classList.add(this._sheet.cssClass);
	},


	_insertSheet(id, content, previous){
		let base64Style;
		let formattedStyle;
		let formater = this._sheetFormater;
		let style = document.createElement("link");

		// Resetting RegExp
		formater.lastIndex = 0;

		style.id = id;
		style.rel = "stylesheet";
		formattedStyle = content.replace(formater, "");
		base64Style = btoa(formattedStyle);
		style.href = `data:text/css;base64,${base64Style}`;

		Logger.debug(`[FlickrCoverflow] - insertSheet - ${id}:`, formattedStyle);

		if(previous){
			previous.insertAdjacentElement("afterend", style);
		}else{
			document.head.insertAdjacentElement("afterbegin", style);
		}

		return style;
	}

}