window.onload = function() {
  //let arch = new Architect()

  let canvas = document.getElementById('viewport')

  window.onresize = function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight - 4
  }
  window.onresize()

  let game = new Game(canvas)
  //units.push(arch.generateDude())
  //view.indexunit(units.length-1)
}