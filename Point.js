class Point {
    constructor() {
      this.x = 0
      this.y = 0
    }
    
    resize(x, y) {
      this.x = x
      this.y = y
    }
    update() {
      rect(this.x, this.y, pointW/2, pointH/2)
      for (let i = 0; i < points.length; i++) {
        if (this === points[i]) {
          fill(150, 150, 0, 100)
          text(i, this.x - pointW/4, this.y - pointH / 4)
          fill(0, 0, 0, 100)
        }
      }
    }
  }