let CoverflowStyle = {

	_3d: false,


	_rules: {
		size: "small",

		sizes: {
			small: {minHeight: 102},
			medium: {minHeight: 202},
			large: {minHeight: 302}
		},

		get "2d"(){
			return `display: block
			position: relative
			min-height: ${this.sizes[this.size].minHeight}px
			height: 100%
			width: 100%`;
		},

		"3d": `perspective: 1000px
		webkitTransformStyle: preserve-3d
		transformStyle: preserve-3d`
	},

	_sheet: {
		"2d": [
			`.flickrCoverflow-frame{
				margin-left: 33.5%;
				margin-right: 33.5%;
				width: 33%;
				height: 100%;
			}`,
			`.flickrCoverflow-inner-frame{
				display: block;
				height: 100%;
			}`,
			`.flickrCoverflow-frame:not(.flickrCoverflow--active){
				position: absolute;
				top: 0;
				left: 0;
			}`,
			`.flickrCoverflow--active{
				position: relative;
			}`,
			`.flickrCoverflow--visible:nth-child(1){
				-webkit-transform: translateX(-101.25%);
				transform: translateX(-101.25%);
			}`,
			`.flickrCoverflow--visible:nth-child(2){
				-webkit-transform: translateX(-66%);
				transform: translateX(-66%);
			}`,
			`.flickrCoverflow--visible:nth-child(3){
				-webkit-transform: translateX(-33%);
				transform: translateX(-33%);
			}`,
			`.flickrCoverflow--visible:nth-child(5){
				-webkit-transform: translateX(33%);
				transform: translateX(33%);
				z-index: -1;
			}`,
			`.flickrCoverflow--visible:nth-child(6){
				-webkit-transform: translateX(66%);
				transform: translateX(66%);
				z-index: -2;
			}`,
			`.flickrCoverflow--visible:nth-child(7){
				-webkit-transform: translateX(101.25%);
				transform: translateX(101.25%);
				z-index: -3;
			}`,
			`.flickrCoverflow-image{
				max-width: 100%;
				max-height: 100%;
				vertical-align: middle;
			}`,
			`.flickrCoverflow-inner-frame{
				text-align: center;
			}`,
			`.flickrCoverflow-title{
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				font-family: Helvetica;
			}`,
			`.flickrCoverflow--visible{
				display: block;
			}`
		],

		"3d": []
	},


	get config(){
		return {
			size: this._rules.size,
			"3d": this._3d
		};
	},


	set config({size = "small", "3d": d3 = false}){
		this._rules.size = size;
		this._3d = d3;
	},


	insertSheet(){
		let head = document.head;
		let firstStyleElt = head.querySelector("style");
		let style = document.createElement("style");
		let sheet;

		style.id = "flickrCoverflow-style";

		if(firstStyleElt){
			head.insertBefore(style, firstStyleElt);
		}else{
			head.appendChild(style);
		}

		sheet = style.sheet;

		this._insertRules(sheet, "2d");

		if(this._3d){
			this._insertRules(sheet, "3d");
		}
	},


	applyTo(container){
		let rules = this._rules;
		let style = container.style;

		for(let rule of rules["2d"].split("\n")){
			this._applyRule(style, rule);
		}

		if(this._3d){
			for(let rule of rules["3d"].split("\n")){
				this._applyRule(style, rule);
			}
		}
	},


	_applyRule(style, rule){
		let [property, value] = rule.split(":");

		property = property.trim();
		value = value.trim();

		Logger.debug("[FlickrCoverflow.CoverflowStyle] - _applyRule - ", {property, value});

		style[property] = value;
	},


	_insertRules(sheet, dimension){
		let ruleFormater = /[\s\n\r]/g;

		for(let rule of this._sheet[dimension]){
			// Resetting RegExp
			ruleFormater.lastIndex = 0;

			try{
				Logger.debug("[FlickrCoverflow.CoverflowStyle] - _insertRules - inserting rule", rule);
				sheet.insertRule( rule.replace(ruleFormater, ""), 0 );
			}catch(error){
				Logger.error(
					"[FlickrCoverflow.CoverflowStyle] - _insertRules - failed to insert rule",
					rule, "due to the folowing error\n", error
				);
			}
		}
	}

}