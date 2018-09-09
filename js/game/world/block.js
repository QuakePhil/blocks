var Block = function (generator, x, y, width, height) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height

  // certain elements only exist a certain distance from center
  let approximate = (x * x + y * y)
  this.contents = []

  // grass
  this.contents.push(['rectangle', 0, 0, false, false, false, 'green'])

  if (approximate < 200) {
    // asphalt
    this.contents.push(['rectangle', 0, 0, false, 4, false, 'grey'])
    this.contents.push(['rectangle', 0, 0, 4, false, false, 'grey'])
  }
  if (approximate < 180) {
    // sidewalk
    this.contents.push(['rectangle', 4, 4, 1, 17, false, 'lightgrey'])
    this.contents.push(['rectangle', 4, 4, 17, 1, false, 'lightgrey'])
    this.contents.push(['rectangle', 20, 4, 1, 17, false, 'lightgrey'])
    this.contents.push(['rectangle', 4, 20, 17, 1, false, 'lightgrey'])
  }
  if (approximate < 170) {
    let type = generator.pick(['park', 'alleys', 'tower', 'alleys', 'tower', 'alleys'])
    if (type == 'tower') {
      // tower
      this.contents.push(['rectangle', 5, 5, 15, 15, 'black', 'white'])      
    } else if (type == 'alleys') {
      // alleys
      this.contents.push(['rectangle', 5, 12, 15, 1, false, 'grey'])
      this.contents.push(['rectangle', 12, 5, 1, 15, false, 'grey'])
      // buildings
      this.contents.push(['rectangle', 5, 5, 7, 7, 'black', 'white'])
      this.contents.push(['rectangle', 13, 5, 7, 7, 'black', 'white'])
      this.contents.push(['rectangle', 5, 13, 7, 7, 'black', 'white'])
      this.contents.push(['rectangle', 13, 13, 7, 7, 'black', 'white'])
    }
  }
}

Block.prototype.draw = function(engine) {
  for (let element of this.contents) {
    engine[element[0]](
      this.x * this.width + element[1],
      this.y * this.height + element[2],
      element[3] === false ? this.width : element[3],
      element[4] === false ? this.height : element[4],
      element[5], // border
      element[6]) // fill
  }
}
