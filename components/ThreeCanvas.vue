<script lang="ts">
import { WebGLRenderer } from 'three'

const webGLRenderer = ref(new WebGLRenderer())
const isReady = ref(false)

function init (props: { container: HTMLElement }): void {
  webGLRenderer.value = new WebGLRenderer({ canvas: props.container })
  isReady.value = true
}

function resize (): void {
  // first resize the renderer root viewport
  if (!webGLRenderer || !isReady.value) { return }
  rendererRootViewPort.value.resize()
  const { width, height } = rendererRootViewPort.value
  webGLRenderer.value.setSize(width, height, true)
  // finally resize all the views

  camera.aspect = rendererRootViewPort.value.aspect
  viewPort.resize()
}

function renderView (props: { view: View; timeStepMS: number }): void {
  if (!webGLRenderer) { return }
  const { view, timeStepMS } = props
  renderTickCallback(view, timeStepMS)
  const { width, height, left, bottom } = viewPort
  webGLRenderer.value.setViewport(left, bottom, width, height)
  webGLRenderer.value.setScissor(left, bottom, width, height)
  webGLRenderer.value.setScissorTest(true)
  // _renderer.setClearColor(background);
  webGLRenderer.value.render(toRaw(scene), camera)
  camera.updateProjectionMatrix()
  controls.update()
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
  for (const view of views.value) { if (id === props.viewId) { return view as T } }
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
</script>
