var IMAGE_sizes = 1200;
var sizes = 3;

var puzzArray = [];
var moveArray = [];

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var start = new Date();

function up(pos) {
    var newPos = [];
    newPos[0] = pos[0] - 1;
    newPos[1] = pos[1];
    return newPos;
}

function down(pos) {
    var newPos = [];
    newPos[0] = pos[0] + 1;
    newPos[1] = pos[1];
    return newPos;
}

function left(pos) {
    var newPos = [];
    newPos[0] = pos[0];
    newPos[1] = pos[1] - 1;
    return newPos;
}

function right(pos) {
    var newPos = [];
    newPos[0] = pos[0];
    newPos[1] = pos[1] + 1;
    return newPos;
}

var moveFuncs = [up, down, left, right];

function createBoard() {
    puzzArray = [];
    var image = document.getElementById("backgrounds").value + '.jpg';
    sizes = document.getElementById("sizes").value;

    IMAGE_sizes = 100 * sizes;

    var stepsizes = IMAGE_sizes / sizes;

    var innerHTML = "";
    var board = document.getElementById("board");
    board.style.width = IMAGE_sizes + "px";
    board.style.height = IMAGE_sizes + "px";
    board.style.backgroundsizes = IMAGE_sizes + "px";
    var titlesizes = stepsizes - 4;
    var idIndex = 1;
    for (var i = 0; i < sizes; i++) {
        for (var j = 0; j < sizes; j++) {
            puzzArray[idIndex - 1] = idIndex;
			if (idIndex != sizes*sizes) {
            innerHTML += '<div id="tile-'+ idIndex +'" class="tile" style="'
            +'width:'+titlesizes+'px;'
            + ((idIndex != sizes * sizes) ? "background-image:url('"+image+"');" : "")
            +'height:'+titlesizes+'px;'
            +'line-height:'+titlesizes+'px;'
            +'background-position:'+ -1*j*stepsizes + 'px ' + -1*i*stepsizes + 'px;'
            +'background-size:' + IMAGE_sizes + 'px;'
            +'top:' + i*stepsizes + 'px;'
            +'left:' + j*stepsizes + 'px;'
            +'">'+ idIndex +'</div>';
            idIndex++;
			} else {
			innerHTML += '<div id="tile-'+ idIndex +'" class="tile" style="'
            +'width:'+titlesizes+'px;'
            + ((idIndex != sizes * sizes) ? "background-image:url('"+image+"');" : "")
            +'height:'+titlesizes+'px;'
            +'line-height:'+titlesizes+'px;'
            +'background-position:'+ -1*j*stepsizes + 'px ' + -1*i*stepsizes + 'px;'
            +'background-size:' + IMAGE_sizes + 'px;'
            +'top:' + i*stepsizes + 'px;'
            +'left:' + j*stepsizes + 'px;'
            +'"></div>';
			}
        }
    }
    board.innerHTML = innerHTML;
}

function OpositeMove(action) {
    switch (action) {
        case UP : return DOWN;
        case LEFT : return RIGHT;
        case DOWN : return UP;
        case RIGHT : return LEFT;
    }
}

var totalMove = 0;

function shuffleBoard() {
	document.getElementById("solve").disabled = false; 
	document.getElementById("newgame").disabled = false;
	document.getElementById("shuffle").disabled = true;
	document.getElementById("sizes").disabled = true;
	document.getElementById("backgrounds").disabled = true;
	
    var steps = getRandomInt(puzzArray.length + 3, puzzArray.length * 3);
    moveArray = [];
    for (var i = 0; i < steps; i++) {
        var blankTileIndex = puzzArray.indexOf(sizes * sizes);
        var pos2D = getPosIn2D(blankTileIndex);
        var canMoves = canMove(pos2D);
        var move = 0;
        do {
            move = canMoves[getRandomInt(0, canMoves.length - 1)];
        } while (move == OpositeMove(moveArray[moveArray.length - 1]))
        moveArray.push(move);
        var newIndex = getIndexIn1D(moveFuncs[move](pos2D));
        swapPos(blankTileIndex, newIndex);
    }
	totalMove = moveArray.length - 1;
    displayBoard();
}

var solveMoveIndex = 0;
var solveInterval;

function solveBoard() {
	document.getElementById("solve").disabled = true;
	document.getElementById("newgame").disabled = true;
	
    solveMoveIndex = moveArray.length - 1;
    solveInterval = setInterval(() => {
        if (solveMoveIndex == 0) {
            clearInterval(solveInterval);
        }
        var blankTileIndex = puzzArray.indexOf(sizes * sizes);
        var pos2D = getPosIn2D(blankTileIndex);
        var move = OpositeMove(moveArray[solveMoveIndex]);
        var newIndex = getIndexIn1D(moveFuncs[move](pos2D));
        swapPos(blankTileIndex, newIndex);
        solveMoveIndex--;
		checkWin(0);
    }, 500);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function swapPos(blankTileIndex, index2) {
    var titleArray = document.getElementsByClassName("tile");

    var titlePos1 = puzzArray[blankTileIndex] - 1;
    var titlePos2 = puzzArray[index2] - 1;

    var top = titleArray[titlePos1].style.top;
    var left = titleArray[titlePos1].style.left;

    titleArray[titlePos1].style.top = titleArray[titlePos2].style.top;
    titleArray[titlePos1].style.left = titleArray[titlePos2].style.left;

    titleArray[titlePos2].style.top = top;
    titleArray[titlePos2].style.left = left;

    var oldVl = puzzArray[blankTileIndex];
    puzzArray[blankTileIndex] = puzzArray[index2];
    puzzArray[index2] = oldVl;

    displayBoard();
	checkWin(1);
}

function getPosIn2D(index) {
    var pos = []
    pos.push(parseInt(index / sizes));
    pos.push(index % sizes);
    return pos;
}

function getIndexIn1D(pos) {
    return pos[0] * sizes + pos[1];
}

function canMove(pos) {
    var canMoves = [];
    for (var index = 0; index < moveFuncs.length; index ++) {
        var newPos = moveFuncs[index](pos);
        if (newPos[0] >= 0 && newPos[0] < sizes && newPos[1] >= 0 && newPos[1] < sizes) {
            canMoves.push(index);
        }
    }
    return canMoves;
}

var count = 0;

function displayBoard() {
    var titleArray = document.getElementsByClassName("tile");
    var indexOfBlank = puzzArray.indexOf(sizes * sizes);
    var blankPos2D = getPosIn2D(indexOfBlank);
    var canMoves = canMove(blankPos2D);
    var moveIndexs = [];
    
    for (var i = 0; i < canMoves.length; i++) {
        var pos2D = moveFuncs[canMoves[i]](blankPos2D);
        moveIndexs.push(getIndexIn1D(pos2D));
    }

    for (var i = 0; i < titleArray.length; i++) {
        var currentTile = document.getElementById("tile-" + puzzArray[i]);
        if (moveIndexs.indexOf(i) != -1){
            currentTile.classList.add("movablepiece");
            currentTile.onclick = function() {
				document.getElementById("solve").disabled = true;
                var indexOfBlank = puzzArray.indexOf(sizes * sizes);
                var index = puzzArray.indexOf(parseInt(this.innerHTML));
                swapPos(indexOfBlank, index);
				count++;
            }
        } else {
            currentTile.onclick = function() {
                return false;
            }
            currentTile.classList.remove("movablepiece");
        }
    }
}

function checkWin(typeWin) {
    var won = true;
    for (var i = 0; i < sizes*sizes - 1; i++) {
        if (puzzArray[i] > puzzArray[i+1]) {
            won = false;
        }
    }
    if (won) {		
        var end = new Date();
        var elapsed = end - start;
        var seconds = Math.round(elapsed / 1000);
		var html = "";
		var au = "";
		
		if (typeWin == 0) { 
			html += "<img src='gameover.gif' alt='You lose' />";
			html += "<p>Total time to solve this puzzle: " + seconds + "s</p>";
			html += "<p>Best total moves to solve this puzzle: " + totalMove + "</p>";	
			au = 'gameover.mp3';
		} else if (typeWin == 1) {
			html += "<img src='win.gif' alt='You win' />";
			html += "<p>Total time to solve this puzzle: " + seconds + "s</p>";
			html += "<p>Total number of moves to solve this puzzle: " + count + "</p>";
			html += "<p>Best total moves to solve this puzzle: " + totalMove + "</p>";
			au = 'win.mp3';
		}

        document.getElementById("win").innerHTML = html;
		audio = new Audio(au);
		audio.play();
		
		setTimer = setInterval(function() {
            alert("Start New Game!");
			startNewGame();
			clearInterval(setTimer);
		}, 3000);
    }
}

function startNewGame() {
	location.reload();
}	