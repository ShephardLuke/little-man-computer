// holds everything to do with running animations

// declare nodes
let points = []
let pointW, pointH
for (let i = 0; i < 21; i++) {
  points.push(new Point())
}


class AnimationController { // Keeps track of running animations
  constructor() {
    this.animations = [] // list of the animations it has yet to run
    this.current = null
    this.timeout = null
    this.speed = 35
  }

  addAnimations(animations) { // for other scripts too add new animations to play
    this.animations = animations
    this.runAnimations() // start running loop
  }

  runAnimations() { // run next animation
    this.setCuContext()
    if (this.speed === 300 || this.animations[0][0] === false) {
      this.animationComplete() // runs then runs code when it is completed    
    } else {
      if (this.animations.length > 0) {
        this.playAnimation(this.animations[0][2], this.animations[0][3])

      }
    }
  }

  setCuContext() { // the context bar at the bottom of the screen for the user

    // get names of instruction and registers currently being animated
    let ins = this.animations[0][1]
    let para1 = this.animations[0][2]
    let para2 = this.animations[0][3]
    // display context
    switch (ins) {
      case cu.copyRegister:
        let name = para1.name; 
        if (para1.constructor.name == "TextBox") { // Input fix
            name = "Input"
        }
        cu.context = "Copying " + name + " contents to " + para2.name
        break
      case pc.increment:
        cu.context = "Incrementing PC"
        break
    }
  }

  playAnimation(reg1, reg2) { // play an animation
    let startPoint
    let endPoint

    // list of all the registers, in the order of their node number
    let regList = [pc, mar, mdr, cir, acc, null, cu, null, null, null, null, null, null, alu, null, null, null, memory, null, inputBox, outputtedCode]

    // find out the start and end nodes

    for (let item of regList) {
      if (item === reg1) {
        startPoint = regList.indexOf(item)
      } else if (item === reg2) {
        endPoint = regList.indexOf(item)
      }
    }

    // start creating route
    let animation = [points[startPoint]]

    // add middle nodes (for corners)
    if (startPoint <= 4) {
      animation.push(points[startPoint + 7])
    } else if (startPoint <= 13) {
      if (startPoint === 6) {
        animation.push(points[5])
      }
      animation.push(points[12])
    } else {
      if (startPoint === 17) {
        animation.push(points[14])
      } else {
        animation.push(points[18], points[16])
      }
      animation.push(points[15], points[12])
    }

    // more middle nodes
    if (endPoint <= 4) {
      animation.push(points[endPoint + 7])
    } else if (endPoint <= 13) {
      animation.push(points[12])

      if (endPoint === 6) {
        animation.push(points[5])
      }
    } else {

      animation.push(points[12], points[15])

      if (endPoint === 17) {
        animation.push(points[14])
      } else {
        animation.push(points[16], points[18])
      }
    }


    // add endpoint
    animation.push(points[endPoint])

    let colour = [0, 0, 200]

    let value = this.animations[0][2].value

    // for changing values at the start of an animation, and for changing colour for specific instructions
    if (this.animations[0][2] === memory) {
      value = memory.value[mar.value]
      memory.clearSelect()
      // colour = [150, 150, 0]
    } else if (this.animations[0][1] === cu.copyAddressTo) {
      value = this.animations[0][2].value - floor(this.animations[0][2].value / 100) * 100

    } else if (this.animations[0][1] === cu.sendToALU) {
      colour = [0, 200, 0]
      switch (cu.instruction) {
        case "ADD":
          value = " + "
          break
        case "SUB":
          value = " - "
      }
    } else if (this.animations[0][1] === cu.sendLDA) {
      colour = [150, 150, 0]
    } else if (this.animations[0][1] === cu.sendSTA) {
      colour = [200, 0, 0]
    }


    // run animation
    this.current = new Anim(addZeros(value), animation, colour)

  }

  updateAnimation() { // once a frame to update current animation
    this.speed = speedSlider.value() // update speed
    if (this.current != null) {
      this.current.update() // update animation if one is running
    }
  }

  animationComplete() { // when one is finsished
    this.current = null
    this.animations[0][1](this.animations[0][2], this.animations[0][3])
    this.animations.shift() // removes 1st value from list
    if (this.speed === 300) {
      if (this.animations.length != 0) { // if list is not empty, run next animation
        return this.runAnimations() // return so it does not call nextStage
      }
      nextStage() // next stage of stages array
    } else {
      this.timeout = setTimeout(function() {
        if (this.animations.length != 0) { // if list is not empty, run next animation
          return this.runAnimations() // return so it does not call nextStage
        }
        nextStage() // next stage of stages array
      }.bind(this), 50000 / this.speed)
    }

  }



  reset() { // when running a new program
    this.animations = []
    if (this.timeout != null) {
      clearTimeout(this.timeout)
    }
    this.timeout = null
    this.current = null
  }

  resizePoints() { // resizing the nodes

    pointW = windowWidth * 0.0125 * 2.1
    pointH = windowHeight * 0.02222 * 1.75

    // making sure all the nodes are in the right places with the right sizes
    let reg = [pc, mar, mdr, cir, acc]
    for (let i = 0; i < 5; i++) {
      points[i + 7].resize(alu.x + alu.w / 2, reg[i].y + reg[i].h / 2) // points 0,1,2,3,4
      points[i].resize(reg[i].x + reg[i].w / 2, reg[i].y + reg[i].h / 2) // points 0,1,2,3,4
    }
    points[5].resize(acc.x + acc.w / 2, acc.y + acc.h / 2 + (cu.y - acc.y) / 2)
    points[6].resize(acc.x + acc.w / 2, acc.y + acc.h / 2 + (cu.y - acc.y))
    points[12].resize(points[11].x, points[5].y)
    points[13].resize(points[11].x, points[6].y)
    points[14].resize(points[12].x + (points[12].x - points[5].x), points[7].y - (points[8].y - points[7].y) / 2)
    points[15].resize(points[14].x, points[12].y)
    points[16].resize(points[14].x, points[15].y + (points[8].y - points[7].y) * 1.5)
    points[17].resize(points[14].x + points[7].x - points[0].x, points[14].y)
    points[18].resize(inputBox.textbox.position().x + inputBox.element.offsetWidth / 2, points[16].y)
    points[19].resize(inputBox.textbox.position().x + inputBox.element.offsetWidth / 2, inputBox.textbox.position().y + inputBox.element.offsetHeight / 2)
    points[20].resize(outputtedCode.textbox.position().x + windowWidth * 0.02, points[18].y)
  }

  drawPoints() { // for drawing the buses
    if (debug) {
      fill(100, 100, 100, 100)
    } else {
      fill(100)
    }
    let reg = [pc, mar, mdr, cir, acc]

    // draw the buses
    for (let i = 0; i < 5; i++) {
      rect(points[i].x - pointW / 2, points[i].y - pointH / 2, pointW * 4.6, pointH) // points 0,1,2,3,4
    }
    rect(points[5].x - pointW / 2, points[5].y - pointH / 2, pointW * 8.2, pointH)
    rect(points[5].x - pointW / 2, points[5].y - pointH / 2, pointW, pointH * 4)

    rect(points[8].x - pointW / 2, pc.y + pc.h / 4, pointW, pointH * 15)

    rect(points[14].x - pointW / 2, points[14].y - pointH / 2, pointW, pointH * 16)
    rect(points[14].x - pointW / 2, points[14].y - pointH / 2, pointW * 4, pointH)

    rect(points[16].x - pointW / 2, points[16].y - pointH / 2, pointW * 15, pointH)

    rect(points[18].x - pointW / 2, points[18].y - pointH / 2, pointW, pointH * 6)

    rect(points[19].x - pointW / 2, points[19].y - pointH / 3.5, pointW * 2, pointH / 2)

    if (debug) {
      rectMode(CENTER)
      for (let point of points) {
        fill(0)
        point.update()
      }
      rectMode(CORNER)
    }


  }

  animOnly() {
    return
  }

}