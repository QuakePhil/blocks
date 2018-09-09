let Blocks = function(width, height) {
  this.blocks = []
  this.width = width
  this.height = height

  // for debugging
  this.created = 0
  this.drawn = 0
}

Blocks.prototype.exists = function(x, y) {
  for (let i in this.blocks) {
    if (this.blocks[i].x == x && this.blocks[i].y == y) {
      return this.blocks[i]
    }
  }
  return false  
}

// find or generate
Blocks.prototype.retrieve = function(generator, x, y) {
  let block = this.exists(x, y)

  if (block === false) {
    block = new Block(generator, x, y, this.width, this.height)
    this.blocks.push(block)
    this.created++
  }

  return block
}
