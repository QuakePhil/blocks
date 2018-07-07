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

Draw.prototype.scaleFillText = function(text, x, y) {
  if (this.scale < 20) return
  xy = this.offsetAndScale(x, y)
  let lineheight = this.scale / 2 // approximate
  this.ctx.font = "" + lineheight + "px Verdana"
  this.ctx.fillText(text, 5 + xy[0], 5 + xy[1] + lineheight)
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
  console.log("Drawn: " + drawn + " (created: " + created + ")")
}
