let CoverflowStyle = {

	_3d: false,


	_sheet: {
		size: "small",

		sizes: {
			small: {minHeight: 102},
			medium: {minHeight: 202},
			large: {minHeight: 302}
		},

		get "2d"() {return [
			`#${this.containerId}{
				display: block;
				position: relative;
				min-height: ${this.sizes[this.size].minHeight}px;
				height: 100%;
				width: 100%;
			}`,
			`.flickrCoverflow-frame{
				position: absolute;
				top: 0;
				left: 0;

				margin-left: 33.5%;
				margin-right: 33.5%;
				width: 33%;
				height: 100%;
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
			`.flickrCoverflow-inner-frame{
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: center;
				align-content: center;
				height: 100%;
			}`,
			`.flickrCoverflow-image{
				flex: 0 1 auto;
				max-width: 100%;
				max-height: 100%;
				vertical-align: middle;
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
		];},

		get "3d"() {return [
			`#${this.containerId}{
				perspective: 1000px;
				webkitTransformStyle: preserve-3d;
				transformStyle: preserve-3d;
			}`
		];}
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