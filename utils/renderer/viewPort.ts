// by default three.js takes vertical FOV as camera param
// I'd rather use horizontal FOV as the instantiation interface

import { storeToRefs } from 'pinia'
import { useRendererStore } from '~/stores/renderer'

// so we have this helper function
function getVerticalFOV (aspect: number, horizontalFov: number): number {
  return (
    (Math.atan(Math.tan(((horizontalFov / 2) * Math.PI) / 180) / aspect) *
      2 *
      180) /
    Math.PI
  )
}

export abstract class AbstractViewPort {
  container!: HTMLElement | HTMLCanvasElement
  height = 0
  width = 0
  left = 0
  bottom = 0

  horizontalFov = 90
  isMounted = false

  get aspect (): number {
    return this.width / this.height
  }

  get verticalFov (): number {
    return getVerticalFOV(this.aspect, this.horizontalFov)
  }

  mount (props: { container: HTMLElement }): void {
    this.container = props.container
    this.resize()
    this.isMounted = true
  }

  abstract resize(): void

  abstract destroy(): void
}

export class ViewPort extends AbstractViewPort {
  getOffset (ele: HTMLElement | HTMLCanvasElement) {
    // Get the top, left coordinates of two elements
    const eleRect = ele.getBoundingClientRect()
    const { webGLRenderer } = storeToRefs(useRendererStore())
    if (!webGLRenderer.value?.domElement) { throw new Error('could not get renderer root dom element') }
    const targetRect = webGLRenderer.value.domElement
    const bottom =
      targetRect.offsetTop + targetRect.height - (eleRect.y + eleRect.height)
    const left = eleRect.left - targetRect.offsetLeft
    return {
      left,
      bottom
    }
  }

  resize (): void {
    const { left, bottom } = this.getOffset(this.container)
    const { width, height } = this.container.getBoundingClientRect()
    this.height = height
    this.width = width
    this.left = left
    this.bottom = bottom
  }

  destroy (): void {
    throw new Error('not implemented')
  }
}

export class RendererRootViewPort extends AbstractViewPort {
  resize (): void {
    this.height = this.container.clientHeight
    this.width = this.container.clientWidth
    this.left = 0
    this.bottom = 0
  }

  destroy (): void {
    throw new Error('not implemented')
  }
}
