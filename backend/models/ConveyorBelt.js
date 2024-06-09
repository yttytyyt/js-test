// models/ConveyorBelt.js
class ConveyorBelt {
    constructor(id, tetrominoController) {
        this.id = id;
        this.container = null;
        this.tetrominoController = tetrominoController;
        this.intervalId = null;
        this.isPaused = false;
        this.tetrominoElements = [];
    }

    draw(container) {
        this.container = container;

        const conveyorBelt = document.createElement('div');
        conveyorBelt.className = 'conveyorBelt';
        conveyorBelt.id = this.id;
        conveyorBelt.style.cssText = `
            width: 100%;
            position: relative;
            overflow: hidden;
            height: 70px;
            margin-bottom: 20px;
            background-color: #000;
            border: 1px solid #ddd;
        `;

        const conveyorBeltAnimation = document.createElement('div');
        conveyorBeltAnimation.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 100%;
            background-size: 50px 70px;
            background-image: repeating-linear-gradient(-45deg, transparent, transparent 24px, grey 25px, rgb(214,210,202) 50px);
            animation: conveyorBeltAnimation 7.5s linear infinite;
        `;

        conveyorBelt.appendChild(conveyorBeltAnimation);
        container.appendChild(conveyorBelt);
        this.container = conveyorBelt;

        this.startTetrominoAnimation(); // Start moving tetrominoes immediately after drawing the belt
        return conveyorBelt;
    }

    remove(container) {
        if (this.container) {
            container.removeChild(this.container);
            this.container = null;
        }
    }

    toggleBelt() {
        if (this.container) {
            const animation = this.container.querySelector('div');
            if (animation.style.animationPlayState === 'paused') {
                animation.style.animationPlayState = 'running';
                this.isPaused = false;
                this.tetrominoElements.forEach(({ element }) => this.resumeTetromino(element)); // Resume tetromino movement
                this.startTetrominoAnimation();
            } else {
                animation.style.animationPlayState = 'paused';
                this.isPaused = true;
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    }

    startTetrominoAnimation() {
        if (this.intervalId === null) {
            this.intervalId = setInterval(() => {
                if (!this.isPaused) {
                    const tetrominoElement = this.tetrominoController.drawRandomTetromino();
                    this.tetrominoElements.push({ element: tetrominoElement, startPosition: -50 });
                    this.addTetromino(tetrominoElement);
                }
            }, 1500);
        }
    }

    addTetromino(tetrominoElement) {
        this.container.appendChild(tetrominoElement);
        this.animateTetromino(tetrominoElement, -50);
    }

    animateTetromino(tetrominoElement, startPosition) {
        const move = () => {
            if (this.isPaused) return;

            let newPosition = startPosition += 0.60;
            tetrominoElement.style.transform = `translateX(${newPosition}px)`;

            if (newPosition > this.container.offsetWidth) {
                if (this.container.contains(tetrominoElement)) {
                    this.container.removeChild(tetrominoElement);
                    this.tetrominoElements = this.tetrominoElements.filter(elem => elem.element !== tetrominoElement);
                }
            } else {
                requestAnimationFrame(() => this.animateTetromino(tetrominoElement, newPosition));
            }
        };

        move();
    }

    resumeTetromino(tetrominoElement) {
        const elem = this.tetrominoElements.find(e => e.element === tetrominoElement);
        if (elem) {
            this.animateTetromino(tetrominoElement, parseFloat(tetrominoElement.style.transform.replace('translateX(', '').replace('px)', '')));
        }
    }
}

export default ConveyorBelt;
