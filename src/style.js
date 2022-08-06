import Logger from './logger'
import SheetList from './sheet-list'

export default class Style {
  #sheetList
  #threeD
  #prefix
  
  get config () {
    return this.#sheetList && {
      containerId: this.#sheetList.containerId,
      size: this.#sheetList.size,
      '3d': this.#threeD
    }
  }

  constructor ({
    containerId,
    size = 'small',
    '3d': d3 = false,
    prefix
  }) {
    if (!containerId) {
      throw Error('containerId is required')
    }

    this.#sheetList = new SheetList({
      containerId,
      size,
      prefix
    })
    
    this.#threeD = d3
    this.#prefix = prefix
  }

  insertSheets () {
    if (!this.#sheetList.containerId) {
      throw Error('containerId must be configured first')
    }

    this.#addCssClass()

    const containerIdsAttribute = 'container-ids'

    let containerId = this.#sheetList.containerId
    let cssClass = this.#prefix
    let d2ContainerId = `${cssClass}-2D`
    let d2ContainerStyle
    let d2Id = `${cssClass}-sheet-2D`
    let d2Style
    let d3ContainerId = `${cssClass}-3D`
    let d3ContainerStyle
    let d3Id = `${cssClass}-sheet-3D`
    let d3Style

    if (!(d2ContainerStyle = document.getElementById(d2ContainerId))) {
      d2ContainerStyle = this.#insertSheet(d2ContainerId, this.#sheetList.container2DSheet)
    }

    if (!(d2Style = document.getElementById(d2Id))) {
      d2Style = this.#insertSheet(d2Id, this.#sheetList.frame2DSheet, d2ContainerStyle)
    }

    if (this.#threeD) {
      if (!(d3ContainerStyle = document.getElementById(d3ContainerId))) {
        d3ContainerStyle = this.#insertSheet(
          d3ContainerId,
          this.#sheetList.getContainer3DSheet(containerId),
          d2Style
        )

        d3ContainerStyle.setAttribute(containerIdsAttribute, containerId)
      } else {
        let base64Style
        let ids = d3ContainerStyle.getAttribute(containerIdsAttribute).split(',')

        ids.push(containerId)
        base64Style = window.btoa(this.#sheetList.getContainer3DSheet(...ids))
        d3ContainerStyle.href = `data:text/css;base64,${base64Style}`
        d3ContainerStyle.setAttribute(containerIdsAttribute, ids.join(','))
      }

      if (!(d3Style = document.getElementById(d3Id))) {
        d3Style = this.#insertSheet(
          d3Id,
          this.#sheetList.getFrame3DSheet(containerId),
          d3ContainerStyle
        )

        d3Style.setAttribute(containerIdsAttribute, containerId)
      } else {
        let base64Style
        let ids = d3Style.getAttribute(containerIdsAttribute).split(',')

        ids.push(containerId)
        base64Style = window.btoa(this.#sheetList.getFrame3DSheet(...ids))
        d3Style.href = `data:text/css;base64,${base64Style}`
        d3Style.setAttribute(containerIdsAttribute, ids.join(','))
      }
    }
  }

  #addCssClass () {
    document.getElementById(this.#sheetList.containerId).classList.add(this.#prefix)
  }

  #insertSheet (id, content, previous) {
    let base64Style
    let style = document.createElement('link')

    style.id = id
    style.rel = 'stylesheet'
    base64Style = window.btoa(content)
    style.href = `data:text/css;base64,${base64Style}`

    Logger.debug(`[flickr-coverflow/Style] - insertSheet - ${id}:`, content)

    if (previous) {
      previous.insertAdjacentElement('afterend', style)
    } else {
      document.head.insertAdjacentElement('afterbegin', style)
    }

    return style
  }
}
