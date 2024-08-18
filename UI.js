// global variables
let codeInput, compiledCode, inputBox, outputtedCode // textboxes
let titleBox, saveCodeButton, loadCodeButton //saving and loading buttons and the title textbox
let compileButton, runButton, inputSubmit // buttons
let registers, memory, cir, pc, mdr, mar, acc, cu, alu // memory, cu and alu are not registers in real life but in this simulation they act similar.

let speedSlider

function setupUI() {
  setupRegisters()
  setupMenuBar()
  setupLMC()
  sizeUI()
}


// all the UI setting up

function setupMenuBar() { // all the setup for the top bar
  titleBox = new TextBox(createElement("textarea"), "titleBox") // for inputting the title of the program
  titleBox.element.placeholder = "Title"
  titleBox.textbox.class("LMCBox") // each blue box

  saveCodeButton = new Button(createButton("Save Code"), "saveCodeButton", saveCode) // saving code
  saveCodeButton.button.class("optionButton") // different classes for making the css the same for the option buttons

  loadCodeButton = new Button(createButton("Load Code"), "loadCodeButton", loadCode) // loading code
  loadCodeButton.button.class("optionButton")

  compileButton = new Button(createButton("Compile"), "compileButton", compileCode) // compiles the instructions
  compileButton.button.class("menuButton")

  runButton = new Button(createButton("Run"), "runButton", runCode) // for actually running the programs
  runButton.button.class("menuButton")

  speedSlider = createSlider(10, 300, 35)
  speedSlider.id("speedSlider")
}

function setupLMC() { // all the boxes for typing and inputting
  codeInput = new TextBox(createElement("textarea"), "codeInput") // where the user types their code
  codeInput.element.placeholder = "Enter code here...";
  codeInput.textbox.class("LMCBox")

  compiledCode = new TextBox(createElement("textarea"), "compiledCode")
  compiledCode.element.readOnly = true;
  compiledCode.element.placeholder = "Compiled"
  compiledCode.textbox.class("LMCBox")

  inputBox = new TextBox(createElement("textarea"), "inputBox")
  inputBox.value = 0
  inputBox.element.placeholder = "Input"
  inputBox.textbox.class("LMCBox")
  inputBox.element.addEventListener("keypress", function(event) {
    if (event.keyCode == 13) {
      event.preventDefault()
      submitInput()
    }
  })

  outputtedCode = new TextBox(createElement("textarea"), "outputtedCode")
  outputtedCode.element.readOnly = true;
  outputtedCode.element.placeholder = "Output"
  outputtedCode.textbox.class("LMCBox")

  inputSubmit = new Button(createButton("Submit"), "inputSubmit", submitInput)
}

function setupRegisters() { // all the components the player cannot edit directly
  memory = new MemoryRegister("RAM")

  cir = new Register("CIR")
  pc = new Register("PC")
  mdr = new Register("MDR")
  mar = new Register("MAR")
  acc = new Register("ACC")

  cu = new CU("CU", "...")
  cu.instructionFound = null

  alu = new ALU("ALU", "000")

  registers = [memory, cir, pc, mdr, mar, acc, cu, alu]


}





function sizeUI() { // sizing all the UI elements upon setup and when the screen gets resized.
  // sets all the sizes of the HTML elements
  textFont("Monospace")
  textSize(windowWidth * 0.0125)

  sizeMenuBar()
  sizeLMC()
  sizeRegisters()
}




function sizeMenuBar() {

  titleBox.textbox.position(0, windowHeight / 75)

  saveCodeButton.button.position(titleBox.element.offsetWidth + windowWidth / 35, windowHeight / 75)
  loadCodeButton.button.position(titleBox.element.offsetWidth + windowWidth / 35 + saveCodeButton.element.offsetWidth + windowWidth / 75, windowHeight / 75)

  compileButton.button.position(windowWidth / 2 - windowWidth * 0.080, windowHeight / 75)

  runButton.button.position(windowWidth / 2 + windowWidth * 0.005, windowHeight / 75)

  speedSlider.position(windowWidth / 2 - windowWidth * 0.005, windowHeight / 75 + runButton.element.offsetHeight)
}

function sizeLMC() {

  codeInput.textbox.position(0, windowHeight / 12.5)

  compiledCode.textbox.position(codeInput.element.offsetWidth + windowWidth / 75, windowHeight / 12.5)

  outputtedCode.textbox.position(windowWidth - outputtedCode.element.offsetWidth - windowWidth * 0.02, windowHeight * 0.66)

  inputBox.textbox.position(windowWidth - outputtedCode.element.offsetWidth - inputBox.element.offsetWidth - inputSubmit.element.offsetWidth - windowWidth * 0.06, windowHeight * 0.93)

  inputSubmit.button.position(windowWidth - outputtedCode.element.offsetWidth - inputSubmit.element.offsetWidth - windowWidth * 0.05, windowHeight * 0.93)
  inputSubmit.button.size(AUTO, inputBox.element.offsetHeight)
}

function sizeRegisters() {
  memory.resize(windowWidth - windowWidth * 0.38 - windowWidth * 0.01, windowHeight / 12.5 + windowWidth * 0.01, windowWidth * 0.38, windowHeight * 0.55)

  let x = codeInput.element.offsetWidth + compiledCode.element.offsetWidth + windowWidth * 0.06
  let w = windowWidth * 0.05
  let h = windowHeight * 0.07
  pc.resize(x, windowHeight * 0.16, w, h)
  mar.resize(x, windowHeight * 0.24, w, h)
  mdr.resize(x, windowHeight * 0.32, w, h)
  cir.resize(x, windowHeight * 0.40, w, h)
  acc.resize(x, windowHeight * 0.48, w, h)

  cu.resize(x, windowHeight * 0.7, w, h * 1.5)
  alu.resize(x + windowWidth * 0.07, windowHeight * 0.7, w * 2, h * 2)

  animCon.resizePoints()
}




function displayCompiledCode(valueList) { // turns memory.value into a string to display
  let valueString = ""
  let rows = codeInput.element.value.toUpperCase().split("\n") // split codeInput into rows
  for (let i = 0; i < min(rows.length, 100); i++) { // loop for number of rows the user has
    let value = addZeros(valueList[i])
    valueString += value + "\n" // add to big string with new line
  }
  compiledCode.element.value = valueString // put on webpage
  memory.update()
}



function saveCode() { // saving the user's program (text from codeInput)
  let code = codeInput.element.value
  let blob = new Blob([code], { type: "text/plain;charset=utf-8" })
  let fileName = titleBox.element.value
  if (fileName === "") {
    fileName = "code"
  }
  saveAs(blob, fileName + ".txt")
}

function loadCode() { // when the load code button is pressed, the file open box pops up for the user to input their text file
  let input = document.createElement("input") // creating a file input
  input.type = "file"
  input.accept = ".txt"
  input.addEventListener("change", readFile) // read it when it is inputted

  input.click() // activate the element
}

function readFile(event) {
  file = event.target.files[0] // the file that the input got (event.target = input)

  let reader = new FileReader() // use a fileReader to read the contents of the file
  reader.readAsText(file) // reading the file

  reader.addEventListener("load", function() { // when it is read
    titleBox.element.value = file.name.slice(0, file.name.length - 4)
    codeInput.element.value = reader.result
  })
}



function outputValue() {
  let num
  if (cu.value === "OUT") {
    num = true
  } else if (cu.value === "OTC") {
    num = false
  }
  let toAdd = "\n" // \n = new line
  if (outputtedCode.element.value == "" || !num) { // if first line or a new line is not wanted
    toAdd = ""
  }

  if (num) {
    toAdd += acc.value
  } else {
    toAdd += String.fromCharCode(acc.value)
  }

  outputtedCode.element.value += toAdd // add to element
  outputtedCode.element.scrollTop = outputtedCode.element.scrollHeight
}



function clearOutput() { // clears the contents of the output box
  outputtedCode.element.value = ""
}

function submitInput() { // when the submit button is pressed
  inputValue(inputBox.element.value) // LMC.js
}

function clearInputBox() { // clears the contents of the input box
  inputBox.element.value = ""
}



function drawUI() { // for displaying UI elements from p5 functions at 60 fps
  noStroke()
  fill(10, 25, 48)
  rect(0, 0, windowWidth, windowHeight / 12.5)
  strokeWeight(1)
  fill(255)
  textAlign(LEFT, TOP)

  if (!debug) {
    animCon.drawPoints()
    animCon.updateAnimation()
  }



  for (let r of registers) {
    r.update()
  }

  if (debug) {
    animCon.drawPoints()
    animCon.updateAnimation()
  }

}



function windowResized() { // runs when the window size gets changed
  // resize UI
  resizeCanvas(windowWidth, windowHeight)
  sizeUI()
}