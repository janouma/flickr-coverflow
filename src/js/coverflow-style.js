class CoverflowStyle {

	get config(){
		return this._sheetList && {
			containerId: this._sheetList.containerId,
			size: this._sheetList.size,
			"3d": this._3d
		};
	}


	constructor({containerId, size = "small", "3d": d3 = false}){
		if( ! containerId ){
			throw "containerId is required";
		}

		this._sheetList = new CoverflowSheetList({containerId, size});
		this._3d = d3;
	}


	insertSheets(){
		if( ! this._sheetList.containerId ){
			throw "containerId must be configured first";
		}

		this._addCssClass();

		const containerIdsAttribute = "container-ids";

		let containerId = this._sheetList.containerId;
		let cssClass = CoverflowSheetList.cssClass;
		let d2ContainerId = `${cssClass}-2D`;
		let d2ContainerStyle;
		let d2Id = `${cssClass}-sheet-2D`;
		let d2Style;
		let d3ContainerId = `${cssClass}-3D`;
		let d3ContainerStyle;
		let d3Id = `${cssClass}-sheet-3D`;
		let d3Style;

		if(!(d2ContainerStyle = document.getElementById(d2ContainerId))){
			d2ContainerStyle = this._insertSheet(d2ContainerId, this._sheetList.container2DSheet);
		}

		if(!(d2Style = document.getElementById(d2Id))){
			d2Style = this._insertSheet(d2Id, this._sheetList.frame2DSheet, d2ContainerStyle);
		}

		if(this._3d){
			if(!(d3ContainerStyle = document.getElementById(d3ContainerId))){
				d3ContainerStyle = this._insertSheet(
					d3ContainerId,
					this._sheetList.getContainer3DSheet(containerId),
					d2Style
				);

				d3ContainerStyle.setAttribute(containerIdsAttribute, containerId);
			}else{
				let base64Style;
				let ids = d3ContainerStyle.getAttribute(containerIdsAttribute).split(",");

				ids.push(containerId);
				base64Style = btoa(this._sheetList.getContainer3DSheet(...ids));
				d3ContainerStyle.href = `data:text/css;base64,${base64Style}`;
				d3ContainerStyle.setAttribute(containerIdsAttribute, ids.join(","));
			}

			if(!(d3Style = document.getElementById(d3Id))){
				d3Style = this._insertSheet(
					d3Id,
					this._sheetList.getFrame3DSheet(containerId),
					d3ContainerStyle
				);

				d3Style.setAttribute(containerIdsAttribute, containerId);
			}else{
				let base64Style;
				let ids = d3Style.getAttribute(containerIdsAttribute).split(",");

				ids.push(containerId);
				base64Style = btoa(this._sheetList.getFrame3DSheet(...ids));
				d3Style.href = `data:text/css;base64,${base64Style}`;
				d3Style.setAttribute(containerIdsAttribute, ids.join(","));
			}
		}
	}


	_addCssClass(){
		document.getElementById(this._sheetList.containerId).classList.add(CoverflowSheetList.cssClass);
	}


	_insertSheet(id, content, previous){
		let base64Style;
		let style = document.createElement("link");

		style.id = id;
		style.rel = "stylesheet";
		base64Style = btoa(content);
		style.href = `data:text/css;base64,${base64Style}`;

		Logger.debug(`[FlickrCoverflow.CoverflowStyle] - insertSheet - ${id}:`, content);

		if(previous){
			previous.insertAdjacentElement("afterend", style);
		}else{
			document.head.insertAdjacentElement("afterbegin", style);
		}

		return style;
	}

}