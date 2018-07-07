let Viewport = function (canvas) {
  this.width = canvas.width
  this.height = canvas.height

  this.draw = new Draw(canvas)
  this.mousepressed = false
  this.scale = 10
  this.offsetx = 0
  this.offsety = 0
  this.dragx = 0
  this.dragy = 0
  canvas.onmousedown = this.onmousedown.bind(this)
  canvas.onmouseup = this.onmouseup.bind(this)
  canvas.onmousemove = this.onmousemove.bind(this)
  canvas.onmousewheel = this.onmousewheel.bind(this)

  this['draw'].world(this.offsetx, this.offsety, this.scale)
}

Viewport.prototype.onmousedown = function(e) {
  this.mousepressed = true
  this.dragx = this.offsetx - e.clientX
  this.dragy = this.offsety - e.clientY
}

Viewport.prototype.onmouseup = function(e) {
  if (this.mousepressed) {
    // click
  }

  this.mousepressed = false
}

Viewport.prototype.onmousemove = function(e) {
  if (this.mousepressed) {
    // drag
    this.offsetx = this.dragx + e.clientX
    this.offsety = this.dragy + e.clientY
    this['draw'].world(this.offsetx, this.offsety, this.scale)
  }

  return false
}

// todo: fix zoom and pan to work together
Viewport.prototype.onmousewheel = function(e) {
  let increment = 0

  if (e.deltaY < 0 && this.scale < 100) {
    increment = 1
  }
  if (e.deltaY > 0 && this.scale > 10) {
    increment = -1
  }
  this.offsetx -= (e.clientX - this.offsetx) / this.scale * increment
  this.offsety -= (e.clientY - this.offsety) / this.scale * increment
  this.scale += increment

  this['draw'].world(this.offsetx, this.offsety, this.scale)

  return false
}