//learning different patterns


//obj literal:

(function() {
    const gameBoard = {
        board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        gameEnded: false,
        vsComputer: 0,
        playingAs: 'o',
        buttonsDisabled: 1,
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.cards = document.querySelectorAll('.card');
            this.body = document.querySelector('body');
            this.htmlBoard = document.querySelector('.gameBoard');
            this.htmlMain = document.querySelector('main');
            this.resetButton = document.querySelector('.reset');
            this.htmlPlayerXDisplay = document.querySelector('.playerX');
            this.htmlPlayerODisplay = document.querySelector('.playerO');
            this.htmlPvpButton = document.querySelector('#pvp');
            this.htmlPveButton = document.querySelector('#pve');
            this.htmlXButton = document.querySelector('#x');
            this.htmlOButton = document.querySelector('#o');
        },
        bindEvents: function() {
            this.cards.forEach(e => e.addEventListener('click', this.addToBoard));
            this.resetButton.addEventListener('click', this.restartGame);
            this.htmlPvpButton.addEventListener('click', this.pvp);
            this.htmlPveButton.addEventListener('click', this.pve);
            this.htmlXButton.addEventListener('click', this.playAsX);
            this.htmlOButton.addEventListener('click', this.playAsO);
        },
        render: function() {
            let cardsLength = this.cards.length - 1;

            for(let i = 0; i <= cardsLength; i++) {
                let currentCard = this.cards[i];
                let currentMark = this.board[i];
                if (typeof(currentMark) == 'string') {
                    currentCard.textContent = currentMark;
                } else {
                    currentCard.textContent = '';
                }
            }
        },
        addToBoard: function() {
            let target = this.getAttribute('data-id');
            let board = gameBoard.board;
            let activePlayer = gameBoard.checkTurn(board);

            if (typeof(board[target]) == 'number' && gameBoard.gameEnded !== true) {
                board[target] = activePlayer;
                gameBoard.render();
                gameBoard.game(target);
                gameBoard.highliteCurrentPlayer();
                if (gameBoard.vsComputer === 1) {
                    gameBoard.aiPlay();
                };
            };
        },
        checkTurn: function(board) {
            let xLength = board.filter((e) => e === 'x').length;
            let oLength = board.filter((e) => e === 'o').length;

            if (xLength === oLength) {
                return 'x';
            } else {
                return 'o';
            };
        },
        game: function(index) {
            let winner = this.checkWinner(this.board);

            if (winner === 'x') {
                this.declareWinner('X');
            } else if (winner === 'o') {
                this.declareWinner('O');
            } else if (winner === 'draw') {
                this.declareDraw();
            };
        },
        checkWinner: function(board) {
            let xArray = [];
            let oArray = [];

            let xIndex = board.indexOf('x');
            while (xIndex !== -1) {
                xArray.push(xIndex);
                xIndex = board.indexOf('x', xIndex + 1)
            };

            let oIndex = board.indexOf('o');
            while (oIndex !== -1) {
                oArray.push(oIndex);
                oIndex = board.indexOf('o', oIndex + 1)
            };

            let winConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];

            for (let cond of winConditions) {
                let gameEnd1 = cond.every((num) => xArray.includes(num));
                let gameEnd2 = cond.every((num) => oArray.includes(num));
                if (gameEnd1 == true) {
                    return 'x';
                } else if (gameEnd2 == true) {
                    return 'o';
                } 
            };
            if (xArray.length > 4 && this.gameEnded === false) {
                    return 'draw';
            };
        },
        declareWinner: function(player) {
            if (this.gameEnded === false) {
                let info = document.createElement('div');
                info.setAttribute('class', 'info');
                info.textContent = `Player ${player} has won!`;
                this.htmlMain.appendChild(info);
                this.htmlBoard.style.filter = 'blur(4px)';
                gameBoard.gameEnded = true;
            }
        },
        declareDraw: function() {
            if (this.gameEnded === false) {
                let info = document.createElement('div');
                info.setAttribute('class', 'info');
                info.textContent = `It's a draw!`;
                this.htmlMain.appendChild(info);
                this.htmlBoard.style.filter = 'blur(4px)';
                gameBoard.gameEnded = true;
            }
        },
        highliteCurrentPlayer: function() {
            let currentPlayer = this.checkTurn(this.board);

            if (currentPlayer == 'x') {
                this.htmlPlayerXDisplay.style.opacity = '1';
                this.htmlPlayerODisplay.style.opacity = '0.5';
            } else {
                this.htmlPlayerODisplay.style.opacity = '1';
                this.htmlPlayerXDisplay.style.opacity = '0.5';
            }

            if (this.gameEnded === true) {
                this.htmlPlayerODisplay.style.opacity = '0.5';
                this.htmlPlayerXDisplay.style.opacity = '0.5';
            }
        },
        restartGame: function() {
            gameBoard.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            round = 0;
            gameBoard.render();
            if (gameBoard.gameEnded === true) {
                let info = document.getElementsByClassName('info')[0];
                gameBoard.htmlMain.removeChild(info);
                gameBoard.htmlBoard.style.filter = '';
            }
            gameBoard.gameEnded = false;
            gameBoard.highliteCurrentPlayer();
            if (gameBoard.vsComputer === 1 && gameBoard.playingAs === 'o') {
                gameBoard.aiPlay();
            };
        },
        aiPlay: function() {
            let board = this.board;
            let bestSpot = minimax(board, theComputer);
            let aiMove = bestSpot.index;
            let random = Math.floor(Math.random() * (100 + 1));
            if (random < level) {
                aiMove = rdmShittyMove(board);
                console.log('happening');
            }
            // console.log("index: " + bestSpot.index);
            // console.log("function calls: " + fc);
            let activePlayer = theComputer;
            board[aiMove] = activePlayer;
            gameBoard.render();
            gameBoard.game(aiMove);
            gameBoard.highliteCurrentPlayer();
        },
        pvp: function() {
            if (gameBoard.vsComputer === 1) {
                gameBoard.vsComputer = 0;
                gameBoard.htmlPveButton.classList.remove('pushed');
                this.classList.add('pushed');
                gameBoard.restartGame();
                gameBoard.playAsO();
                gameBoard.htmlOButton.classList.add('disabled');
                gameBoard.htmlXButton.classList.add('disabled');
                gameBoard.buttonsDisabled = 1;
            }
        },
        pve: function() {
            if (gameBoard.vsComputer === 0) {
                gameBoard.vsComputer = 1;
                gameBoard.restartGame();
                gameBoard.htmlPvpButton.classList.remove('pushed');
                this.classList.add('pushed');
                gameBoard.htmlOButton.classList.remove('disabled');
                gameBoard.htmlXButton.classList.remove('disabled');
                gameBoard.buttonsDisabled = 0;
            }
        },
        playAsX: function() {
            if (gameBoard.playingAs === 'o' && gameBoard.buttonsDisabled === 0) {
                gameBoard.playingAs = 'x';
                thePlayer = 'x';
                theComputer = 'o';
                this.classList.add('pushed');
                gameBoard.htmlOButton.classList.remove('pushed');
                gameBoard.restartGame();
            }
        },
        playAsO: function() {
            if (gameBoard.playingAs === 'x' && gameBoard.buttonsDisabled === 0) {
                gameBoard.playingAs = 'o';
                thePlayer = 'o';
                theComputer = 'x';
                this.classList.add('pushed');
                gameBoard.htmlXButton.classList.remove('pushed');
                gameBoard.restartGame();
            }
        }
    };

    let thePlayer = 'o';
    let theComputer = 'x';
    let round = 0;
    let level = 40;
    
    function rdmShittyMove(board) {
        let possibleMoves = emptyIndexies(board);
        let number = Math.floor(Math.random() * (possibleMoves.length));
        return possibleMoves[number];
    };


    function minimax(board, player){
      round++;

      let emptySpots = emptyIndexies(board);
    
      if (gameBoard.checkWinner(board) == thePlayer){
            return {score:-10};
        } else if (gameBoard.checkWinner(board) == theComputer){
            return {score:10};
        } else if (emptySpots.length === 0){
            return {score:0};
        }
    
      let moves = [];
    
      for (let i = 0; i < emptySpots.length; i++){
        let move = {};
        
        move.index = board[emptySpots[i]];
    
        board[emptySpots[i]] = player;
    
        if (player == theComputer) {
          let result = minimax(board, thePlayer);
          move.score = result.score;
        } else {
          let result = minimax(board, theComputer);
          move.score = result.score;
        }
    
        board[emptySpots[i]] = move.index;
    
        moves.push(move);
      }
    
      let bestMove;
      if (player === theComputer) {
        let bestScore = -10000;
        for(let i = 0; i < moves.length; i++){
          if(moves[i].score > bestScore){
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = 10000;
        for(let i = 0; i < moves.length; i++){
          if(moves[i].score < bestScore){
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }
        
        return moves[bestMove];

    }


    function emptyIndexies(board){
        return  board.filter(e => e != 'o' && e != 'x');
    };

    gameBoard.init();

})();