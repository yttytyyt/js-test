// controllers/ConveyorBeltController.js
import ConveyorBelt from "../models/ConveyorBelt.js";

class ConveyorBeltController {
    constructor(tetrominoController, container) {
        this.belts = [];
        this.tetrominoController = tetrominoController;
        this.container = container;

        this.createConveyorBelt();
        this.container.querySelector('.addConveyorBelt').addEventListener('click', () => {
            this.createConveyorBelt();
        });
    }

    createConveyorBelt() {
        if (this.belts.length >= 5) {
            return;
        }
        const id = `conveyorBelt${this.belts.length + 1}`;
        const conveyorBelt = new ConveyorBelt(id, this.tetrominoController);
        conveyorBelt.draw(this.container);
        this.belts.push(conveyorBelt);
        if (this.belts.length >= 5) {
            this.container.querySelector('.addConveyorBelt').disabled = true;
        }
    }
}

export default ConveyorBeltController;
