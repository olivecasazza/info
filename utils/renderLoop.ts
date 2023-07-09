export class RenderLoop {
  private static _now = () => Date.now()
  stop = true
  frameCount = 0
  fps = 120
  fpsInterval = 1000 / this.fps
  startTime: number = RenderLoop._now()
  now: number = RenderLoop._now()
  then: number = RenderLoop._now()
  elapsed = 0
}
