import Tetromino from '../models/Tetromino.js';

class TetrominoController {
    constructor() {
        this.tetrominoShapes = {
            'I': { shape: [[1, 1, 1, 1]], color: "cyan" },
            'O': { shape: [[1, 1], [1, 1]], color: "yellow" },
            'T': { shape: [[0, 1, 0], [1, 1, 1]], color: "purple" },
            'S': { shape: [[0, 1, 1], [1, 1, 0]], color: "green" },
            'Z': { shape: [[1, 1, 0], [0, 1, 1]], color: "red" },
            'J': { shape: [[1, 0, 0], [1, 1, 1]], color: "blue" },
            'L': { shape: [[0, 0, 1], [1, 1, 1]], color: "orange" }
        };
    }

    generateRandomTetromino() {
        const keys = Object.keys(this.tetrominoShapes);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const { shape, color } = this.tetrominoShapes[randomKey];
        return new Tetromino(shape, color);
    }

    drawRandomTetromino() {
        const tetromino = this.generateRandomTetromino();
        return tetromino.draw();
    }
}

export default TetrominoController;
