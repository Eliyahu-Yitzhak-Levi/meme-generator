'use strict'

console.log('service is connected (meme-editor-service)');





var gImgs = [
    { id: 1, url: 'meme-imgs/meme-imgs (various aspect ratios)/001.jpg', keywords: ['happy', 'human'] },
    { id: 2, url: 'meme-imgs/meme-imgs (various aspect ratios)/002.jpg', keywords: ['sarcastic', 'funny', 'human'] },
    { id: 3, url: 'meme-imgs/meme-imgs (various aspect ratios)/003.jpg', keywords: ['happy', 'animal'] },
    { id: 4, url: 'meme-imgs/meme-imgs (various aspect ratios)/004.jpg', keywords: ['funny', 'human'] },
    { id: 5, url: 'meme-imgs/meme-imgs (various aspect ratios)/005.jpg', keywords: ['happy', 'human'] },
    { id: 6, url: 'meme-imgs/meme-imgs (various aspect ratios)/006.jpg', keywords: ['happy', 'human', 'animal'] },
    { id: 7, url: 'meme-imgs/meme-imgs (various aspect ratios)/007.jpg', keywords: ['happy', 'animal'] },
    { id: 8, url: 'meme-imgs/meme-imgs (various aspect ratios)/008.jpg', keywords: ['happy', 'human'] },
    { id: 9, url: 'meme-imgs/meme-imgs (various aspect ratios)/009.jpg', keywords: ['sarcastic', 'human'] },
    { id: 10, url: 'meme-imgs/meme-imgs (various aspect ratios)/010.jpg', keywords: ['funny', 'human'] },
    { id: 11, url: 'meme-imgs/meme-imgs (various aspect ratios)/011.jpg', keywords: ['sarcastic', 'human'] },
    { id: 12, url: 'meme-imgs/meme-imgs (various aspect ratios)/012.jpg', keywords: ['funny', 'human'] },
    { id: 13, url: 'meme-imgs/meme-imgs (various aspect ratios)/013.jpg', keywords: ['funny', 'human'] },
    { id: 14, url: 'meme-imgs/meme-imgs (various aspect ratios)/014.jpg', keywords: ['sarcastic', 'funny', 'human'] },
    { id: 15, url: 'meme-imgs/meme-imgs (various aspect ratios)/015.jpg', keywords: ['funny', 'human'] },
    { id: 16, url: 'meme-imgs/meme-imgs (various aspect ratios)/016.jpg', keywords: ['funny', 'animal'] },
    { id: 17, url: 'meme-imgs/meme-imgs (various aspect ratios)/017.jpg', keywords: ['funny', 'human'] },
    { id: 18, url: 'meme-imgs/meme-imgs (various aspect ratios)/018.jpg', keywords: ['funnny', 'human'] },
    { id: 19, url: 'meme-imgs/meme-imgs (various aspect ratios)/019.jpg', keywords: ['sarcastic', 'human'] },
    { id: 20, url: 'meme-imgs/meme-imgs (various aspect ratios)/020.jpg', keywords: ['funny', 'human'] },
    { id: 21, url: 'meme-imgs/meme-imgs (various aspect ratios)/021.jpg', keywords: ['funny', 'human'] },
    { id: 22, url: 'meme-imgs/meme-imgs (various aspect ratios)/022.jpg', keywords: ['funny', 'human'] },
    { id: 23, url: 'meme-imgs/meme-imgs (various aspect ratios)/023.jpg', keywords: ['funny', 'human'] },
    { id: 24, url: 'meme-imgs/meme-imgs (various aspect ratios)/024.jpg', keywords: ['sarcastic', 'funny', 'human'] },
    { id: 25, url: 'meme-imgs/meme-imgs (various aspect ratios)/025.jpg', keywords: ['sarcastic', 'funny'] },

]



var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    numOfLines: 0,
    lines: [
        {
            txt: 'Add text here',
            size: 20,
            font: 'Arial',
            color: 'black',
            fillColor: '',
            xLineStart: 50,
            yLineStart: 50,
            isDrag: false,
        }

    ]
}


function newLine(newTxt, newSize, newColor, newXLineStart, newYLineStart,) {
    return {
        txt: newTxt,
        size: newSize,
        color: newColor,
        xLineStart: newXLineStart,
        yLineStart: newYLineStart,
    }
}


var gKeywordSearchCountMap = { 'funny': 0, 'sarcastic': 0, 'human': 0, 'animal': 0, 'happy': 0, 'crazy': 0, 'sad': 0, }

function getMeme() {
    return gMeme
}


function updateMemeTxt(imgId, newTxt) { // updates the text of that meme
    console.log('imgId is', imgId)
    console.log('the text is', newTxt)

    gMeme.selectedImgId = imgId

    console.log('selectedImgId is', gMeme.selectedImgId)

    gMeme.lines[0].txt = newTxt

    console.log('gMeme.lines[0].txt is :', gMeme.lines[0].txt)
}


function getImgId() {
    // Use the find method to search for the image with the selected ID
    const img = gImgs.find(img => img.id === gMeme.selectedImgId)

    return img // Return the found image object
}

function moveMemeLine(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].xLineStart += dx
    gMeme.lines[gMeme.selectedLineIdx].yLineStart += dy
}
