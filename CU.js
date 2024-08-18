class CU extends Register {
    constructor(name) {
      super(name)
      this.value = "..."
      this.instructionFound = null
      this.colour = [61, 36, 76]
      this.context = "No program running."
    }
    update() { // once a frame
      noStroke()
      fill(this.colour)
      rect(this.x, this.y, this.w, this.h)
      let current = String(this.value)
  
      while (current.length < 3) {
        current = "0" + current // pad with 0s so all numbers are 3 digits
      }
  
      fill(39, 23, 49)
      rect(this.x + this.w / 4, this.y + this.h / 2, this.w * 0.5, this.w * 0.23)
  
      fill(255)
  
      // drawing the register
      textAlign(CENTER, TOP)
      text(this.name, this.x + this.w / 2, this.y + this.h / 10)
      text(this.instruction, this.x + this.w / 2, this.y + this.h / 3 * 2)
      text(current, this.x + this.w / 2, this.y + this.h / 2)
  
      textAlign(LEFT, TOP)
      text(this.context, codeInput.element.offsetWidth + compiledCode.element.offsetWidth + windowWidth * 0.04, windowHeight * 0.96)
    }
  
    findInstruction() {
      let found = false
      for (let instruction of instructionList) {
        if (instruction[2]) { // includes address?
          if (floor(cir.value / 100) === instruction[1]) { // if first digit of value is the same as the instruction
            this.instructionFound = instruction
            this.value = instruction[0]
            this.context = "Current instruction: " + instruction[0]
            found = true
          }
        } else { // no address
          if (cir.value === instruction[1]) { // if 3 digits = instructions 3 digits
            this.instructionFound = instruction
            this.value = instruction[0]
            this.context = "Current instruction: " + instruction[0]
            found = true
          }
        }
      }
      if (!found) { // in case the instruction is not in the list
        this.context = "Error: Instruction not found."
        this.value = "ERR"
        running = false
        return
      }
    }
  
    copyRegister(reg1, reg2) { // copying 1 register to another
      reg2.value = reg1.value
    }
  
    sendToALU() { // changing the ALU instruction
      switch (cu.value) {
        case "ADD":
          alu.instruction = "+"
          break
        case "SUB":
          alu.instruction = "-"
          break
        case "BRZ":
          alu.instruction = "="
          alu.input1 = 0
          break
        case "BRP":
          alu.instruction = ">="
          alu.input1 = 0
      }
  
    }
  
    sendLDA() { // memory load
      memory.mode = "l"
    }
  
    sendSTA() { // memory store
      memory.mode = "r"
    }
  
    copyAddressTo(reg1, reg2) { // copying address only from reg1 to reg2
      let address = reg1.value - floor(reg1.value / 100) * 100 // current last 2 digits of the memory location
      reg2.value = address
    }
  
    clear() { // clear CU
      super.clear()
      this.value = "..."
      this.instructionFound = null
    }
  }