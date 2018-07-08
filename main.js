let units = []

window.onload = function() {
  let arch = new Architect()

  let canvas = document.getElementById('viewport')
  canvas.width = window.innerWidth // some cleaner way to avoid scrollbars?
  canvas.height = window.innerHeight - 4
  // todo add window resize event handler to resize canvas as well

  let view = new Viewport(canvas)
  units.push(arch.generateDude())
  view.indexunit(units.length-1)
  view.redraw()

  window.onresize = function() {
    canvas.width = window.innerWidth // some cleaner way to avoid scrollbars?
    canvas.height = window.innerHeight - 4
    view.redraw()
  }
}