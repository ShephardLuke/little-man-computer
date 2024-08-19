class Anim { // Animation
  constructor(value, route, colour) {
    this.value = value
    this.route = route
    this.percent = 0
    this.colour = colour

    this.start = null
    this.x = null
    this.y = null
    this.goal = null
    this.begin = null
    this.axis = null

    // Emergency measure - if the animation gets stuck or cannot reach goal for whatever reason, are too long has passed it will be skipped
    this.timeout = setTimeout(function() {
      animCon.animationComplete()
    }.bind(this), 200000 / animCon.speed) // if the animation gets stuck, the timeout will make sure it doesnt halt the program

    this.nextStep() // start the animation

  }
  update() { // once a frame
    fill(this.colour)
    rectMode(CENTER)
    textAlign(CENTER, CENTER)
    this.begin = [this.start.x, this.start.y]

    if (this.axis === "x") { // if moving horizontal

      // find out how much percent has been done
      let diff = abs(this.goal.x - this.begin[0])
      this.percent += 0.7 / diff * (animCon.speed * 20)
      if (this.percent > 100) {
        this.percent = 100
      }

      // update the x position to the percent (works even if speed is changed)      
      this.x = this.begin[0] + (this.goal.x - this.begin[0]) / 100 * this.percent

      // display animtion
      rect(this.x, this.goal.y, pointW * 0.9, pointH * 0.9)
      fill(255)
      text(this.value, this.x, this.goal.y)

      // if goal reached, do next step
      if (round(this.x) === round(this.goal.x)) {
        this.percent = 0
        this.nextStep()
      }

    } else {

      let diff = abs(this.goal.y - this.begin[1])
      this.percent += 0.7 / diff * (animCon.speed * 20)
      if (this.percent > 100) {
        this.percent = 100
      }
      this.y = this.begin[1] + (this.goal.y - this.begin[1]) / 100 * this.percent
      rect(this.goal.x, this.y, pointW * 0.9, pointH * 0.9)
      fill(255)
      text(this.value, this.goal.x, this.y)
      if (round(this.y) === round(this.goal.y)) {
        this.percent = 0
        this.nextStep()
      }
    }

    textAlign(LEFT, TOP)

    rectMode(CORNER)



  }

  getAxis() {
    if (this.start.x === this.goal.x) {
      return "y"
    } else {
      return "x"
    }
  }

  nextStep() { // runs at every node reached
    // check if all steps are done
    if (this.route.length === 1) {
      clearTimeout(this.timeout)
      return animCon.animationComplete()
    }

    // reset values and start next step
    this.start = this.route[0]
    this.route.shift()
    this.x = this.start.x
    this.y = this.start.y
    this.goal = this.route[0]
    this.axis = this.getAxis()
  }
}