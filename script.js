// Main Game Module using IIFE (Immediately Invoked Function Expression)
const Game = (function() {
    // Private variables
    let currentPlayer;
    let gameOver = false;
    let player1;
    let player2;

    // Cache DOM elements
    const playerSetupDiv = document.getElementById('player-setup');
    const gameContainerDiv = document.getElementById('game-container');
    const startGameBtn = document.getElementById('start-game');
    const restartGameBtn = document.getElementById('restart-game');
    const gameStatusDiv = document.getElementById('game-status');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');

    // Initialize event listeners
    function init() {
        startGameBtn.addEventListener('click', startGame);
        restartGameBtn.addEventListener('click', restartGame);
    }

    // Start game with player names
    function startGame() {
        const p1Name = player1Input.value.trim() || 'Player 1';
        const p2Name = player2Input.value.trim() || 'Player 2';
        
        player1 = PlayerFactory(p1Name, 'X');
        player2 = PlayerFactory(p2Name, 'O');
        currentPlayer = player1;
        
        playerSetupDiv.style.display = 'none';
        gameContainerDiv.style.display = 'block';
        
        // Initialize and render the gameboard
        Gameboard.init();
        updateGameStatus();
    }

    // Restart the game
    function restartGame() {
        gameOver = false;
        currentPlayer = player1;
        Gameboard.reset();
        updateGameStatus();
    }

    // Switch to next player
    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        updateGameStatus();
    }

    // Update game status display
    function updateGameStatus() {
        if (gameOver) {
            return;
        }
        gameStatusDiv.textContent = `${currentPlayer.getName()}'s turn (${currentPlayer.getMarker()})`;
    }

    // Handle player's move
    function handlePlayerMove(index) {
        if (gameOver || Gameboard.getCell(index) !== '') {
            return;
        }

        // Update the gameboard
        Gameboard.setCell(index, currentPlayer.getMarker());
        
        // Check for win or tie
        if (checkWin(currentPlayer.getMarker())) {
            gameOver = true;
            gameStatusDiv.textContent = `${currentPlayer.getName()} wins!`;
        } else if (checkTie()) {
            gameOver = true;
            gameStatusDiv.textContent = "It's a tie!";
        } else {
            switchPlayer();
        }
    }

    // Check for win
    function checkWin(marker) {
        const board = Gameboard.getBoard();
        
        // Check rows
        for (let i = 0; i < 9; i += 3) {
            if (board[i] === marker && board[i + 1] === marker && board[i + 2] === marker) {
                return true;
            }
        }
        
        // Check columns
        for (let i = 0; i < 3; i++) {
            if (board[i] === marker && board[i + 3] === marker && board[i + 6] === marker) {
                return true;
            }
        }
        
        // Check diagonals
        if (board[0] === marker && board[4] === marker && board[8] === marker) {
            return true;
        }
        if (board[2] === marker && board[4] === marker && board[6] === marker) {
            return true;
        }
        
        return false;
    }

    // Check for tie
    function checkTie() {
        return Gameboard.getBoard().every(cell => cell !== '');
    }

    // Public methods
    return {
        init,
        handlePlayerMove,
        checkWin,
        checkTie
    };
})();

// Gameboard Module using IIFE
const Gameboard = (function() {
    // Private variables
    let board = Array(9).fill('');
    const gameboardDiv = document.getElementById('gameboard');
    
    // Initialize the gameboard
    function init() {
        render();
    }
    
    // Reset the gameboard
    function reset() {
        board = Array(9).fill('');
        render();
    }
    
    // Render the gameboard
    function render() {
        gameboardDiv.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            if (board[i] === 'X') {
                cell.textContent = 'X';
                cell.classList.add('x');
            } else if (board[i] === 'O') {
                cell.textContent = 'O';
                cell.classList.add('o');
            }
            
            cell.dataset.index = i;
            cell.addEventListener('click', () => {
                Game.handlePlayerMove(i);
            });
            
            gameboardDiv.appendChild(cell);
        }
    }
    
    // Get the entire board
    function getBoard() {
        return [...board]; // Return a copy to prevent direct manipulation
    }
    
    // Get a specific cell
    function getCell(index) {
        return board[index];
    }
    
    // Set a specific cell
    function setCell(index, marker) {
        board[index] = marker;
        render();
    }
    
    // Public methods
    return {
        init,
        reset,
        getBoard,
        getCell,
        setCell
    };
})();

// Player Factory Function
const PlayerFactory = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;
    
    return {
        getName,
        getMarker
    };
};

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', Game.init);