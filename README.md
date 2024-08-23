# LMC (Little Man Computer)
### https://little-man-computer.shephardluke.co.uk/
### 2023 A Level Computer Science NEA (Result A*)
Made using [p5.js](https://p5js.org/)

Type code into the big textarea, press assemble to turn the words into numeric codes and then press run to watch the program run with animations showing the [Fetch-Decode-Execute](https://en.wikipedia.org/wiki/Instruction_cycle) cycle step by step. 
The slider under the run button can be used to adjust the animation speed, the slider at max disables animations for an instant run.
Code can be saved and loaded in the form of TXT files using the top buttons, and program input is at the bottom right in the textbox with the submit button.

# Instruction Set

|Numeric|Mnemonic|
|---|---|
|1xx|ADD|
|2xx|SUB|
|3xx|STA|
|5xx|LDA|
|6xx|BRA|
|7xx|BRZ|
|8xx|BRP|
|901|INP|
|902|OUT|
|000|HLT|
|XXX|DAT|

For more information check the LMC [Wikipedia](https://en.wikipedia.org/wiki/Little_man_computer) page.
