let CoverflowStyle = {

	_3d: false,


	_sheet: {
		size: "small",

		sizes: {
			small: {minHeight: 102},
			medium: {minHeight: 202},
			large: {minHeight: 302}
		},

		get "2d"() {return {
			[`#${this.containerId}`]: {
				display: "block",
				position: "relative",
				"min-height": `${this.sizes[this.size].minHeight}px`,
				height: "100%",
				width: "100%"
			},

			".flickrCoverflow-frame": {
				position: "absolute",
				top: 0,
				left: 0,

				"margin-left": "33.5%",
				"margin-right": "33.5%",
				width: "33%",
				height: "100%"
			},

			".flickrCoverflow--visible:nth-child(1)": {
				"-webkit-transform": "translateX(-101.25%)",
				transform: "translateX(-101.25%)"
			},

			".flickrCoverflow--visible:nth-child(2)": {
				"-webkit-transform": "translateX(-66%)",
				transform: "translateX(-66%)"
			},

			".flickrCoverflow--visible:nth-child(3)": {
				"-webkit-transform": "translateX(-33%)",
				transform: "translateX(-33%)"
			},

			".flickrCoverflow--visible:nth-child(5)": {
				"-webkit-transform": "translateX(33%)",
				transform: "translateX(33%)",
				"z-index": -1
			},

			".flickrCoverflow--visible:nth-child(6)": {
				"-webkit-transform": "translateX(66%)",
				transform: "translateX(66%)",
				"z-index": -2
			},

			".flickrCoverflow--visible:nth-child(7)": {
				"-webkit-transform": "translateX(101.25%)",
				transform: "translateX(101.25%)",
				"z-index": -3
			},

			".flickrCoverflow-inner-frame": {
				display: "flex",
				"flex-direction": "column",
				"justify-content": "flex-end",
				"align-items": "center",
				"align-content": "center",
				height: "100%"
			},

			".flickrCoverflow-image": {
				flex: "0 1 auto",
				"max-width": "100%",
				"max-height": "100%",
				"vertical-align": "middle"
			},

			".flickrCoverflow-title": {
				position: "absolute",
				left: 0,
				bottom: 0,
				width: "100%",
				"text-align": "center",
				"font-family": "Helvetica"
			},

			".flickrCoverflow--visible": {
				display: "block"
			}
		};},

		get "3d"() {return {
			[`#${this.containerId}`]: {
				perspective: "1000px",
				"-webkit-transform-style": "preserve-3d",
				"transform-style": "preserve-3d"
			},

			".flickrCoverflow--visible:nth-child(1)": {
				"-webkit-transform": "translateX(-101.25%) rotateY(0)",
				transform: "translateX(-101.25%) rotateY(0)"
			},

			".flickrCoverflow--visible:nth-child(2)": {
				"-webkit-transform": "translateX(-66%) rotateY(45deg)",
				transform: "translateX(-66%) rotateY(45deg)"
			}
		};}
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
		let rules;
		let d3Rules;

		style.id = "flickrCoverflow-style";

		if(firstStyleElt){
			head.insertBefore(style, firstStyleElt);
		}else{
			head.appendChild(style);
		}

		sheet = style.sheet;
		rules = this._sheet["2d"];

		if(this._3d){
			d3Rules = this._sheet["3d"];

			for(let selector of Object.getOwnPropertyNames(d3Rules)){
				let d2properties = rules[selector];

				if( ! d2properties ){
					rules[selector] = d3Rules[selector];
				}else{
					let d3Properties = d3Rules[selector];

					for(let property of Object.getOwnPropertyNames(d3Properties)){
						d2properties[property] = d3Properties[property];
					}
				}
			}
		}

		this._insertRules(sheet, rules);
	},


	_insertRules(sheet, rules){
		for(let selector of Object.getOwnPropertyNames(rules)){
			let rule;
			let ruleParts = [selector, "{"];
			let properties = rules[selector];

			for(let property of Object.getOwnPropertyNames(properties)){
				ruleParts.push(property, ":", properties[property], ";");
			}

			ruleParts.push("}");
			rule = ruleParts.join("");

			try{
				Logger.debug("[FlickrCoverflow.CoverflowStyle] - _insertRules - inserting rule", rule);
				sheet.insertRule(rule, 0);
			}catch(error){
				Logger.error(
					"[FlickrCoverflow.CoverflowStyle] - _insertRules - failed to insert rule",
					rule, "due to the folowing error\n", error
				);
			}
		}
	}

}