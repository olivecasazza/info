import { defineStore } from 'pinia'
import { WebGLRenderer } from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { RenderLoop } from '~/utils/renderer/renderLoop'
import type { View } from '~/utils/renderer/view'
import { RendererRootViewPort } from '~/utils/renderer/viewPort'

export const useRendererStore = defineStore('renderer', () => {
  const views = ref([] as View[])
  const stats = ref(new Stats())
  const renderLoop = ref(new RenderLoop())
  const rendererRootViewPort = ref(new RendererRootViewPort())
  const webGLRenderer = ref(new WebGLRenderer())
  // manually constructed by init
  // let _renderer: WebGLRenderer
  // const webGLRenderer = computed(() => isReady ? _renderer : null)
  const isReady = ref(false)

  function init (props: { container: HTMLElement }): void {
    webGLRenderer.value = new WebGLRenderer({ canvas: props.container })
    initStats({ container: props.container })
    rendererRootViewPort.value.mount({ container: props.container })
    isReady.value = true
  }

  function initStats (props: { container: HTMLElement }) {
    const element = props.container.appendChild(stats.value.dom)
    element.style.position = 'relative'
    element.style.overflow = 'hidden'
  }

  function resize (): void {
    // first resize the renderer root viewport
    if (!webGLRenderer || !isReady.value) { return }
    rendererRootViewPort.value.resize()
    const { width, height } = rendererRootViewPort.value
    webGLRenderer.value.setSize(width, height, true)
    // finally resize all the views
    views.value.forEach(
      (view: { camera: { aspect: any }; viewPort: { resize: () => void } }) => {
        view.camera.aspect = rendererRootViewPort.value.aspect
        view.viewPort.resize()
      }
    )
  }

  function addView<T extends View> (props: {
    view: T;
    container: HTMLElement;
  }): void {
    props.view.mount(props.container)
    views.value.push(props.view)
  }

  function removeView (props: { viewId: string }) {
    views.value.splice(
      views.value.findIndex(v => v.id === props.viewId),
      1
    )
  }

  function renderView (props: { view: View; timeStepMS: number }): void {
    if (!webGLRenderer) { return }
    const { view, timeStepMS } = props
    view.renderTickCallback(view, timeStepMS)
    const { width, height, left, bottom } = view.viewPort
    webGLRenderer.value.setViewport(left, bottom, width, height)
    webGLRenderer.value.setScissor(left, bottom, width, height)
    webGLRenderer.value.setScissorTest(true)
    // _renderer.setClearColor(view.background);
    webGLRenderer.value.render(toRaw(view.scene), view.camera)
    view.camera.updateProjectionMatrix()
    view.controls.update()
  }

  function stop (): void {
    renderLoop.value.stop = true
  }

  function start (): void {
    renderLoop.value.stop = false
    animate()
  }

  function animate (): void {
    // the animation loop calculates time elapsed since the last loop
    // and only draws if your specified fps interval is achieved
    // request another frame
    requestAnimationFrame(() => start())
    // calc elapsed time since last loop
    renderLoop.value.now = Date.now()
    renderLoop.value.elapsed =
      renderLoop.value.now - renderLoop.value.then
    // if enough time has elapsed, draw the next frame
    if (
      renderLoop.value.elapsed > renderLoop.value.fpsInterval &&
      !renderLoop.value.stop
    ) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      renderLoop.value.then =
        renderLoop.value.now -
        (renderLoop.value.elapsed % renderLoop.value.fpsInterval)

      const timeStepMS = renderLoop.value.elapsed / 1000
      // render each view
      views.value.forEach((view: any) =>
        renderView({ view, timeStepMS })
      )
      // update stats pannel
      stats.value.update()
    }
  }

  function getViewById<T extends View> (props: {
    viewId: string;
  }): T {
    for (const view of views.value) { if (view.id === props.viewId) { return view as T } }
    throw new Error('no view with matching id was found')
  }

  async function callViewMethod<T extends View> (props: {
    viewId: string;
    method: string;
    args: unknown[];
  }): Promise<void> {
    const view = await getViewById<T>(props)
    if (typeof (view as any)[props.method] === 'function') {
      (view as any)[props.method](...props.args)
    } else if (typeof (view as any)[props.method] === 'undefined') {
      throw new TypeError('unable to call method, method undefined')
    } else {
      throw new TypeError(
        'unable to call method with type of' +
        typeof (view as any)[props.method]
      )
    }
  }

  return {
    views,
    stats,
    webGLRenderer,
    renderLoop,
    rendererRootViewPort,
    isReady,
    init,
    initStats,
    resize,
    addView,
    removeView,
    renderView,
    stop,
    start,
    animate,
    getViewById,
    callViewMethod
  }
})
