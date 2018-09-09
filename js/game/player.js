var Player = function (layer, generator, x, y) {
  this.layer = layer
  this.waypoints = []
  this.x = x
  this.y = y
  this.speed = 0.05
  this.angle = false
  this.skin = generator.pick(['#8d5524','#c68642','#e0ac69','#f1c27d','#ffdbac'])
  this.weight = generator.randomBetween(67,120)
  this.height = generator.randomBetween(150, 200)
}

Player.prototype.waypoint = function(engine, x, y) {
  let xy = engine.transform(this.x, this.y)
  this.angle = Math.atan2(y - xy[1], x - xy[0]) * (180 / Math.PI)
  let wpx = (x - engine.offsetx) / engine.scale
  let wpy = (y - engine.offsety) / engine.scale
  this.waypoints = [[this.x, this.y, wpx, wpy]] // TODO: support multiple waypoints
}

Player.prototype.arrived = function(waypoint) {
  let xdelta = waypoint[2] - waypoint[0]
  let ydelta = waypoint[3] - waypoint[1]
  if (xdelta > 0 && this.x > waypoint[2]) return true
  if (xdelta < 0 && this.x < waypoint[2]) return true
  if (ydelta > 0 && this.y > waypoint[3]) return true
  if (ydelta < 0 && this.y < waypoint[3]) return true
  return false
}

Player.prototype.collide = function() {
  let block = false
  let bx1 = false
  let by1 = false
  for (block of this.layer.blocks.blocks) {
    bx1 = block.x * block.width
    by1 = block.y * block.height
    let bx2 = block.x * block.width + block.width
    let by2 = block.y * block.height + block.height
    if (this.x > bx1 && this.x < bx2 && this.y > by1 && this.y < by2) {
      break
    }
  }
  // we are in block
  for (let element of block.contents) {
    // solid objects
    if (element[6] == 'white') {
      let ex1 = bx1 + element[1]
      let ey1 = by1 + element[2]
      let ex2 = ex1 + element[3]
      let ey2 = ey1 + element[4]
      if (this.x > ex1 && this.x < ex2 && this.y > ey1 && this.y < ey2) {
        console.log(element, block)
      }
    }
  }
}

Player.prototype.think = function () {
  if (this.angle !== false) {
    let xdelta = this.x + Math.cos(this.angle * Math.PI / 180) * this.speed
    let ydelta = this.y + Math.sin(this.angle * Math.PI / 180) * this.speed
    let collide = this.collide()
    this.x = xdelta
    this.y = ydelta
    if (this.arrived(this.waypoints[0])) {
      this.angle = false
      this.waypoints.shift()
    }
  }
}

Player.prototype.draw = function (engine) {
  engine.rectangle(this.x - engine.px(5), this.y - engine.px(10),
    engine.px(10), engine.px(20), 'black', '#333')
  engine.circle(this.x, this.y - engine.px(18), engine.px(8),
    'black', this.skin)
}
