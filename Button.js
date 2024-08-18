class Button {
    constructor(element, id, onClick) {
      this.button = element
      this.button.id(id)
      this.button.mousePressed(onClick) // run the functon when the mouse presses the button
      this.element = document.getElementById(id)
    }
  }