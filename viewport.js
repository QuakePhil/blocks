let keyboard = {}

let Viewport = function (canvas) {
  this.fps = 1000 / 30
  this.then = 0
  this.width = canvas.width
  this.height = canvas.height

  this.unit = false
  this.mousedown = false
  this.scale = 100
  this.offsetx = 0
  this.offsety = 0
  this.draw = new Draw(canvas, this)
  this.waypoints = []

  this.dragx = 0
  this.dragy = 0
  canvas.onmousedown = this.onmousedown.bind(this)
  canvas.onmouseup = this.onmouseup.bind(this)
  canvas.onmousemove = this.onmousemove.bind(this)
  canvas.onmousewheel = this.onmousewheel.bind(this)
  canvas.tabIndex = 1
  canvas.onkeydown = canvas.onkeyup = this.onkeyboard.bind(this)
  window.requestAnimationFrame(this.loop.bind(this)) 
}

Viewport.prototype.physics = function() {
  for (let i in units) {
    if (units[i].angle !== false) {
      units[i].x += Math.cos(units[i].angle * Math.PI / 180) * 0.05
      units[i].y += Math.sin(units[i].angle * Math.PI / 180) * 0.05
    }
  }
}

Viewport.prototype.loop = function() {
  this.physics()
  let now = Date.now();
  let elapsed = now - this.then;

  if (elapsed > this.fps) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      // re: https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
      this.then = now - (elapsed % this.fps);
      this.redraw()
  }

  window.requestAnimationFrame(this.loop.bind(this))
}

Viewport.prototype.centerunit = function() {
  if (this.unit === false) return
  let xy = this.draw.offsetAndScale(units[this.unit].x, units[this.unit].y)
  this.offsetx += this.width / 2 - xy[0]
  this.offsety += this.height / 2 - xy[1]
}

Viewport.prototype.indexunit = function(i) {
  this.unit = i
  this.centerunit()
}

Viewport.prototype.redraw = function() {
  this.centerunit()
  this.draw.world(this.offsetx, this.offsety, this.scale)
}

Viewport.prototype.keyboard = function(i) {
  if (typeof keyboard[i] !== 'undefined') {
    return keyboard[i]
  }
  return false
}

Viewport.prototype.onkeyboard = function(e) {
  keyboard[e.keyCode] = e.type == 'keydown'
  /*
  //if (e.type == 'keydown') {
    //          87 - w
    // 65 - a   83 = s   68 - d
    let doublekey = false
    if (this.keyboard(87) && this.keyboard(68)) {
      units[this.unit].angle = 360-45
      doublekey = true
    }
    if (this.keyboard(83) && this.keyboard(68)) {
      units[this.unit].angle = 45
      doublekey = true
    }
    if (this.keyboard(83) && this.keyboard(65)) {
      units[this.unit].angle = 135
      doublekey = true
    }
    if (this.keyboard(87) && this.keyboard(65)) {
      units[this.unit].angle = 360-135
      doublekey = true
    }
    if (!doublekey) {
      if (this.keyboard(87)) units[this.unit].angle = 270
      if (this.keyboard(68)) units[this.unit].angle = 0
      if (this.keyboard(83)) units[this.unit].angle = 90
      if (this.keyboard(65)) units[this.unit].angle = 180
    }
  */
  if (this.keyboard(32)) {
    units[this.unit].angle = false
  }
}

Viewport.prototype.onmousedown = function(e) {
  this.mousedown = true
  this.dragx = this.offsetx - e.clientX
  this.dragy = this.offsety - e.clientY
}

Viewport.prototype.onmouseup = function(e) {
  if (this.mousedown && this.unit !== false && e.button == 0) {
    let xy = this.draw.offsetAndScale(units[this.unit].x, units[this.unit].y)
    units[this.unit].angle = Math.atan2(e.clientY - xy[1], e.clientX - xy[0]) * (180 / Math.PI)
    this.waypoints = [
      [
        (e.clientX - this.offsetx) / this.scale,
        (e.clientY - this.offsety) / this.scale
      ]
    ]
    console.log(this.waypoints)
  }

  this.mousedown = false
}

Viewport.prototype.onmousemove = function(e) {
  if (this.mousedown && this.unit === false) {
    // drag
    this.offsetx = this.dragx + e.clientX
    this.offsety = this.dragy + e.clientY
    this.redraw()
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

  if (increment != 0) this.redraw()

  return false
}
