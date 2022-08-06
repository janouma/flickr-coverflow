export default class SheetList {
  #sizes = {
    small: { minHeight: 102 },
    medium: { minHeight: 202 },
    large: { minHeight: 302 }
  }
  
  #containerId
  #size
  #prefix
  #frame3dSheetTemplate

  get containerId () {
    return this.#containerId
  }

  get size () {
    return this.#size
  }

  get container2DSheet () { return `.${this.#prefix}{display:block;height:100%;min-height:${this.#sizes[this.#size].minHeight}px;position:relative;width:100%;}`; }

  get frame2DSheet () { return `.${this.#prefix}-frame{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;height:100%;left:0;margin-left:33.5%;margin-right:33.5%;position:absolute;top:0;width:33%;}.${this.#prefix}-frame[data-template]{display:none;}.${this.#prefix}--visible[data-${this.#prefix}-index='0']{-webkit-transform:translateX(-101.25%);transform:translateX(-101.25%);}.${this.#prefix}--visible[data-${this.#prefix}-index='1']{-webkit-transform:translateX(-66%);transform:translateX(-66%);}.${this.#prefix}--visible[data-${this.#prefix}-index='2']{-webkit-transform:translateX(-33%);transform:translateX(-33%);}.${this.#prefix}--visible[data-${this.#prefix}-index='3']{-webkit-transform:translateX(0);transform:translateX(0);z-index:3;}.${this.#prefix}--visible[data-${this.#prefix}-index='4']{-webkit-transform:translateX(33%);transform:translateX(33%);z-index:2;}.${this.#prefix}--visible[data-${this.#prefix}-index='5']{-webkit-transform:translateX(66%);transform:translateX(66%);z-index:1;}.${this.#prefix}--visible[data-${this.#prefix}-index='6']{-webkit-transform:translateX(101.25%);transform:translateX(101.25%);}.${this.#prefix}--before{-webkit-transform:translateX(-101.25%);transform:translateX(-101.25%);}.${this.#prefix}--after{-webkit-transform:translateX(101.25%);transform:translateX(101.25%);}.${this.#prefix}-inner-frame{align-content:center;align-items:center;display:flex;flex-direction:column;height:100%;justify-content:flex-end;}.${this.#prefix}-image{flex:0 1 auto;max-height:100%;max-width:100%;vertical-align:middle;}.${this.#prefix}-title{bottom:0;font-family:Helvetica;left:0;position:absolute;text-align:center;width:100%;}.${this.#prefix}-frame:not(.${this.#prefix}--visible){opacity:0;visibility:hidden;}.${this.#prefix}--visible{display:block;opacity:1;visibility:visible;}.${this.#prefix}-image{pointer-events:auto;}`; }

  constructor ({ containerId, size, prefix }) {
    this.#containerId = containerId
    this.#size = size
    this.#prefix = prefix
    this.#frame3dSheetTemplate = `$IDs .${this.#prefix}--visible[data-${this.#prefix}-index='0']{-webkit-transform:translateX(-101.25%) rotateY(45deg);transform:translateX(-101.25%) rotateY(45deg);}$IDs .${this.#prefix}--visible[data-${this.#prefix}-index='1']{-webkit-transform:translateX(-66%) rotateY(45deg);transform:translateX(-66%) rotateY(45deg);}$IDs .${this.#prefix}--visible[data-${this.#prefix}-index='2']{-webkit-transform:translateX(-33%) rotateY(45deg);transform:translateX(-33%) rotateY(45deg);}$IDs .${this.#prefix}--visible[data-${this.#prefix}-index='3']{-webkit-transform:translateX(0) rotateY(0);transform:translateX(0) rotateY(0);}$IDs .${this.#prefix}--visible[data-${this.#prefix}-index='4']{-webkit-transform:translateX(33%) rotateY(-45deg);transform:translateX(33%) rotateY(-45deg);}$IDs .${this.#prefix}--visible[data-${this.#prefix}-index='5']{-webkit-transform:translateX(66%) rotateY(-45deg);transform:translateX(66%) rotateY(-45deg);}$IDs .${this.#prefix}--visible[data-${this.#prefix}-index='6']{-webkit-transform:translateX(101.25%) rotateY(-45deg);transform:translateX(101.25%) rotateY(-45deg);}$IDs [data-${this.#prefix}-index='0'],$IDs [data-${this.#prefix}-index='1'],$IDs [data-${this.#prefix}-index='2'],$IDs .${this.#prefix}--before{-webkit-transform-origin:left center;transform-origin:left center;}$IDs [data-${this.#prefix}-index='4'],$IDs [data-${this.#prefix}-index='5'],$IDs [data-${this.#prefix}-index='6'],$IDs .${this.#prefix}--after{-webkit-transform-origin:right center;transform-origin:right center;}$IDs .${this.#prefix}--before{-webkit-transform:translateX(-101.25%) rotateY(45deg);transform:translateX(-101.25%) rotateY(45deg);}$IDs .${this.#prefix}--after{-webkit-transform:translateX(101.25%) rotateY(-45deg);transform:translateX(101.25%) rotateY(-45deg);}`
  }

  getContainer3DSheet (...containerIDs) {
    return `#${containerIDs.join(',#')}{-webkit-transform-style:preserve-3d;perspective:1000px;transform-style:preserve-3d;}`
  }

  getFrame3DSheet (...containerIDs) {
    const placeHolder = /\$IDs ([^,\{]+)/g
    const template = this.#frame3dSheetTemplate

    return template.replace(
      placeHolder,
      this.#replacer.bind(Object.create(null), containerIDs)
    )
  }

  #replacer (ids, placeholder, selector) {
    return ids.map((id) => `#${id} ${selector}`).join(',')
  }

}
