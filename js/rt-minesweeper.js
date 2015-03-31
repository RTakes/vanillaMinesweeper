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

//X,Y are mixed up somewhere
VanillaMinsweeper.prototype.walkAdjacent = function(x, y, callback){

  var posCheck = [
    [x-1, y],
    [x-1, y-1],
    [x-1, y+1],
    [x,   y-1],
    [x,   y+1],
    [x+1, y],
    [x+1, y+1],
    [x+1, y-1] 
  ];

  for(var i = 0; i<posCheck.length; i++){
    if(posCheck[i][1]>=0 && posCheck[i][0]>=0 && posCheck[i][0]<= this.board[0].length-1 && posCheck[i][1]<= this.board.length-1){    
      callback(posCheck[i], this.board[posCheck[i][1]][posCheck[i][0]]);
    }
  }
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
        var adjacentBombs = 0;

        this.walkAdjacent(bSquares, bRows, function(coords, val){
          if(val === -1){
            adjacentBombs++;
          }
        });

        this.board[bRows][bSquares] = adjacentBombs;
        text = adjacentBombs;
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

  //debugging
  document.getElementById('debug').addEventListener('click', function(e) { 
    var squares = document.getElementsByTagName('td');
    for(var i=0; i<squares.length; i++){
      me.toggleSquare(squares[i]);
    }
  });
};

VanillaMinsweeper.prototype.toggleSquare = function(square){
  var coords = square.dataset.position.split(',');
  
  square.classList.add('revealed');
  square.innerHTML = square.dataset.adjbombs;

  //Reveal empty parts of board
  if(this.board[parseInt(coords[0])][parseInt(coords[1])] === 0){
    var me = this; //set 'this' context

    this.walkAdjacent(parseInt(coords[0]), parseInt(coords[1]), function(xy, val){

      //Reversed in walkAdjacent function
      var x = parseInt(xy[1]);
      var y = parseInt(xy[0]);

      var nextSquare = document.getElementsByTagName('td').item((me.width*x)+y);

      if(val === 0 && !nextSquare.classList.contains('revealed')){
        me.toggleSquare(nextSquare);
      }
    });
  }
};

VanillaMinsweeper.prototype.newGame = function(){
  this.gameStateActive = true;
  this.makeBoard();
  this.displayBoard();
};












