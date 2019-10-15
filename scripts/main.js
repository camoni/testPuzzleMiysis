/*document.ready(function () {*/
/*$("#canvas").hide();*/
// Rows x columns : 4 x 4
$("#start-puzzle").ready(function () {
    $("#main").hide();


    const PUZZLE_STRUCTURE = 4;
    const PUZZLE_HOVER_TINT = '#009900';
    var canvas;
    var ctx;
    var img;
// Puzzle (mouse position, puzzle position ...)
    var pieces, mouse;
    var currentPiece, currentDropPiece;
    var puzzleWidth, puzzleHeight, pieceWidth, pieceHeight;

// Instantiation of image and location
    img = new Image();
    img.src = "img/Puzzle.jpg";
    /*var isClicked = document.addEventListener("click",onPuzzleClick);*/

// Start
    init();
    initPuzzle();
    onImage();




// Drawn canvas and his context
    function setCanvas() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.height = puzzleHeight;
        canvas.width = puzzleWidth;
    }

    function init() {
        img = new Image();
        img.addEventListener('load', onImage, false);
        img.src = "img/Puzzle.jpg";
    }


    function onImage(e) {
        // Math.floor() => returns integer less or equal to a number
        pieceHeight = Math.floor(img.height / PUZZLE_STRUCTURE);
        pieceWidth = Math.floor(img.width / PUZZLE_STRUCTURE);
        puzzleHeight = pieceHeight * PUZZLE_STRUCTURE;
        puzzleWidth = pieceWidth * PUZZLE_STRUCTURE;
        setCanvas();
        initPuzzle();
    }

// Called everytime we want to start again
    function initPuzzle() {
        pieces = [];
        mouse = {x: 0, y: 0};
        currentPiece = null;
        currentDropPiece = null;
        console.log("width"+ puzzleWidth);
        console.log("height "+puzzleHeight);
        // drawImage(image, sourceImageX, sourceImageY, sourceWidth, sourceHeight, canvasDestinationX, canvasDestinationY, destinationWidth, destinationHeight);
        ctx.drawImage(img, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);

        buildPieces();
    }

    function buildPieces() {
        var i;
        var piece;
        var xPos = 0;
        var yPos = 0;
        for (i = 0; i < PUZZLE_STRUCTURE * PUZZLE_STRUCTURE; i++) {
            piece = {};
            piece.sx = xPos;
            piece.sy = yPos;
            pieces.push(piece);
            xPos += pieceWidth;
            if (xPos >= puzzleWidth) {
                xPos = 0;
                yPos += pieceHeight;
            }
        }
        document.onmousedown = shufflePuzzle;
    }

    function shufflePuzzle() {
        pieces = shuffleArray(pieces);
        ctx.clearRect(0,0, puzzleWidth, puzzleHeight);
        var i;
        var piece;
        var xPos = 0;
        var yPos = 0;
        for(i = 0; i < pieces.length; i++){
            piece = pieces[i];
            piece.xPos = xPos;
            piece.yPos = yPos;
            ctx.drawImage( img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
            ctx.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
            xPos += pieceWidth;
            if(xPos >= puzzleWidth){
                xPos = 0;
                yPos += pieceHeight;
            }
        }
        document.onmousedown = onPuzzleClick;

    }

// layer method => Mouse event
    function onPuzzleClick(e) {
        if (e.layerX || e.layerX === 0) {
            mouse.x = e.layerX - canvas.offsetLeft;
            mouse.y = e.layerY - canvas.offsetTop;
        } else if (e.offsetX || e.offsetX === 0) {
            mouse.x = e.offsetX - canvas.offsetLeft;
            mouse.y = e.offsetY - canvas.offsetTop;
        }
        currentPiece = checkPieceClicked();
        // If user click on a puzzle piece
        if (currentPiece !== null) {
            ctx.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);
            ctx.save();
            // Turn transparency on (current piece)
            ctx.globalAlpha = .9;
            ctx.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight);
            ctx.restore();
            document.onmousemove = updatePuzzle;
            document.onmouseup = pieceDropped;
        }
    }

    function shuffleArray(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
        return o;
    }

    function checkPieceClicked() {
        var piece;
        var i;
        for (i = 0; i < pieces.length; i++) {
            piece = pieces[i];
            if (mouse.x < piece.posX || mouse.x > (piece.posX + pieceWidth) || mouse.y < piece.y || mouse.y > (piece.posY + pieceHeight)) {
                // Piece not hit
            } else return piece;
        }
        return null;
    }

    function updatePuzzle(e) {
        // Reset value
        currentDropPiece = null;
        if (e.layerX || e.layerX === 0) {
            mouse.x = e.layerX - canvas.offsetLeft;
            mouse.y = e.layerY - canvas.offsetTop;
        } else if (e.offsetX || e.offsetX === 0) {
            mouse.x = e.offsetX - canvas.offsetLeft;
            mouse.y = e.offsetY - canvas.offsetTop;
        }
        ctx.clearRect(0, 0, puzzleWidth, puzzleHeight);
        var i;
        var piece;
        for (i = 0; i < pieces.length; i++) {
            piece = pieces[i];
            if (piece === currentPiece) {
                // !+ of "break" (switch loop), "continue" doesn't complete the loop completely
                continue;
            }
            ctx.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos);
            ctx.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);

            if (currentDropPiece == null) {
                if (mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < (piece.yPos + pieceHeight)) {
                    // Not over
                } else {
                    currentDropPiece = piece;
                    ctx.save();
                    ctx.globalAlpha = .4;
                    ctx.fillStyle = PUZZLE_HOVER_TINT;
                    ctx.fillRect(currentDropPiece.xPos, currentDropPiece.yPos, pieceWidth, pieceHeight);
                    ctx.restore();
                }
            }
        } // endfor
        ctx.save();
        ctx.globalAlpha = .6;
        ctx.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
        ctx.strokeRect(mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
    }


    function resetPuzzleAndCheckWin() {
        ctx.clearRect(0, 0, puzzleWidth, puzzleHeight);
        var gameWin = true;
        var i;
        var piece;
        for (i = 0; i < pieces.length; i++) {
            piece = pieces[i];
            ctx.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            ctx.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            if (piece.xPos !== piece.sx || piece.yPos !== piece.sy) {
                gameWin = false;
            }
        }
        if (gameWin) {
            setTimeout(gameOver, 500);
        }
    }


    function gameOver() {
        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        initPuzzle();
    }

    function pieceDropped(e) {
        document.onmousemove = null;
        document.onmouseup = null;
        if (currentDropPiece != null) {
            var tmp = {xPos: currentPiece.xPos, yPos: currentPiece.yPos};
            currentPiece.xPos = currentDropPiece.xPos;
            currentPiece.yPos = currentDropPiece.yPos;
            currentDropPiece.xPos = tmp.xPos;
            currentDropPiece.yPos = tmp.yPos;
        }
        resetPuzzleAndCheckWin();
    }
    /*})
    ;*/


});