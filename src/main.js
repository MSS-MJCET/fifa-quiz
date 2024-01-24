class PlayerEntity {
	constructor(id, team, row, col, tag) {
		this.id = id;
		this.row = row;
		this.col = col;
		this.team = team;
		this.tag = tag;
		this.coordinates = [];
		this.ballStatus = false;
		this.player = this.createPlayer();
	}

	createPlayer() {
		const player = document.createElement('div');
		player.textContent = this.tag;
		player.classList.add('player');
		player.classList.add(this.team);

		player.style.backgroundColor = this.team;
		player.draggable = true;

		const label = document.createElement('div');
		label.classList.add('label');
		label.textContent = this.team.charAt(0).toUpperCase();

		player.dataset.id = this.id;

		player.appendChild(label);

		player.addEventListener('dragstart', (e) => {
			player.classList.add('dragging');
			e.dataTransfer.setData('text/plain', ''); // proper initialization of drag and drop operation
		});

		player.addEventListener('dragend', () => {
			player.classList.remove('dragging');
		});
		return player;
	}

	setCords() {
		return this.coordinates.push({ row: this.row, col: this.col });
	}
}

class FootballBoard {
	constructor(containerId) {
		this.container = document.getElementById(containerId);
		this.board = this.createBoard();
		this.players = [];
	}

	createBoard() {
		const board = document.createElement('div');
		board.id = 'footballBoard';
		board.classList.add('football-board');

		for (let row = 0; row < 10; row++) {
			for (let col = 0; col < 18; col++) {
				const square = document.createElement('div');

				// assign coordinates to each squares
				square.dataset.cordX = row;
				square.dataset.cordY = col;

				square.draggable = false;

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

	addPlayer(player_object) {
		const { row, col, player } = player_object;
		const square = this.board.children[row * 18 + col];
		square.appendChild(player);

		this.players.push(player_object);
	}

	highlightAdjacentSquares(row, col, status = false) {
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
			if (index.row >= 0 && index.row < 10 && index.col > 0 && index.col < 17) {
				const square = this.board.children[index.row * 18 + index.col];
				if (status) square.classList.add('player-field');
				else square.classList.add('adjacent-highlight');
			}
		});
	}

	removeHighlightAdjacentSquares(row, col, status = false) {
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
				if (status) square.classList.remove('player-field');
				else square.classList.remove('adjacent-highlight');
			}
		});
	}
}

const goalie_1 = new PlayerEntity(1, 'blue', 5, 1, 'G');
const player_1 = new PlayerEntity(2, 'blue', 4, 7, 'A');
const player_2 = new PlayerEntity(3, 'blue', 2, 5, 'B');
const player_3 = new PlayerEntity(4, 'blue', 7, 5, 'C');

const goalie_2 = new PlayerEntity(5, 'red', 4, 16, 'G');
const player_4 = new PlayerEntity(6, 'red', 2, 12, 'F');
const player_5 = new PlayerEntity(7, 'red', 7, 12, 'E');
const player_6 = new PlayerEntity(8, 'red', 5, 10, 'D');

const playersCollection = [goalie_1, player_1, player_2, player_3, goalie_2, player_4, player_5, player_6];

const footballBoard = new FootballBoard('footballBoardContainer');
playersCollection.forEach((entity) => {
	entity.setCords();
	footballBoard.addPlayer(entity);
});

console.log(footballBoard.players);

let currentTile = undefined;
footballBoard.container.addEventListener('dragstart', (e) => {
	const player = document.querySelector('.dragging');
	const playerObj = playersCollection.find((entity) => entity.id == player.dataset.id);

	currentTile = playerObj.coordinates[playerObj.coordinates.length - 1];
	console.log(currentTile);

	footballBoard.highlightAdjacentSquares(playerObj.row, playerObj.col, playerObj.ballStatus);
});

footballBoard.container.addEventListener('dragend', (e) => {
	if (e.target.dataset.hasBall == 'true') {
		const playerObj = playersCollection.find((entity) => entity.id == e.target.dataset.id);
		footballBoard.removeHighlightAdjacentSquares(currentTile.row, currentTile.col, true);
		footballBoard.highlightAdjacentSquares(playerObj.row, playerObj.col, true);
	} else {
		footballBoard.removeHighlightAdjacentSquares(currentTile.row, currentTile.col, false);
	}
	currentTile = undefined;
});

footballBoard.container.addEventListener('dragover', (event) => {
	event.preventDefault();
	const targetSquare = event.target.closest('.football-square');
	if (targetSquare) {
		targetSquare.classList.add('drag-over');
	}
});

footballBoard.container.addEventListener('dragleave', (event) => {
	const targetSquare = event.target.closest('.football-square');
	if (targetSquare) {
		targetSquare.classList.remove('drag-over');
	}
});

function possibleTiles(cords) {
	return [
		{ row: cords.row - 1, col: cords.col },
		{ row: cords.row - 1, col: cords.col - 1 },
		{ row: cords.row - 1, col: cords.col + 1 },
		{ row: cords.row + 1, col: cords.col },
		{ row: cords.row + 1, col: cords.col - 1 },
		{ row: cords.row + 1, col: cords.col + 1 },
		{ row: cords.row, col: cords.col - 1 },
		{ row: cords.row, col: cords.col + 1 },
	];
}

footballBoard.container.addEventListener('drop', (event) => {
	event.preventDefault();
	const targetSquare = event.target.closest('.football-square');
	const possibleTilesArray = possibleTiles(currentTile);
	const targetSquareCords = { row: parseInt(targetSquare.dataset.cordX), col: parseInt(targetSquare.dataset.cordY) };
	const acceptableTile = possibleTilesArray.find((tile) => {
		if (targetSquareCords.row == tile.row && targetSquareCords.col == tile.col) {
			return tile;
		}
	});
	if (acceptableTile && targetSquare.children.length === 1) {
		// update coordinated of the dragged player
		const player = document.querySelector('.dragging');
		const playerObj = playersCollection.find((entity) => entity.id == player.dataset.id);

		if (playerObj) {
			playerObj.row = targetSquareCords.row;
			playerObj.col = targetSquareCords.col;
			playerObj.setCords();
		}

		console.log(playerObj);

		targetSquare.appendChild(player);
	}
	targetSquare.classList.remove('drag-over');
});

playersCollection.forEach((entity) => {
	entity.player.addEventListener('click', (e) => {
		const ball = document.getElementById('football');
		if (ballStatus) {
			const prevHolder = currentHolder.length ? currentHolder.pop() : false;
			if (prevHolder) {
				footballBoard.removeHighlightAdjacentSquares(prevHolder.row, prevHolder.col, ballStatus);
				prevHolder.player.classList.remove('has-ball', 'b-team');
				prevHolder.player.dataset.hasBall = '';
			}
			currentHolder.push(entity);

			entity.ballStatus = ballStatus;
			e.target.dataset.hasBall = true;
			e.target.appendChild(ball);

			e.target.classList.add('has-ball');
			if (e.target.dataset.id <= 4) e.target.classList.add('b-team');

			footballBoard.highlightAdjacentSquares(entity.row, entity.col, entity.ballStatus);
			ballStatus = false;
		}
	});
});

const ballButton = document.getElementById('ball-btn');
let ballStatus = false;
const currentHolder = [];
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

	ballButton.textContent = 'set status';

	if (!ballStatus) {
		ballStatus = true;
	}
});
