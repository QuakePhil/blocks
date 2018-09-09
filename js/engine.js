var Engine = function (game, canvas) {
  this.game = game
  this.ctx = canvas.getContext('2d')
  this.width = canvas.width // refactor: use this.ctx.canvas.w/h
  this.height = canvas.height // instead, if really necessary
  this.generator = new Generator()

  this.mousedown = false
  this.scale = 30
  this.offsetx = 0
  this.offsety = 0
  this.dragx = 0
  this.dragy = 0

  canvas.onmousedown = this.onmousedown.bind(this)
  canvas.onmouseup = this.onmouseup.bind(this)
  canvas.onmousemove = this.onmousemove.bind(this)
  canvas.onmousewheel = this.onmousewheel.bind(this)
  canvas.tabIndex = 1
}

Engine.prototype.onmousedown = function(e) {
  this.mousedown = true
  this.dragx = this.offsetx - e.clientX
  this.dragy = this.offsety - e.clientY
}

Engine.prototype.onmouseup = function(e) {
  if (this.mousedown && this.game.centerUnit !== false && e.button == 0) {
    this.game.units[this.game.centerUnit].waypoint(this, e.clientX, e.clientY)
  }

  this.mousedown = false
}

Engine.prototype.onmousemove = function(e) {
  if (this.mousedown) {
    this.offsetx = this.dragx + e.clientX
    this.offsety = this.dragy + e.clientY
  }

  return false
}

Engine.prototype.onmousewheel = function(e) {
  let increment = 0

  if (e.deltaY < 0 && this.scale < 100) {
    increment = 2
  }
  if (e.deltaY > 0 && this.scale > 4) {
    increment = -2
  }
  this.offsetx -= (e.clientX - this.offsetx) / this.scale * increment
  this.offsety -= (e.clientY - this.offsety) / this.scale * increment
  this.scale += increment

  return false
}

Engine.prototype.centerUnit = function(unit) {
  let xy = this.transform(unit)
  this.offsetx += this.width / 2 - xy[0]
  this.offsety += this.height / 2 - xy[1]
}

// if only one parameter is supplied, it is expected to have .x and .y
Engine.prototype.transform = function(x, y = false) {
  if (y === false) {
    y = x.y
    x = x.x
  }
  x *= this.scale
  y *= this.scale
  x += this.offsetx
  y += this.offsety
  return [x, y]
}

// handshortcot for reverse transform
Engine.prototype.px = function(step) {
  return step / 30
}

Engine.prototype.rectangle = function(x, y, width, height,
  border = 'black', fill = false
) {
  let xy = this.transform(x, y)
  if (border !== false) {
    this.ctx.strokeStyle = border
    this.ctx.strokeRect(xy[0], xy[1], width * this.scale, height * this.scale)
  }
  if (fill !== false) {
    this.ctx.fillStyle = fill
    this.ctx.fillRect(xy[0], xy[1], width * this.scale, height * this.scale)
  }
}

Engine.prototype.circle = function(x, y, radius,
  border = 'black', fill = false
) {
  let xy = this.transform(x, y)
  radius *= this.scale
  if (border !== false) {
    this.ctx.strokeStyle = border
    this.ctx.beginPath()
    this.ctx.arc(xy[0], xy[1], radius, 2 * Math.PI, false)
    this.ctx.stroke()
  }
  if (fill !== false) {
    this.ctx.fillStyle = fill
    this.ctx.beginPath()
    this.ctx.arc(xy[0], xy[1], radius, 2 * Math.PI, false)
    this.ctx.fill()
  }
}

Engine.prototype.redraw = function(layer) {
  // clear
  this.ctx.beginPath()
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  layer.render(this)
  for (let unit of this.game.units) {
    unit.think()
  }
}
