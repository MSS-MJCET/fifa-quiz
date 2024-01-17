class FootballBoard {
	constructor(containerId) {
		this.container = document.getElementById(containerId);
		this.board = this.createBoard();
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
}

const footballBoard = new FootballBoard('footballBoardContainer');
