window.onload = function() {
  let canvas = document.getElementById('viewport')
  canvas.width = window.innerWidth // some cleaner way to avoid scrollbars?
  canvas.height = window.innerHeight - 4
  // todo add window resize event handler to resize canvas as well

  let view = new Viewport(canvas)

  window.onresize = function() {
    canvas.width = window.innerWidth // some cleaner way to avoid scrollbars?
    canvas.height = window.innerHeight - 4
    view.redraw()
  }
}