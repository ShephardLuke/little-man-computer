let debug = false // debug mode

function setup() {
  createCanvas(windowWidth, windowHeight) // setup the canvas
  setupUI() // all the UI gets setup in one function
  assembleCode()
}

function draw() { // runs at 60 fps
  background(13, 32, 59) // sets background colour
  drawUI()
}