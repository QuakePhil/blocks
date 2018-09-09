var Generator = function() {
  this.seed = Math.random() * 100; // avoid multiple of Math.PI
  // before setting this to a cosntant, remember:
  // zooming out+roaming is not reproducible
}

Generator.prototype.random = function() {
  let x = Math.sin(this.seed++) * 12345
  return x - Math.floor(x)
}

Generator.prototype.randomBetween = function(min, max) {
  return Math.floor(this.random() * (max - min + 1) + min)
}

Generator.prototype.pick = function(a) {
  let x = Math.floor(this.random() * a.length)
  return a[x]
}
