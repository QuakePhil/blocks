Draw.prototype.block = function (x, y, contents) {
  if (typeof contents.lots == 'undefined' || contents.lots.length == 0) {
    return
  }
  this.ctx.fillStyle = 'grey'
  this.scaleFillRect(x + 7, y, 1, 15) // alleys
  this.scaleFillRect(x, y + 7, 15, 1)
  let dx = 0, dy = 0
  for (let i in contents.lots) {
    if ('type' in contents.lots[i]) {
      this.contents(x + dx, y + dy, contents.lots[i])
    }
    dx += 8
    if (dx > 15) {
      dy += 8
      dx = 0
    }
  }
}

Draw.prototype.building = function (x, y, contents) {
  this.ctx.fillStyle = 'white'
  this.scaleFillRect(x, y, 7, 7)
  this.ctx.fillStyle = 'black'
  this.scaleFillText(contents.name, x, y)
  this.ctx.strokeStyle = 'black'
  this.scaleRect(x, y, 7, 7)
}

Draw.prototype.shack = function (x, y, contents) {
  this.ctx.fillStyle = 'white'
  this.scaleFillRect(x, y, 3, 3)
  this.ctx.fillStyle = 'black'
  this.scaleFillText(contents.name, x, y)
  this.ctx.strokeStyle = 'black'
  this.scaleRect(x, y, 3, 3)
}

Draw.prototype.compound = function (x, y, contents) {
  this.ctx.fillStyle = 'white'
  this.scaleFillRect(x, y, 15, 15)
  this.ctx.fillStyle = 'black'
  this.scaleFillText(contents.name, x, y)
  this.ctx.strokeStyle = 'black'
  this.scaleRect(x, y, 15, 15)
}

Draw.prototype.lot = function (x, y, contents) {
  this.ctx.fillStyle = 'grey' // fill that nasty grass ;)
  this.scaleFillRect(x, y, 7, 7)
  let dx = 0, dy = 0
  for (let i in contents.lots) {
    if ('type' in contents.lots[i]) {
      this.contents(x + dx, y + dy, contents.lots[i])
    }
    dx += 4
    if (dx > 7) {
      dy += 4
      dx = 0
    }
  }
}

// validate and draw various sub-parts of the streets
Draw.prototype.contents = function (x, y, contents) {
  let valid = [ 'block', 'compound', 'building', 'lot', 'shack']
  if (valid.includes(contents.type)) {
    this[contents.type](x, y, contents)
  }
}

// streets should only be drawn from world
Draw.prototype.streets = function (x, y, contents) {
  this.ctx.fillStyle = 'green'
  this.scaleFillRect(x, y, 21, 21) // grass by default
  this.ctx.fillStyle = 'grey'
  this.scaleFillRect(x, y, 4, 21) // asphalt
  this.scaleFillRect(x, y, 21, 4)
  if (x % 105 == 0 && y % 105 == 0) { // every 5 (21 * 5 = 105) is a subway hatch
    this.ctx.fillStyle = 'black'
    this.scaleFillArc(x + 2, y + 2, 0.5)
  } 
  this.ctx.fillStyle = 'lightgrey'
  this.scaleFillRect(x + 4, y + 4, 1, 17) // sidewalk
  this.scaleFillRect(x + 4, y + 4, 17, 1)
  this.scaleFillRect(x + 20, y + 4, 1, 17)
  this.scaleFillRect(x + 4, y + 20, 17, 1)
  this.contents(x + 5, y + 5, contents)
}
