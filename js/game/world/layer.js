let Layer = function () {
  this.blockwidth = 21
  this.blockheight = 21

  this.blocks = new Blocks(this.blockwidth, this.blockheight)
}

// render a grid of blocks inside the engine's viewpoint
// (blocks are generated on demand)
Layer.prototype.render = function (engine) {
  this.blocks.created = this.blocks.drawn = 0

  // starting index
  let x = Math.floor(-engine.offsetx / engine.scale / this.blockwidth)
  let y = Math.floor(-engine.offsety / engine.scale / this.blockheight)
  // 1 block per column, row
  let columns = Math.ceil(engine.ctx.canvas.width / engine.scale / this.blockwidth)
  let rows = Math.ceil(engine.ctx.canvas.height / engine.scale / this.blockheight)

  for (let column = x; column <= x + columns; ++column)
  for (let row = y; row <= y + rows; ++row) {
    this.blocks.retrieve(engine.generator, column, row).draw(engine)
    this.blocks.drawn++
  }

  if (this.blocks.created > 0) {
    console.log(this.blocks)
  }
}
