class MemoryRegister extends Register {
  constructor(name) {
    super(name)
    this.value = []
    this.backup = []
    this.colour = [40, 27, 103]
    this.mode = null
    this.clear() // add 100 0s
  }
  update() {
    noStroke()
    fill(this.colour)
    rect(this.x, this.y, this.w, this.h)

    fill(255)
    textSize(windowWidth * 0.0250)
    textAlign(CENTER, TOP)

    text(this.name, this.x + this.w / 2, this.y + windowHeight / 75)

    textSize(windowWidth * 0.0125)
    textAlign(CENTER, TOP)

    let line = ""
    for (let i = 0; i < this.value.length; i++) {

      let current = addZeros(this.value[i])
      
      fill(28, 19, 73)
      
      let x = this.x + windowWidth * 0.025 + windowWidth * (0.035 * (i % 10))
      let y = this.y + windowHeight / 10 + ((floor(i / 10)) / (this.value.length / this.h)) * 8

      if (i === mar.value) {
        if (this.mode === "l") {
          fill(150, 150, 0)
        } else if (this.mode === "r") {
          fill(200, 0, 0)
        }
      }
      
      rect(x - windowWidth * 0.003, y - windowHeight * 0.002, windowWidth * 0.0125 * 2 + windowWidth * 0.002, windowWidth * 0.0135)

      fill(255)
      text(current, x + windowWidth * 0.0105, y)
    }
  }
  store() {
    memory.value[mar.value] = mdr.value
    memory.mode = null
  }
  load() {
    mdr.value = memory.value[mar.value]
    memory.mode = null
  }

  clearSelect() {
    memory.mode = null
  }

  clear() {
    this.value = []
    this.mode = null
    for (let x = 0; x < 100; x++) { // fill with 0
      this.value.push(0)
    }
  }
}