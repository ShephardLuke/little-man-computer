const instructionList = [
    ["ADD", 1, true, addCmd], // add
    ["SUB", 2, true, subCmd], // subtract
    ["STA", 3, true, staCmd], // store
    ["LDA", 5, true, ldaCmd], // load
    ["BRA", 6, true, braCmd], // branch always
    ["BRZ", 7, true, brzCmd], // branch if zero
    ["BRP", 8, true, brpCmd], // branch if positive
    ["INP", 901, false, inpCmd], // input
    ["OUT", 902, false, outCmd], // output
    ["IPC", 911, false, ipcCmd], // input character
    ["OTC", 912, false, otcCmd], // output character
    ["HLT", 0, false, hltCmd], // halt
  ]
  
  let cycles = 0
  let pointers = []
  let running = false
  let waitingForInput = [false, null]
  
  let animCon = new AnimationController()
  
  let stages = [fetchInstruction, decodeInstruction, executeInstruction] // so the program knows the stages in order for animation running
  let currentStage = -1 // what part of the stages the program is currently on, -1 = not running
  
  function makePointers() {
    pointers = []
  
    let rows = codeInput.element.value.toUpperCase().split("\n") // splits everything into a list of rows
  
    for (let r = 0; r < min(rows.length, 100); r++) {
  
      let rowWords = rows[r].split(" ") // split row into list of words
  
      while (rowWords.includes(" ")) { // remove extra spaces
        rowWords.splice(rowWords.indexOf(" "), 1)
      }
  
      let isVar = true
  
      if (rowWords[0] === "DAT") { // if any instruction is at the beginning then there is no variable
        isVar = false
      }
  
      for (let instruction of instructionList) {
        if (rowWords[0] === instruction[0]) {
          isVar = false
        }
      }
  
      if (!isVar) {
        continue
      }
  
      pointers.push([rowWords[0], r])
  
    }
  }
  
  function addZeros(num) {
    let str = String(num)
    let max = 3
    if (str[0] === "-") {
      max = 4
    }
    while (str.length < max) {
      if (str[0] === "-") {
        str = str[0] + "0" + str.slice(1)
      } else {
        str = "0" + str // pad with 0s so all numbers are 3 digits 
      }
    }
    return str
  }
  
  function assembleCode() { // when assemble button is pressed 
    resetProgram()
    memory.clear()
    makePointers()
  
    let rows = codeInput.element.value.toUpperCase().split("\n") // splits everything into a list of rows
  
    for (let r = 0; r < min(rows.length, 100); r++) { // for each row
      let rowWords = rows[r].split(" ") // split row into list of words
  
      while (rowWords.includes(" ")) { // remove extra spaces
        rowWords.splice(rowWords.indexOf(" "), 1)
      }
  
      if (rowWords.includes("DAT")) { // check for DAT instruction
        let value = 0 // value to put into memory, will stay 0 if no digit entered
        if (rowWords.indexOf("DAT") != rowWords.length - 1) { // check for digits
          value = parseInt(rowWords[rowWords.indexOf("DAT") + 1]) // overwrite value with digits
        }
        memory.value[r] = value // put into memory
        continue // skips the code next and goes to the next row
      }
  
      for (let instruction of instructionList) { // loop through every possible instruction
        if (rowWords.includes(instruction[0])) { // if that instruction is in the row 
  
          if (instruction[2]) { // requires address
            let address
            if (rowWords.indexOf(instruction[0]) === rowWords.length - 1) { // is the instuction at the end of the list? (no address given)
              address = "00"
            } else {
              address = rowWords[rowWords.indexOf(instruction[0]) + 1] // address is always after instruction
            }
  
            if (isNaN(address)) { // is the address not a number 
              for (let pointer of pointers) { // check if it is a variable
                if (address === pointer[0]) {
                  address = pointer[1] // change address to pointer's address
                }
              }
            }
  
            address = address.toString()
            while (address.length < 2) {
              address = "0" + address
            }
            memory.value[r] = parseInt(instruction[1] + address)
            break
          } else {
            memory.value[r] = instruction[1] // add 3 digit value to the memory location
            break
          }
  
        }
      }
  
    }
    memory.backup = structuredClone(memory.value)
    displayAssembledCode(memory.value)
  }
  
  function runCode() {
    resetProgram()
    memory.value = structuredClone(memory.backup)
    running = true
    cycles = 0
    currentStage = -1
    cu.context = "Running program..."
    nextStage()
  }
  
  function nextStage() {
    currentStage++
    if (currentStage === stages.length) {
      currentStage = 0
      cycles++
    }
    if (cycles % 300 === 0) {
      this.current = setTimeout(function() { // wait before adding value
        stages[currentStage]()
      }, 0)
      return
    }
    if (!waitingForInput[0] && running) {
      stages[currentStage]()
    }
  }
  
  
  function resetRegisters() {
    for (let i = 1; i < registers.length; i++) {
      registers[i].clear()
    }
  }
  
  function fetchInstruction() {
    if (pc.value === 100) { // make sure pc cant find address 100 as it does not exist
      hltCmd()
      return
    }
  
    let fetch = [
      [true, cu.copyRegister, pc, mar], // copy contents of pc to mar
  
      [false, pc.increment, cu, pc],  // increment pc
  
      [true, cu.sendLDA, mar, memory],
  
      [true, memory.load, memory, mdr],
  
      [true, cu.copyRegister, mdr, cir] // copy mdr to cir
    ]
  
    animCon.addAnimations(fetch)
  
  }
  
  function decodeInstruction() {
    let decode = [
      [false, cu.findInstruction.bind(cu), null, null]
    ]
  
    animCon.addAnimations(decode)
  
  }
  
  
  function executeInstruction() {
    cu.instructionFound[3]()
  }
  
  function resetProgram() {
    clearInputBox()
    resetRegisters()
    clearOutput() // Clears the contents of the output box
    animCon.reset()
    running = false
    waitingForInput = [false, null]
    cu.context = "No program running."
  }
  
  function inputValue(value) { // when the input button is pressed
    if (waitingForInput[0]) { // waiting for the user to input
      waitingForInput[1](value) // run the instruction if its waiting for user
      clearInputBox() // remove user's text to show its been taken
    }
  }
  
  
  function addCmd() { // adds
    let ins = [
      [true, cu.copyAddressTo, cir, mar], // copy cir to mar
      [true, cu.sendLDA, mar, memory],  // send load signal with mar value going to memory
      [true, memory.load, memory, mdr], // send memory value to mdr
      [true, alu.updateInput0.bind(alu), acc, alu],  // add acc value to alu1
      [true, alu.updateInput1.bind(alu), mdr, alu], // add mdr value to alu2
      [false, cu.sendToALU, cu, alu], // send add to alu
      [false, alu.calculate.bind(alu), cu, alu], // calculate value
      [true, cu.copyRegister, alu, acc] // copy alu back to acc
    ]
    animCon.addAnimations(ins)
  }
  
  function subCmd() { // subtracts
    let ins = [
      [true, cu.copyAddressTo, cir, mar], // copy cir to mar
      [true, cu.sendLDA, mar, memory],  // send load signal with mar value going to memory
      [true, memory.load, memory, mdr], // send memory value to mdr
      [true, alu.updateInput0.bind(alu), acc, alu],  // add acc value to alu1
      [true, alu.updateInput1.bind(alu), mdr, alu], // add mdr value to alu2
      [false, cu.sendToALU, cu, alu], // send add to alu
      [false, alu.calculate.bind(alu), cu, alu], // calculate value
      [true, cu.copyRegister, alu, acc] // copy alu back to acc
    ]
    animCon.addAnimations(ins)
  }
  
  function staCmd() { // stores
    let ins = [
      [true, cu.copyAddressTo, cir, mar],
      [true, cu.copyRegister, acc, mdr],
      [true, cu.sendSTA, mar, memory],
      [true, memory.store, mdr, memory]
    ]
    animCon.addAnimations(ins)
  }
  
  function ldaCmd() { // loads
    let ins = [
      [true, cu.copyAddressTo, cir, mar], // copy cir to mar
      [true, cu.sendLDA, mar, memory],  // send load signal with mar value going to memory
      [true, memory.load, memory, mdr], // send memory value to acc
      [true, cu.copyRegister, mdr, acc]
    ]
    animCon.addAnimations(ins)
  }
  
  function braCmd() { // branch always
    let ins = [
      [true, cu.copyAddressTo, cir, pc], // copy cir to pc
    ]
    animCon.addAnimations(ins)
  }
  
  function brzCmd() { // branch if zero
    let ins = [
      [true, alu.updateInput0.bind(alu), acc, alu],  // add acc value to alu1
      [false, cu.sendToALU, null, null], // send add to alu
      [false, alu.calculate.bind(alu), null, null]
    ]
    animCon.addAnimations(ins)
  }
  
  function brpCmd() { // branch if positive
    let ins = [
      [true, alu.updateInput0.bind(alu), acc, alu],  // add acc value to alu1
      [false, cu.sendToALU, null, null], // send add to alu
      [false, alu.calculate.bind(alu), null, null]
    ]
    animCon.addAnimations(ins)
  }
  
  function inpCmd(value = "") { // input
    if (!waitingForInput[0]) { // if not waiting for an input
      waitingForInput = [true, inpCmd] // wait for input
      cu.context = "1 - 3 digit input required."
      return
    }
    if (value === "") {
      return
    }
    inputBox.value = parseInt(inputBox.element.value)
    waitingForInput = [false, null]
    let ins = [
      [true, cu.copyRegister, inputBox, acc],  // add acc value to alu1
    ]
    animCon.addAnimations(ins)
  }
  
  function outCmd() { // output
    let ins = [
      [true, outputValue, acc, outputtedCode]
    ]
    animCon.addAnimations(ins)
  }
  
  function ipcCmd(value = "") { // input character
    if (!waitingForInput[0]) { // if not waiting for an input
      waitingForInput = [true, ipcCmd] // wait for input
      cu.context = "1 character input required."
      return
    }
    if (value === "") {
      return
    }
    inputBox.value = inputBox.element.value.charCodeAt(0)
    waitingForInput = [false, null]
    let ins = [
      [true, cu.copyRegister, inputBox, acc],  // add acc value to alu1
    ]
    animCon.addAnimations(ins)
  }
  
  function otcCmd() { // output character
    let ins = [
      [true, outputValue, acc, outputtedCode]
    ]
    animCon.addAnimations(ins)
  }
  
  function hltCmd() { // halt
    running = false
    cu.context = "Program halted."
  }