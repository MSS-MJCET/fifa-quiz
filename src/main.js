class FootballBoard {
	constructor(containerId) {
		this.container = document.getElementById(containerId);
		this.board = this.createBoard();
		this.addPlayers();
		// Add this line to the constructor
	}
	createBoard() {
		const board = document.createElement('div');
		board.id = 'footballBoard';
		board.classList.add('football-board');

		for (let row = 0; row < 10; row++) {
			for (let col = 0; col < 18; col++) {
				const square = document.createElement('div');
				square.classList.add('football-square');

				if (col === 0) {
					if (row < 3 || row > 6) {
						square.classList.add('white');
					} else {
						square.classList.add('left-column');
					}
				} else if (col === 17) {
					if (row < 3 || row > 6) {
						square.classList.add('white');
					} else {
						square.classList.add('right-column');
					}
				} else {
					square.classList.add((row + col) % 2 === 0 ? 'even' : 'odd');
				}

				const label = document.createElement('div');
				label.classList.add('label');
				label.textContent = String.fromCharCode(65 + row) + col;

				square.appendChild(label);
				board.appendChild(square);
			}
		}

		this.container.appendChild(board);
		return board;
	}

	addPlayers() {
		// Adding 4 blue players
		this.addPlayer('blue', 5, 1, 'G'); // goalie
		this.addPlayer('blue', 4, 7, 'A');
		this.addPlayer('blue', 2, 5, 'B');
		this.addPlayer('blue', 7, 5, 'C');

		// Adding 4 red players
		this.addPlayer('red', 4, 16, 'G'); //goalie
		this.addPlayer('red', 2, 12, 'F');
		this.addPlayer('red', 7, 12, 'E');
		this.addPlayer('red', 5, 10, 'D');
	}

	addPlayer(team, row, col, tag) {
		const player = document.createElement('div');
		player.textContent = tag;
		player.classList.add('player');
		player.classList.add(team);

		// Set the background color based on the team
		player.style.backgroundColor = team;

		const label = document.createElement('div');
		label.classList.add('label');
		label.textContent = team.charAt(0).toUpperCase();

		player.appendChild(label);

		const square = this.board.children[row * 18 + col];
		square.appendChild(player);

		// Make the player draggable
		player.draggable = true;

		// Add dragstart event listener
		player.addEventListener('dragstart', (event) => {
			player.classList.add('dragging');
			this.highlightAdjacentSquares(row, col);
			event.dataTransfer.setData('text/plain', ''); // Set data to enable drag
		});

		// Add dragend event listener
		player.addEventListener('dragend', () => {
			player.classList.remove('dragging');
			this.removeHighlightAdjacentSquares(row, col);
		});
	}

	highlightAdjacentSquares(row, col) {
		// Get the indices of adjacent squares
		const indices = [
			{ row: row - 1, col },
			{ row: row - 1, col: col - 1 },
			{ row: row - 1, col: col + 1 },
			{ row: row + 1, col },
			{ row: row + 1, col: col - 1 },
			{ row: row + 1, col: col + 1 },
			{ row, col: col - 1 },
			{ row, col: col + 1 },
		];

		// Highlight each adjacent square
		indices.forEach((index) => {
			if (index.row >= 0 && index.row < 10 && index.col >= 0 && index.col < 18) {
				const square = this.board.children[index.row * 18 + index.col];
				square.classList.add('adjacent-highlight');
			}
		});
	}

	removeHighlightAdjacentSquares(row, col) {
		// Get the indices of adjacent squares
		const indices = [
			{ row: row - 1, col },
			{ row: row - 1, col: col - 1 },
			{ row: row - 1, col: col + 1 },
			{ row: row + 1, col },
			{ row: row + 1, col: col - 1 },
			{ row: row + 1, col: col + 1 },
			{ row, col: col - 1 },
			{ row, col: col + 1 },
		];

		// Remove highlight from each adjacent square
		indices.forEach((index) => {
			if (index.row >= 0 && index.row < 10 && index.col >= 0 && index.col < 18) {
				const square = this.board.children[index.row * 18 + index.col];
				square.classList.remove('adjacent-highlight');
			}
		});
	}
}

const footballBoard = new FootballBoard('footballBoardContainer');
// Add dragover event listener to allow dropping
footballBoard.container.addEventListener('dragover', (event) => {
	event.preventDefault();
	const targetSquare = event.target.closest('.football-square');
	if (targetSquare) {
		// Highlight the target square when a player is dragged over
		targetSquare.classList.add('drag-over');
	}
});

// Add dragleave event listener to remove highlight
footballBoard.container.addEventListener('dragleave', (event) => {
	const targetSquare = event.target.closest('.football-square');
	if (targetSquare) {
		targetSquare.classList.remove('drag-over');
	}
});

// Add drop event listener to handle dropping
footballBoard.container.addEventListener('drop', (event) => {
	event.preventDefault();
	const targetSquare = event.target.closest('.football-square');
	if (targetSquare) {
		const player = document.querySelector('.dragging');
		targetSquare.appendChild(player);
		targetSquare.classList.remove('drag-over');
	}
});

const ballButton = document.getElementById('ball-btn');

ballButton.addEventListener('click', (e) => {
	const container = footballBoard.container;
	const ball = document.getElementById('football');

	if (!container.contains(ball)) {
		const createBall = document.createElement('div');
		createBall.classList.add('ball');
		createBall.id = 'football';

		container.classList.add('ball-center');
		container.appendChild(createBall);
	}
});
