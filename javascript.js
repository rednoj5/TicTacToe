//learning different patterns


//obj literal:

(function() {
    const gameBoard = {
        board: new Array(9),
        xArray: [],
        oArray: [],
        gameEnded: false,
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.cards = document.querySelectorAll('.card');
            this.body = document.querySelector('body');
            this.htmlBoard = document.querySelector('.gameBoard');
            this.resetButton = document.querySelector('.reset');
        },
        bindEvents: function() {
            this.cards.forEach(e => e.addEventListener('click', this.addToBoard));
            this.resetButton.addEventListener('click', this.restartGame);
        },
        render: function() {
            let cardsLength = this.cards.length - 1;

            for(let i = 0; i <= cardsLength; i++) {
                this.cards[i].textContent = this.board[i];
            }
        },
        addToBoard: function() {
            let target = this.getAttribute('data-id');
            let board = gameBoard.board;
            let activePlayer = gameBoard.checkTurn();
            if (board[target] === undefined && gameBoard.gameEnded !== true) {
                board[target] = activePlayer;
                gameBoard.render();
                gameBoard.game(target);
            };
        },
        checkTurn: function() {
            let xLength = this.board.filter((e) => e === 'x').length;
            let oLength = this.board.filter((e) => e === 'o').length;

            if (xLength === oLength) {
                return 'x';
            } else {
                return 'o';
            };
        },
        game: function(index) {
            let xArray = this.xArray;
            let oArray = this.oArray;

            if (xArray.length == oArray.length) {
                this.xArray.push(parseInt(index));
            } else {
                this.oArray.push(parseInt(index));
            };

            this.checkWinner();
        },
        checkWinner: function() {
            let xArray = this.xArray;
            let oArray = this.oArray;

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
                    this.declareWinner('X');
                } else if (gameEnd2 == true) {
                    this.declareWinner('O');
                }
            };
        },
        declareWinner: function(player) {
            let info = document.createElement('div');
            info.setAttribute('class', 'info');
            info.textContent = `Player ${player} has won!`;
            this.body.appendChild(info);
            this.htmlBoard.style.filter = 'blur(5px)';
            gameBoard.gameEnded = true;
        },
        restartGame: function() {
            gameBoard.board = new Array(9);
            gameBoard.xArray = [];
            gameBoard.oArray = [];
            gameBoard.render();
            let info = document.getElementsByClassName('info')[0];
            console.log(info);
            gameBoard.body.removeChild(info);
            gameBoard.htmlBoard.style.filter = '';
            gameBoard.gameEnded = false;
        }
    };

    gameBoard.init();

})();

const Player = (name) => {
    this.name = name;

    const getName = () => {
        return name;
    };

    return { getName };
};

// tests

let PlayerX = Player('x');

// console.log(PlayerX.getName())