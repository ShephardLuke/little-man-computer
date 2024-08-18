class Register {
    constructor(name) {
      this.value = 0
      this.name = name
      this.colour = [80, 22, 62]
      this.x = 0
      this.y = 0
      this.w = 0
      this.h = 0
    }
    resize(x, y, w, h) {
      this.x = x
      this.y = y
      this.w = w
      this.h = h
    }
    update() {
      noStroke()
      fill(this.colour)
      rect(this.x, this.y, this.w, this.h)
      let current = addZeros(this.value)
  
      // fill(28, 19, 73)
      // rect(this.x + windowWidth * 0.025 + windowWidth * (0.035 * (i % 10)) - windowWidth * 0.003, this.y + windowHeight / 15 + ((floor(i / 10)) * 9 / this.h) * windowHeight / 10 * windowWidth * 0.0150 - windowHeight * 0.002, windowWidth * 0.0125 * 2 + windowWidth * 0.002, windowHeight * 0.0264)
      fill(40, 10, 28)
      rect(this.x + this.w / 4, this.y + this.h / 2, this.w * 0.5, this.w * 0.23)
      
      fill(255)
      textAlign(CENTER, TOP)
      text(this.name, this.x + this.w / 2, this.y + this.h / 10)
      text(current, this.x + this.w / 2, this.y + this.h / 2)
  
    }
  
    increment() {
      pc.value++
    }
  
    clear() {
      this.value = 0
    }
  }