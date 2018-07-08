let Draw = function (canvas) {
  this.ctx = canvas.getContext('2d')
  this.architect = new Architect()
}

Draw.prototype.offsetAndScale = function(x, y) {
  x = x * this.scale
  y = y * this.scale
  x = x + this.offsetx
  y = y + this.offsety
  return [x, y]
}

Draw.prototype.blockIsInViewport = function(block) {
  xy = this.offsetAndScale(block.x, block.y)
  xy21 = this.offsetAndScale(block.x+21, block.y+21) // blocks are 21 pixels wide at scale 1
  return !(xy[0] > this.ctx.canvas.width || xy[1] > this.ctx.canvas.height || xy21[0] < 0 || xy21[1] < 0)
}

Draw.prototype.scaleRect = function(x, y, width, height) {
  xy = this.offsetAndScale(x, y) // [x, y] = ... not supported in IE :( 
  this.ctx.rect(xy[0], xy[1], width * this.scale, height * this.scale)
  this.ctx.stroke()
}

Draw.prototype.scaleFillRect = function(x, y, width, height) {
  xy = this.offsetAndScale(x, y)
  this.ctx.fillRect(xy[0], xy[1], width * this.scale, height * this.scale)
}

Draw.prototype.scaleFillArc = function(x, y, r) {
  xy = this.offsetAndScale(x, y)
  this.ctx.beginPath()
  this.ctx.arc(xy[0], xy[1], r * this.scale, 2 * Math.PI, false)
  this.ctx.fill()
}

Draw.prototype.scaleFillText = function(text, x, y) {
  if (this.scale < 20) return
  xy = this.offsetAndScale(x, y)
  let lineheight = this.scale / 2 // approximate
  this.ctx.font = "" + lineheight + "px Verdana"
  this.ctx.fillText(text, 5 + xy[0], 5 + xy[1] + lineheight)
}

// https://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
Draw.prototype.fillEllipse = function(x, y, w, h) {
  x -= w/2.0
  y -= h/2.0
  var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  this.ctx.beginPath();
  this.ctx.moveTo(x, ym);
  this.ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  this.ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  this.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  this.ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  //this.ctx.closePath(); // not used correctly, see comments (use to close off open path)
  this.ctx.fill();
}

Draw.prototype.dude = function(unit) {
  xy = this.offsetAndScale(unit.x, unit.y)
  this.ctx.fillStyle = unit.shirt
  this.fillEllipse(xy[0], xy[1], unit.weight / 150 * this.scale, unit.height / 200 * this.scale)
  this.ctx.fillStyle = unit.skin
  // head
  this.fillEllipse(xy[0], xy[1] - unit.height * this.scale / 320, unit.weight / 300 * this.scale, unit.weight / 300 * this.scale)
  // weapons
  this.fillEllipse(xy[0] - unit.height * this.scale / 480, xy[1] - unit.height * this.scale / 800, unit.weight / 400 * this.scale, unit.weight / 400 * this.scale)
  this.fillEllipse(xy[0] + unit.height * this.scale / 480, xy[1] - unit.height * this.scale / 800, unit.weight / 400 * this.scale, unit.weight / 400 * this.scale)
}

let blocks = []

// entry point
Draw.prototype.world = function (offsetx, offsety, scale) {
  // clear
  this.ctx.beginPath()
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  // update offset/scale
  this.scale = scale
  this.offsetx = offsetx
  this.offsety = offsety


  let drawn = created = 0
  for (let x = Math.floor(-this.offsetx / this.scale / 21);
    x <= Math.floor((this.ctx.canvas.width - this.offsetx) / this.scale / 21);
    ++x)
  for (let y = Math.floor(-this.offsety / this.scale / 21);
    y <= Math.floor((this.ctx.canvas.height - this.offsety) / this.scale / 21);
    ++y) {
    // check if already has been generated
    let block = false
    for (let i in blocks) {
      if (blocks[i].x == x * 21 && blocks[i].y == y * 21) {
        block = blocks[i]
        break;
      }
    }

    // generate if not found
    if (block === false) {
      block = {
        x: x * 21,
        y: y * 21,
        content: this.architect.generateStreets()
      }
      blocks.push(block)
      created++
    }

    this.streets(block.x, block.y, block.content)
    drawn++
  }

  for (let i in units) {
    this.dude(units[i])
  }
  //console.log("Drawn: " + drawn + " (created: " + created + ")")
}
