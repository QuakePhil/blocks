let Architect = function () {
  this.seed = 1 // Math.random() * 100; // avoid multiple of Math.PI
}

Architect.prototype.random = function() {
  let x = Math.sin(this.seed++) * 12345
  return x - Math.floor(x)
}

Architect.prototype.randomBetween = function(min, max) {
  return Math.floor(this.random() * (max - min + 1) + min)
}

Architect.prototype.pick = function(a) {
  let x = Math.floor(this.random() * a.length)
  return a[x]
}

Architect.prototype.generateDude = function(template = {}) {
  let tones = ['#8d5524','#c68642','#e0ac69','#f1c27d','#ffdbac']
  let shirts = ['red', 'green', 'blue', 'purple', 'brown', 'pink', 'white', 'orange']
  let weapons = ['fists', 'pistol']
  let dude = {
    angle: false,
    x: 1,
    y: 1,
    skin: this.pick(tones),
    shirt: this.pick(shirts),
    weight: this.randomBetween(67,120),
    height: this.randomBetween(150, 200),
    weapon: this.pick(weapons)
  }
  return Object.assign(template, dude)
}

Architect.prototype.generateLot = function() {
  let lots = [
    {},
    { type: 'shack', name: 'Shack' },
    { type: 'shack', name: 'Bodega' },
    { type: 'shack', name: 'Deli' },
    { type: 'shack', name: 'Shop' },
    { type: 'shack', name: 'Office' },
    { type: 'shack', name: 'ATM' }
  ]
  return this.pick(lots)
}

Architect.prototype.generateLots = function() {
  let ret = { type: 'lot' }
  ret.lots = []
  for (let i = 0; i < 4; ++i) {
    ret.lots.push(this.generateLot())
  }
  return ret
}

Architect.prototype.generateBuilding = function() {
  let types = ['lots', 'building']
  let buildings = [
    {},
    { type: 'building', name: 'House' },
    { type: 'building', name: 'Cleaners' },
    { type: 'building', name: 'Grocer' },
    { type: 'building', name: 'Bank' },
    { type: 'building', name: 'Office' },
    { type: 'building', name: 'Deli' },
    { type: 'building', name: 'Bodega' }
  ]

  if (this.pick(types) == 'building') {
    return this.pick(buildings)
  } else {
    return this.generateLots()
  }
}

Architect.prototype.generateBlock = function() {
  let ret = { type: 'block' }
  let park = this.pick([true, false])
  if (park) {
    return ret
  }
  ret.lots = []
  for (let i = 0; i < 4; ++i) {
    ret.lots.push(this.generateBuilding())
  }
  return ret
}

Architect.prototype.generateStreets = function() {
  let types = ['compound', 'block']
  let names = ['Bank', 'Supermarket', 'Apartments', 'Offices', 'Mall']
  let blockType = this.pick(types)
  if (blockType == 'compound') {
    return { type: 'compound', name: this.pick(names) }
  } else {
    return this.generateBlock()
  }
}
/*
  content: {
    type: 'block',
    lots: [
      { },
      { },
      {
        type: 'lot',
        lots: [
          { type: 'shack', name: 'Shack' },
          { },
          { type: 'shack', name: 'Bodega' },
          { type: 'shack', name: 'Shack' },
        ] 
      },
      { type: 'building', name: 'House' },
    ]
  }*/
