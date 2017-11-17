console.log('hi');
var FLOOR = 0;
var MINE = ' * ';
var gSize;
var gBoard;
var gIsTimeRun = false ;
var gState = {shownCount: 0, markedCount: 0};
console.log(gState);


//TODO: spacing, indentation

var levels =[5,10,15];

function setLevel (num){
    
   gSize = num;
    gBoard = createBoard(gSize);
    renderBoard();
    time();
}

// TODO: with other variables
var timingInterval;

function time(){
    if(gIsTimeRun){
        return;
    }
    var sec = 00;
    var elTime = document.querySelector('.time');
    timingInterval = setInterval(function(){
      sec += 1;  
        elTime.innerHTML = "Time :" + sec;
    },1000);
    gIsTimeRun = true;
}


function createBoard(size) {

    var board = [];
    for (var i=0; i<size; i++) {
        var row = [];
        for (var j=0; j<size; j++) {
            row.push(FLOOR);
        }
        board.push(row);
    }
    function setMine(size) { // TODO: move out of function
        for(var i = 0; i<size; i++){

            var mineI =  parseInt(Math.random()*size);
            //console.log(mineI);
            var mineJ =  parseInt(Math.random()*size);
            console.log(mineI,mineJ);
            board[mineI][mineJ] = MINE;
        }
    }
    setMine(size);
    return board;
}

function renderBoard() {
    var elTable = document.querySelector('.board');
    var sHTML = '';

    for (var i = 0; i < gBoard.length; i++) {
        sHTML +='<tr>';

        for (var j = 0; j < gBoard[i].length; j++) {
            sHTML +='<td id ="cell-' + i + ',' + j +'"'+'oncontextmenu="cellMarked(this);return false;"'+
           'onclick="cellClicked(this,' + i + ',' + j +')"class=td></td>'; // remove class td
        }
        sHTML +='<tr/>';
    }
    elTable.innerHTML = sHTML;
}


function cellClicked(elCell, i, j) {
    if (elCell.classList.contains('marked')) return; // TODO: check also for .shown

    var numOfNeg = countNegs(i, j); // todo: move to setLevel()

    if (gBoard[i][j] === MINE) {
        gameOver(gSize);
        return;
    }

    // TODO: move all duplicate lines out of if..else
    if (numOfNeg > 0 && gBoard[i][j] === FLOOR) {
        if (elCell.classList.contains('shown')) return;
        elCell.innerHTML = numOfNeg;
        elCell.classList.add('shown');
        gState.shownCount++;
        nextLevel(gSize);
        //console.log(gState);

    }
    if (numOfNeg === '' ) { // TODO: change to 0
        if (elCell.classList.contains('shown')) return;
        elCell.classList.add('shown');
        gState.shownCount++;
        expandShown(i, j);
        nextLevel(gSize); // TODO: split to checkWin(), setLevel
        //console.log(gState);
    }
}


function cellMarked(elCell) {
    if (elCell.classList.contains('shown'))return;


    if (elCell.classList.contains('marked')) {
        gState.markedCount--;
        elCell.classList.remove('marked');
        //gState.markedCount--;
        console.log(gState.markedCount);
    }
    else if (gSize > gState.markedCount) {
        console.log(gState);
        elCell.classList.add('marked');
        gState.markedCount++;
        nextLevel(gSize);
    }

}


function countNegs(i, j) {
    var negsCount ='';
    for (var ii = -1; ii <= 1; ii++) {
        for (var jj = -1; jj <= 1; jj++) {

            var currI = i + ii;
            var currJ = j + jj;

            if (ii === 0 && jj === 0) continue;
            if (currI < 0 || currI >= gBoard.length) continue;
            if (currJ < 0 || currJ >= gBoard[0].length) continue;

            if (gBoard[currI][currJ] === MINE) {
                negsCount++;
            }
        }
    }

    return negsCount;
}

function expandShown(i, j) {
    for (var ii = -2; ii <= 2; ii++) {
        for (var jj = -2; jj <= 2; jj++) {

            var currI = i + ii;
            var currJ = j + jj;

            var currEl = document.getElementById('cell-' + currI + ',' + currJ + '');

            if (ii === 0 && jj === 0) continue;
            if (currI < 0 || currI >= gBoard.length) continue;
            if (currJ < 0 || currJ >= gBoard[0].length) continue;

            if ((gBoard[currI][currJ] !== MINE) && (!currEl.classList.contains('marked'))){

                currEl.innerHTML = (countNegs(currI, currJ)); // TODO: use gBoard

                if (!currEl.classList.contains('shown')){
                    
                    currEl.classList.add('shown');
                    gState.shownCount++;
                }
                console.log(gState);

            }
        }
    }

}

function gameOver(size){
    alert('game over'); // TODO: change from alert 
    clearInterval(timingInterval);
    gIsTimeRun = false;
    gBoard = createBoard(gSize);
    renderBoard();
    console.log(gBoard);
    gState.shownCount = 0;
    gState.markedCount = 0;
}

function nextLevel(size){
    if((gState.shownCount) + (gState.markedCount) === size*size){
        alert('well done');
        gSize += 2;
        // TODO: use setLevel.
        gBoard = createBoard(gSize);
        renderBoard();
        gState.shownCount = 0;
        gState.markedCount = 0;
    }
}


