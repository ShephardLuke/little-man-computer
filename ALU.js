class ALU extends Register { // ALU REGISTER
    constructor(name) {
      super(name)
      this.instruction = "."
      this.input0 = 0
      this.input1 = 0
      this.colour = [61, 36, 76]
    }
    update() { // once per frame
  
      // draw outside box
      noStroke()
      fill(this.colour)
      rect(this.x, this.y, this.w, this.h)
  
  
      // draw inner boxes
      fill(39, 23, 49)
      rect(this.x + this.w / 8, this.y + this.h / 2.5, this.w * 0.25, this.w * 0.11)
      rect(this.x + this.w / 2 - this.w * 0.065, this.y + this.h / 2.5, this.w * 0.13, this.w * 0.11)
      rect(this.x + this.w / 1.6, this.y + this.h / 2.5, this.w * 0.25, this.w * 0.11)
      rect(this.x + this.w * 0.3, this.y + this.h / 1.5, this.w * 0.4, this.w * 0.11)
  
      // draw text
      fill(255)
      textAlign(CENTER, TOP)
      text(this.name, this.x + this.w / 2, this.y + this.h / 10)
      text(addZeros(this.input0), this.x + this.w / 4, this.y + this.h / 2.5)
      text(this.instruction, this.x + this.w / 2, this.y + this.h / 2.5)
      text(addZeros(this.input1), this.x + this.w / 1.33, this.y + this.h / 2.5)
      text(addZeros(this.value), this.x + this.w / 2, this.y + this.h / 1.5)
    }
  
    calculate() { // ran when 2 values need to have arithmetic/logic performed on them
      // arithmetic
      let result = 0
      if (this.instruction === "+") {
        result = this.input0 + this.input1
      }
      else if (this.instruction === "-") {
        result = this.input0 - this.input1
      }
  
      // overflow    
      if (result > 999) {
        result = -999 + result - 1000
      }
      if (result < -999) {
        result = 999 + result + 1000
      }
  
      this.value = result
  
      // logic operations
      if (this.instruction === "=") {
        if (this.input0 === 0) {
          this.value = "TRUE"
          animCon.animations.push([true, cu.copyAddressTo, cir, pc]) // copy cir to pc
        } else {
          this.value = "FALSE"
        }
      } else if (this.instruction === ">=") {
        if (this.input0 >= 0) {
          this.value = "TRUE"
          animCon.animations.push([true, cu.copyAddressTo, cir, pc]) // copy cir to pc
        } else {
          this.value = "FALSE"
        }
      }
    }
  
    updateInput0(reg) { // update left input
      this.input0 = reg.value
    }
  
    updateInput1(reg) { // update right inputt
      this.input1 = reg.value
    }
  
    clear() { // when program ran
      super.clear()
      this.instruction = "."
      this.input0 = 0
      this.input1 = 0
    }
  }