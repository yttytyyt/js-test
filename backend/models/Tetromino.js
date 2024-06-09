class Tetromino {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.element = null;
    }

    enableDragDrop(element) {
        element.setAttribute('draggable', true);
        element.addEventListener('dragstart', (event) => {
            const offsetX = event.clientX - element.getBoundingClientRect().left;
            const offsetY = event.clientY - element.getBoundingClientRect().top;

            // Calculate the cell index based on the mouse position
            const cellSize = 31; // 30px + 1px gap for each cell
            const x = Math.floor(offsetX / cellSize);
            const y = Math.floor(offsetY / cellSize);
            const cellIndex = y * this.shape[0].length + x;
            const cell = element.children[cellIndex]; // Access the actual cell using the calculated index

            if (cell && cell.dataset.isPart === 'true') {
                // Set drag offsets and the drag data
                element.dataset.dragOffsetX = offsetX;
                element.dataset.dragOffsetY = offsetY;
                event.dataTransfer.setData('text/plain', element.id);
                event.dataTransfer.effectAllowed = 'move';
                let childFocusIndex = Array.prototype.indexOf.call(element.children, cell);
                event.target.dataset.childFocusIndex = childFocusIndex;

            } else {
                // Prevent dragging if the cell is not valid
                event.preventDefault();
            }
        });
    }

    draw() {
        const tetrominoElement = document.createElement('div');
        tetrominoElement.style.display = 'grid';
        tetrominoElement.style.position = 'absolute';
        tetrominoElement.style.top = '5px';
        tetrominoElement.style.gridTemplateColumns = `repeat(${this.shape[0].length}, 30px)`;
        tetrominoElement.style.gridGap = '1px';
        tetrominoElement.dataset.object = JSON.stringify(this);

        this.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                const cellElement = document.createElement('div');
                cellElement.style.width = '30px';
                cellElement.style.height = '30px';
                cellElement.style.backgroundColor = cell === 1 ? this.color : 'transparent';
                cellElement.dataset.isPart = cell === 1 ? 'true' : 'false';
                cellElement.dataset.relativeX = x;
                cellElement.dataset.relativeY = y;
                tetrominoElement.appendChild(cellElement);
            });
        });

        tetrominoElement.id = `tetromino-${Math.random().toString(36).substr(2, 9)}`;
        this.enableDragDrop(tetrominoElement);

        this.element = tetrominoElement;
        return tetrominoElement;
    }
}

export default Tetromino;
