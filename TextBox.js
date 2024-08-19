class TextBox {
  constructor(element, id) {
    this.textbox = element // p5 element
    this.textbox.id(id) // html id
    this.element = document.getElementById(id) // html element
  }
}