class Truck {
  constructor(length, width, type, container) {
    this.length = length;
    this.width = width;
    this.type = type;
    this.grid = this.initializeGrid(length, width);
    this.container = container;
    this.truckContainer = null;
    this.blocks = [];
    this.mouseCoord = { x: 0, y: 0 };
  }

  initializeGrid(length, width) {
    return Array.from({ length }, () => Array.from({ length: width }, () => ({ filled: false })));
  }

  createTruckElement() {
    const truckWrapper = document.createElement('div');
    truckWrapper.classList.add('truck-wrapper'); // Apply animation only to the wrapper

    const label = document.createElement('div');
    label.textContent = `${this.type} - ${this.length}x${this.width}`;
    label.classList.add('label');
    label.classList.add('unselectable');
    truckWrapper.appendChild(label);

    const truck = document.createElement('div');
    truck.classList.add('truck');
    truck.classList.add('drop-zone');
    truck.style.display = 'grid';
    truck.style.gridTemplateColumns = `repeat(${this.width}, 30px)`;
    truck.style.gridTemplateRows = `repeat(${this.length}, 30px)`;
    truck.dataset.cellSize = 30;

    for (let i = 0; i < this.length * this.width; i++) {
      const block = document.createElement('div');
      block.className = 'truck-block';
      block.style.width = '30px';
      block.style.height = '30px';
      block.dataset.x = i % this.width;
      block.dataset.y = Math.floor(i / this.width);
      block.dataset.filled = false;
      block.addEventListener('dragover', event => {
        event.preventDefault();
        this.mouseCoord.x = block.dataset.x;
        this.mouseCoord.y = block.dataset.y;
      });
      truck.appendChild(block);
    }

    truck.addEventListener('drop', this.handleDrop.bind(this));
    truckWrapper.appendChild(truck);
    this.truckContainer = truckWrapper;
    return truckWrapper;
  }

  handleDrop(event) {
    event.preventDefault();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const targetCell = this.getTargetCell();
    if (!targetCell) {
      console.log("targetCell not found. " + targetCell);
      return;
    }
    if (!targetCell) {
      console.log("Drop outside truck bounds.");
      return;
    }

    const tetrominoId = event.dataTransfer.getData('text/plain');
    const tetrominoElement = this.container.querySelector(`#${tetrominoId}`);
    if (!tetrominoElement) {
      console.log("Tetromino not found.");
      return;
    }

    const focusedCellIndex = parseInt(tetrominoElement.dataset.childFocusIndex);
    const tetrominoData = JSON.parse(tetrominoElement.dataset.object);
    const origin = this.calculateTetrominoOrigin(targetCell, focusedCellIndex, tetrominoData);

    if (!this.isValidPlacement(origin, tetrominoData)) {
      console.log("Invalid placement.");
      return;
    }

    this.placeTetromino(origin, tetrominoData, tetrominoElement);
  }

  getTargetCell() {
    const x = this.mouseCoord.x;
    const y = this.mouseCoord.y;

    return this.truckContainer.querySelector(`.truck-block[data-x="${x}"][data-y="${y}"]`);
  }

  calculateTetrominoOrigin(targetCell, focusedCellIndex, tetrominoData) {
    const targetX = parseInt(targetCell.dataset.x);
    const targetY = parseInt(targetCell.dataset.y);

    // Assuming each row in `shape` has the same number of columns (tetrominoData.shape[0].length)
    const tetrominoWidth = tetrominoData.shape[0].length;
    const offsetX = focusedCellIndex % tetrominoWidth;  // Column index of the focused cell
    const offsetY = Math.floor(focusedCellIndex / tetrominoWidth);  // Row index of the focused cell

    return { x: targetX - offsetX, y: targetY - offsetY };
  }

  isValidPlacement(origin, tetrominoData) {
    for (let y = 0; y < tetrominoData.shape.length; y++) {
      for (let x = 0; x < tetrominoData.shape[y].length; x++) {
        if (tetrominoData.shape[y][x] === 1) {
          const checkX = origin.x + x;
          const checkY = origin.y + y;
          if (checkX < 0 || checkX >= this.width || checkY < 0 || checkY >= this.length) {
            return false; // Out of bounds
          }
          if (this.grid[checkY][checkX].filled) {
            return false; // Cell already filled
          }
        }
      }
    }
    return true;
  }

  placeTetromino(origin, tetrominoData, tetrominoElement) {
    tetrominoData.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          const finalX = origin.x + x;
          const finalY = origin.y + y;
          const gridCell = this.truckContainer.querySelector(`.truck-block[data-x="${finalX}"][data-y="${finalY}"]`);
          gridCell.style.backgroundColor = tetrominoData.color; // Color the grid cell
          gridCell.dataset.filled = 'true'; // Mark the cell as filled in the dataset
          this.grid[finalY][finalX].filled = true; // Mark the grid model as filled
        }
      });
    });

    this.blocks.push(tetrominoElement); // Add the tetromino element to the list of blocks
    tetrominoElement.remove(); // Remove the element from its temporary position
  }
}

export default Truck;
