class CoverflowSheetList {

	get containerId(){
		return this._containerId;
	}


	get size(){
		return this._size;
	}


	get container2DSheet(){return `.${CoverflowSheetList.cssClass}{display:block;height:100%;min-height:${this._sizes[this._size].minHeight}px;position:relative;width:100%;}`;}


	get frame2DSheet(){return `.flickrCoverflow-frame{height:100%;left:0;margin-left:33.5%;margin-right:33.5%;position:absolute;top:0;width:33%;}.flickrCoverflow-frame[data-template]{display:none;}.flickrCoverflow--visible[data-flickrCoverflow-index='0']{-webkit-transform:translateX(-101.25%);transform:translateX(-101.25%);}.flickrCoverflow--visible[data-flickrCoverflow-index='1']{-webkit-transform:translateX(-66%);transform:translateX(-66%);}.flickrCoverflow--visible[data-flickrCoverflow-index='2']{-webkit-transform:translateX(-33%);transform:translateX(-33%);}.flickrCoverflow--visible[data-flickrCoverflow-index='3']{-webkit-transform:translateX(0);transform:translateX(0);}.flickrCoverflow--visible[data-flickrCoverflow-index='4']{-webkit-transform:translateX(33%);transform:translateX(33%);z-index:-1;}.flickrCoverflow--visible[data-flickrCoverflow-index='5']{-webkit-transform:translateX(66%);transform:translateX(66%);z-index:-2;}.flickrCoverflow--visible[data-flickrCoverflow-index='6']{-webkit-transform:translateX(101.25%);transform:translateX(101.25%);z-index:-3;}.flickrCoverflow--before{-webkit-transform:translateX(-101.25%);transform:translateX(-101.25%);}.flickrCoverflow--after{-webkit-transform:translateX(101.25%);transform:translateX(101.25%);}.flickrCoverflow-inner-frame{align-content:center;align-items:center;display:flex;flex-direction:column;height:100%;justify-content:flex-end;}.flickrCoverflow-image{flex:0 1 auto;max-height:100%;max-width:100%;vertical-align:middle;}.flickrCoverflow-title{bottom:0;font-family:Helvetica;left:0;position:absolute;text-align:center;width:100%;}.flickrCoverflow-frame:not(.flickrCoverflow--visible){opacity:0;visibility:hidden;z-index:-4;}.flickrCoverflow--visible{display:block;opacity:1;visibility:visible;}`;}


	get container3DSheet(){return `#${this._containerId}{-webkit-transform-style:preserve-3d;perspective:1000px;transform-style:preserve-3d;}`;}


	get frame3DSheet(){return `#${this._containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='0']{-webkit-transform:translateX(-101.25%) rotateY(45deg);transform:translateX(-101.25%) rotateY(45deg);}#${this._containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='1']{-webkit-transform:translateX(-66%) rotateY(45deg);transform:translateX(-66%) rotateY(45deg);}#${this._containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='2']{-webkit-transform:translateX(-33%) rotateY(45deg);transform:translateX(-33%) rotateY(45deg);}#${this._containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='3']{-webkit-transform:translateX(0) rotateY(0);transform:translateX(0) rotateY(0);}#${this._containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='4']{-webkit-transform:translateX(33%) rotateY(-45deg);transform:translateX(33%) rotateY(-45deg);}#${this._containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='5']{-webkit-transform:translateX(66%) rotateY(-45deg);transform:translateX(66%) rotateY(-45deg);}#${this._containerId} .flickrCoverflow--visible[data-flickrCoverflow-index='6']{-webkit-transform:translateX(101.25%) rotateY(-45deg);transform:translateX(101.25%) rotateY(-45deg);}[data-flickrCoverflow-index='0'],[data-flickrCoverflow-index='1'],[data-flickrCoverflow-index='2'],#${this._containerId} .flickrCoverflow--before{-webkit-transform-origin:left center;transform-origin:left center;}[data-flickrCoverflow-index='4'],[data-flickrCoverflow-index='5'],[data-flickrCoverflow-index='6'],#${this._containerId} .flickrCoverflow--after{-webkit-transform-origin:right center;transform-origin:right center;}#${this._containerId} .flickrCoverflow--before{-webkit-transform:translateX(-101.25%) rotateY(45deg);transform:translateX(-101.25%) rotateY(45deg);}#${this._containerId} .flickrCoverflow--after{-webkit-transform:translateX(101.25%) rotateY(-45deg);transform:translateX(101.25%) rotateY(-45deg);}`;}


	constructor({containerId, size}){
		this._containerId = containerId;
		this._size = size;

		this._sizes = {
			small: {minHeight: 102},
			medium: {minHeight: 202},
			large: {minHeight: 302}
		};
	}

}


CoverflowSheetList.cssClass = "flickrCoverflow";