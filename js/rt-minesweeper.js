var VanillaMinsweeper = function(opt){
  this.tag = opt.tag || 'body';
  this.width = opt.width || 10;
  this.height = opt.height || 10;
  this.difficulty = opt.difficulty || 1;
  this.bombCount = Math.floor((this.width * this.height) / (this.difficulty*10)); //refactor for percentage
  this.board = [];
  this.gameStateActive = true;

  //initialize the game
  this.newGame();

};

VanillaMinsweeper.prototype.makeBoard = function(){

  var board = new Array(this.height);

  //Add rows to board
  for(var i=0; i<board.length; i++){
    board[i] = new Array(this.width);
  }

  //Place bombs. Bomb = -1
  for(var j=this.bombCount; j>0; j--){
    var x = Math.floor(Math.random()*this.width);
    var y = Math.floor(Math.random()*this.height);

    //If bomb already placed at current position, loop again
    if(board[y][x] === -1){
      j++;   
    }

    board[y][x] = -1;
  }

  this.board = board;
};

VanillaMinsweeper.prototype.countAdjacentBombs = function(board, x, y){
  var bombCount = 0;

  var posCheck = [
    [x-1, y],
    [x-1, y-1],
    [x-1, y+1],
    [x, y-1],
    [x, y+1],
    [x+1, y],
    [x+1, y+1],
    [x+1, y-1] 
  ];

  for(var i = 0; i<posCheck.length; i++){
    if(posCheck[i][1]>=0 && posCheck[i][0]>=0 && posCheck[i][0]<= board[0].length-1 && posCheck[i][1]<= board.length-1){
      if(board[posCheck[i][1]][posCheck[i][0]] === -1){
        bombCount++;
      }
    }
  }

  return bombCount;
};

VanillaMinsweeper.prototype.displayBoard = function(){
  if(document.getElementById('ms-board')){
    var el = document.getElementById('ms-board');
    el.parentNode.removeChild(el);
  }

  var table  = document.createElement('table');
  table.id = 'ms-board';

  for(var bRows = 0; bRows<this.board.length; bRows++){
    var row = document.createElement('tr');

    for(var bSquares = 0; bSquares < this.board[bRows].length; bSquares++){
      var square = document.createElement('td');
      square.dataset.position = [bRows]+','+[bSquares];
      var text = this.board[bRows][bSquares];


      if(this.board[bRows][bSquares] === undefined){
        text = this.countAdjacentBombs(this.board, bSquares, bRows);
      }

      square.setAttribute('data-adjbombs', text);
      square.className = 'color-'+text;
      row.appendChild(square);
    }

    table.appendChild(row);
  }

  var me = this;

  table.addEventListener('click', function(e) {

      if(!me.gameStateActive){
        return false;
      }

      if(e.altKey){
        e.target.classList.toggle('flagged');
        return;
      }
      var sqrValue = e.target.dataset.adjbombs;

      if(parseInt(sqrValue) === -1){
        me.gameStateActive = false;
        alert('game over');
      }else{
        me.toggleSquare(e.target);
      }
 });

  document.getElementById(this.tag).appendChild(table);
};

VanillaMinsweeper.prototype.toggleSquare = function(square){
  square.innerHTML = square.dataset.adjbombs;
};

VanillaMinsweeper.prototype.newGame = function(){
  this.gameStateActive = true;
  this.makeBoard();
  this.displayBoard();
};












