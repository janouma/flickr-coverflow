let CoverflowStyle = {

	_3d: false,


	_sheet: {
		size: "small",

		sizes: {
			small: {minHeight: 102},
			medium: {minHeight: 202},
			large: {minHeight: 302}
		},

		get "2d"() { return `#${this.containerId} {
				display:block;
				height:100%;
				min-height:${this.sizes[this.size].minHeight}px;
				position:relative;
				width:100%;
			}

			.flickrCoverflow-frame
			{
				height:100%;
				left:0;
				margin-left:33.5%;
				margin-right:33.5%;
				position:absolute;
				top:0;
				width:33%;
			}

			.flickrCoverflow-frame[data-template]
			{
				display:none;
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='0']
			{
				-webkit-transform:translateX(-101.25%);
				transform:translateX(-101.25%);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='1']
			{
				-webkit-transform:translateX(-66%);
				transform:translateX(-66%);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='2']
			{
				-webkit-transform:translateX(-33%);
				transform:translateX(-33%);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='3']
			{
				-webkit-transform:translateX(0);
				transform:translateX(0);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='4']
			{
				-webkit-transform:translateX(33%);
				transform:translateX(33%);
				z-index:-1;
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='5']
			{
				-webkit-transform:translateX(66%);
				transform:translateX(66%);
				z-index:-2;
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='6']
			{
				-webkit-transform:translateX(101.25%);
				transform:translateX(101.25%);
				z-index:-3;
			}

			.flickrCoverflow--before
			{
				-webkit-transform:translateX(-101.25%);
				transform:translateX(-101.25%);
			}

			.flickrCoverflow--after
			{
				-webkit-transform:translateX(101.25%);
				transform:translateX(101.25%);
			}

			.flickrCoverflow-inner-frame
			{
				align-content:center;
				align-items:center;
				display:flex;
				flex-direction:column;
				height:100%;
				justify-content:flex-end;
			}

			.flickrCoverflow-image
			{
				flex:0 1 auto;
				max-height:100%;
				max-width:100%;
				vertical-align:middle;
			}

			.flickrCoverflow-title
			{
				bottom:0;
				font-family:Helvetica;
				left:0;
				position:absolute;
				text-align:center;
				width:100%;
			}

			.flickrCoverflow-frame:not(.flickrCoverflow--visible)
			{
				opacity:0;
				visibility:hidden;
				z-index:-4;
			}

			.flickrCoverflow--visible
			{
				display:block;
				opacity:1;
				visibility:visible;
			}`;},

		get "3d"() {return `#${this.containerId}
			{
				-webkit-transform-style:preserve-3d;
				perspective:1000px;
				transform-style:preserve-3d;
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='0']
			{
				-webkit-transform:translateX(-101.25%) rotateY(45deg);
				transform:translateX(-101.25%) rotateY(45deg);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='1']
			{
				-webkit-transform:translateX(-66%) rotateY(45deg);
				transform:translateX(-66%) rotateY(45deg);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='2']
			{
				-webkit-transform:translateX(-33%) rotateY(45deg);
				transform:translateX(-33%) rotateY(45deg);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='3']
			{
				-webkit-transform:translateX(0) rotateY(0);
				transform:translateX(0) rotateY(0);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='4']
			{
				-webkit-transform:translateX(33%) rotateY(-45deg);
				transform:translateX(33%) rotateY(-45deg);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='5']
			{
				-webkit-transform:translateX(66%) rotateY(-45deg);
				transform:translateX(66%) rotateY(-45deg);
			}

			.flickrCoverflow--visible[data-flickrCoverflow-index='6']
			{
				-webkit-transform:translateX(101.25%) rotateY(-45deg);
				transform:translateX(101.25%) rotateY(-45deg);
			}

			[data-flickrCoverflow-index='0'],
			[data-flickrCoverflow-index='1'],
			[data-flickrCoverflow-index='2'],
			.flickrCoverflow--before
			{
				-webkit-transform-origin:left center;
				transform-origin:left center;
			}

			[data-flickrCoverflow-index='4'],
			[data-flickrCoverflow-index='5'],
			[data-flickrCoverflow-index='6'],
			.flickrCoverflow--after
			{
				-webkit-transform-origin:right center;
				transform-origin:right center;
			}

			.flickrCoverflow--before
			{
				-webkit-transform:translateX(-101.25%) rotateY(45deg);
				transform:translateX(-101.25%) rotateY(45deg);
			}

			.flickrCoverflow--after
			{
				-webkit-transform:translateX(101.25%) rotateY(-45deg);
				transform:translateX(101.25%) rotateY(-45deg);
			}`;}
	},


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


	insertSheet(){
		if( ! this._sheet.containerId ){
			throw "containerId must be configured first";
		}

		let head = document.head;
		let d2Style = document.createElement("link");
		let base64Style;
		let ruleFormater = /\n|\r/g;

		d2Style.id = "flickrCoverflow-style-2D";
		d2Style.rel = "stylesheet";
		base64Style = btoa(this._sheet["2d"].replace(ruleFormater, ""));
		d2Style.href = `data:text/css;base64,${base64Style}`;

		head.insertAdjacentElement("afterbegin", d2Style);

		if(this._3d){
			// Resetting RegExp
			ruleFormater.lastIndex = 0;

			let d3Style = document.createElement("link");

			d3Style.id = "flickrCoverflow-style-3D";
			d3Style.rel = "stylesheet";
			base64Style = btoa(this._sheet["3d"].replace(ruleFormater, ""));
			d3Style.href = `data:text/css;base64,${base64Style}`;

			d2Style.insertAdjacentElement("afterend", d3Style);
		}
	}

}