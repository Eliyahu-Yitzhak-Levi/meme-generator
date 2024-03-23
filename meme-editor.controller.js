'use strict'

console.log('controller is connected (index-js)')

let gElCanvas
let gCtx
let gCurrImg
let gCurrImgId
let gStartPos


const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

function onInit() {

    // console.log(gImgs)
    gElCanvas = document.querySelector('.canvas-meme-editor')
    gCtx = gElCanvas.getContext('2d')


    var elEditorSec = document.querySelector('.editor-section')
    elEditorSec.style.display = 'grid'

    resizeCanvas()

    window.addEventListener('resize', () => resizeCanvas())
    renderMemeGallery()


    // event-listeners-setup
    gElCanvas.addEventListener('click', handleCanvasClick)
    onSetFontSize()
    onSetFont()
    onSetTextLocation()
    onSetTextColors()
    // event-listeners-setup dragging
    addMouseListeners()

}




function resetPage() {
    let elUploadBox = document.querySelector('.upload-box')
    elUploadBox.style.display = 'flex'

    let elImgSection = document.querySelector('.img-section')
    elImgSection.style.display = 'grid'

    let elContainer = document.querySelector('.container')
    elContainer.style.display = 'flex'
}

function renderMemeGallery() {
    let elImgSection = document.querySelector('.img-section')

    let strHtmls = '' // Initialize an empty string to store the HTML

    gImgs.forEach(img => {
        // Concatenate each image HTML to the string
        strHtmls += `
            <div class="img-container">
                <img src="${img.url}" alt="" data-id="${img.id}" onclick="renderMeme(this , ${img.id})">
            </div>`
    })

    elImgSection.innerHTML = strHtmls // Set the HTML content of the container
}




function renderMeme(elImage, imgId) {
    console.log(elImage, imgId);
    gCurrImgId = imgId


    gCurrImg = elImage

    let elUploadBox = document.querySelector('.upload-box')
    elUploadBox.style.display = 'none'

    let elImgSection = document.querySelector('.img-section')
    elImgSection.style.display = 'none'

    let elContainer = document.querySelector('.container')
    elContainer.style.display = 'none'


    coverCanvasWithImg(elImage)
    drawText()


}

function coverCanvasWithImg(elImage) {
    gElCanvas.height = (elImage.naturalHeight / elImage.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImage, 0, 0, gElCanvas.width, gElCanvas.height)
}


function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth

    let tempCurrImg = gCurrImg

    if (tempCurrImg) {
        coverCanvasWithImg(tempCurrImg)
    }
}

function drawText() {
    // Clear the canvas before drawing
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    coverCanvasWithImg(gCurrImg)

    // Get the text from the contenteditable span
    const elEditorText = document.querySelector('.editor-txt').innerText.trim()


    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0

    // Update the text for each line in gMeme.lines
    gMeme.lines.forEach((line, index) => {

        if (index === gMeme.selectedLineIdx) {
            line.txt = elEditorText // Update the text property only for the selected line

            // Measure the width and height of the text
            const textMetrics = gCtx.measureText(line.txt)
            const textWidth = textMetrics.width
            const textHeight = parseInt(gCtx.font)

            // Update the border dimensions based on the text size
            const borderWidth = textWidth + 220
            const borderHeight = textHeight + 10

            // Set the border style
            gCtx.strokeStyle = 'red' // Border color
            gCtx.lineWidth = 2 // Border width

            // Draw the border around the text
            gCtx.strokeRect(line.xLineStart - 10, line.yLineStart - textHeight - 10, borderWidth, borderHeight + 10)
        }

        // Set the font size and color for the current line
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.strokeStyle = line.color
        gCtx.fillStyle = line.fillColor

        // Draw the text at the specified position
        gCtx.fillText(line.txt, line.xLineStart, line.yLineStart)
        gCtx.strokeText(line.txt, line.xLineStart, line.yLineStart)
    })
}


function onAddTxtLine() {
    gMeme.numOfLines++
    let line = newLine('Add text here', 20, 'black', gMeme.lines[gMeme.numOfLines - 1].xLineStart, gMeme.lines[gMeme.numOfLines - 1].yLineStart + 50)
    gMeme.lines.push(line)
    console.log(gMeme.lines)
    drawText()
}

function onNextTxtLine() {
    gMeme.selectedLineIdx++
    drawText()
}


function onDeleteTxtLine() {
    if (gMeme.numOfLines === 0) return

    // Find the index of the selected line in the lines array
    const indexToRemove = gMeme.selectedLineIdx

    // Remove the line from the lines array
    gMeme.lines.splice(indexToRemove, 1)

    if (gMeme.numOfLines === 0) return
    else gMeme.numOfLines--
    drawText()
}

function handleCanvasClick(event) {
    // Get the mouse coordinates relative to the canvas
    const canvasBounds = gElCanvas.getBoundingClientRect()
    const mouseX = event.clientX - canvasBounds.left
    const mouseY = event.clientY - canvasBounds.top

    // Check if the click was within any of the lines
    gMeme.lines.forEach((line, index) => {
        const textMetrics = gCtx.measureText(line.txt)
        const textWidth = textMetrics.width
        const textHeight = parseInt(gCtx.font)
        const lineX = line.xLineStart
        const lineY = line.yLineStart - textHeight // Adjust for text height

        // Check if the click is within the bounding box of this line
        if (
            mouseX >= lineX && mouseX <= lineX + textWidth + 50 && // Add padding to width
            mouseY >= lineY && mouseY <= lineY + textHeight + 20 // Add padding to height
        ) {
            // Handle click for this line
            const elEditorText = document.querySelector('.editor-txt').innerText.trim()
            gMeme.selectedLineIdx = index
            gMeme.lines[gMeme.selectedLineIdx].txt = elEditorText
            gMeme.lines[gMeme.selectedLineIdx].isDrag = true
            onMove(event)
            drawText() // FUNCTION WORKS, SELECTS THE WANTED LINE TO EDIT ON THE CANVAS

        }
    })
}





function onSetFontSize() {

    let elButtons = document.querySelectorAll('.btn-font');

    elButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check which button was clicked based on its class
            if (button.classList.contains('plus')) {
                // Handle click on the plus button
                console.log('Plus button clicked')
                gMeme.lines[gMeme.selectedLineIdx].size += 5
                console.log(gMeme.selectedLineIdx);
                console.log(gMeme.lines[gMeme.selectedLineIdx].size);
                drawText()

            } else if (button.classList.contains('minus')) {
                // Handle click on the minus button
                console.log('Minus button clicked')
                gMeme.lines[gMeme.selectedLineIdx].size -= 5
                drawText()
            }
        })
    })
}


function onSetTextLocation() {
    const elButtons = document.querySelectorAll('.align')

    elButtons.forEach(button => {
        button.addEventListener('click', () => {
            const alignment = button.dataset.alignment // Get the alignment from data attribute
            const selectedLine = gMeme.lines[gMeme.selectedLineIdx]

            switch (alignment) {
                case 'left':
                    // Set the xLineStart to align left
                    selectedLine.xLineStart = 10
                    break
                case 'right':
                    // Calculate xLineStart to align right
                    var textWidth = gCtx.measureText(selectedLine.txt).width
                    selectedLine.xLineStart = gElCanvas.width - textWidth - 50
                    break
                case 'center':
                    // Calculate xLineStart to align center
                    const centerX = gElCanvas.width / 2
                    var textWidth = gCtx.measureText(selectedLine.txt).width
                    selectedLine.xLineStart = centerX - (textWidth / 2)
                    break
                default:
                    break
            }

            drawText() // Redraw the canvas with the updated text alignment
        })
    })
}

function onSetFont() {
    let elFont = document.querySelector('.font-select')
    elFont.addEventListener('change', () => {
        let selectedFont = elFont.value

        gMeme.lines[gMeme.selectedLineIdx].font = selectedFont
        drawText()
    })
}


// another idea.. adding a specific class to these elements and using querselector all to 
// add event listerners to all of them using forEach loop
function onSetTextColors() {
    // Stroke color button and input
    const strokeColorButton = document.querySelector('.stroke-color')
    const strokeColorPicker = document.querySelector('.stroke-color-picker-input')

    strokeColorButton.addEventListener('click', () => {
        strokeColorPicker.click() // Simulate a click on the hidden color picker input
    })

    strokeColorPicker.addEventListener('change', () => {
        const selectedStrokeColor = strokeColorPicker.value
        console.log('Selected stroke color:', selectedStrokeColor)
        // Use the selectedStrokeColor value for further processing (e.g., updating canvas stroke color)
        gMeme.lines[gMeme.selectedLineIdx].color = selectedStrokeColor
        drawText()
    })

    // Fill color button and input
    const fillColorButton = document.querySelector('.fill-color')
    const fillColorPicker = document.querySelector('.fill-color-picker-input')

    fillColorButton.addEventListener('click', () => {
        fillColorPicker.click() // Simulate a click on the hidden color picker input
    })

    fillColorPicker.addEventListener('change', () => {
        const selectedFillColor = fillColorPicker.value
        console.log('Selected fill color:', selectedFillColor)
        // Use the selectedFillColor value for further processing (e.g., updating canvas fill color)
        gMeme.lines[gMeme.selectedLineIdx].fillColor = selectedFillColor
        drawText()
    })
}



function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}


function onDown(ev) {

    // Save the position we started from...
    // Get the event position from mouse or touch
    gStartPos = getEvPos(ev)


}

function onMove(ev) {
    console.log('in onMove');

    if (!gMeme.lines[gMeme.selectedLineIdx].isDrag) return

    const pos = getEvPos(ev)

    console.log(pos);
    // Calc the delta, the diff we moved
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y

    moveMemeLine(dx, dy)

    // Save the last pos, we remember where we`ve been and move accordingly
    gStartPos = pos

    // The canvas is rendered again after every move
    drawText()
}

function onUp() {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = false

}



function getEvPos(ev) {

    if (TOUCH_EVENTS.includes(ev.type)) {

        ev.preventDefault()         // Prevent triggering the mouse events
        ev = ev.changedTouches[0]   // Gets the first touch point

        // Calculate the touch position inside the canvas

        // ev.pageX = distance of touch position from the documents left edge
        // target.offsetLeft = offset of the elemnt's left side from the it's parent
        // target.clientLeft = width of the elemnt's left border

        return {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }

    } else {
        return {
            x: ev.offsetX,
            y: ev.offsetY,
        }
    }
}






















