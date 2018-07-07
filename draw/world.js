let Draw = function (canvas) {
  this.ctx = canvas.getContext('2d')
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
  xy = this.offsetAndScale(x, y)
  let lineheight = this.scale / 2 // approximate
  this.ctx.font = "" + lineheight + "px Verdana"
  this.ctx.fillText(text, 5 + xy[0], 5 + xy[1] + lineheight)
}

// entry point
Draw.prototype.world = function (offsetx, offsety, scale) {
  // clear
  this.ctx.beginPath()
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  // update offset/scale
  this.scale = scale
  this.offsetx = offsetx
  this.offsety = offsety

  // adjust offset so that unit being controlled can be seen

  // render
  for (let i in blocks) {
    if (this.blockIsInViewport(blocks[i])) {
      this.streets(blocks[i].x, blocks[i].y, blocks[i].content)
    }
  }
}