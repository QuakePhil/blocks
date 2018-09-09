var Game = function (canvas) {
  this.canvas = canvas // for focus
  this.engine = new Engine(this, canvas)

  this.layer = new Layer()

  this.units = []
  this.units.push(new Player(this.layer, this.engine.generator, 2, 2))
  this.centerUnit = 0


  this.fps = 1000 / 60
  this.then = 0
  window.requestAnimationFrame(this.loop.bind(this)) 
}

Game.prototype.indexunit = function(i) {
  this.centerUnit = i
  this.engine.centerUnit(this.units[this.centerUnit])
}

Game.prototype.loop = function() {
  let now = Date.now()
  let elapsed = now - this.then

  if (elapsed > this.fps) {
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    // re: https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
    this.then = now - (elapsed % this.fps)
    this.engine.centerUnit(this.units[this.centerUnit])
    this.engine.redraw(this.layer)
    this.canvas.focus()
    this.units[this.centerUnit].draw(this.engine)
  }

  window.requestAnimationFrame(this.loop.bind(this))
}
