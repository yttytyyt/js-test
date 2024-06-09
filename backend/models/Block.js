import config from "../../config.json" assert { type: 'json' };

class Block {
    constructor(station) {
        this.station = station;
        const numTypes = config.types.length;
        this.type = config.types[Math.floor(Math.random() * numTypes)];
        this.initBlock();
    }

    initBlock() {
        const blockTypes = Object.keys(config.blocks);
        const randomBlockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];

        // Get the data for the randomly selected block type from the config
        const blockData = config.blocks[randomBlockType];
        // Randomly select a rotation for the block
        const numRotations = blockData.rotations.length;
        const randomRotationIndex = Math.floor(Math.random() * numRotations);
        const rotationData = blockData.rotations[randomRotationIndex];

        // Set the start position and translations for the block shape
        this.startPosition = rotationData.start_position;
        this.translations = rotationData.translations;

        // Set the color (randomly selected from the config colors)
        const numColors = config.colors.length;
        this.color = config.colors[Math.floor(Math.random() * numColors)];

        // Set the shape based on start position and translations
        this.shape = this.calculateShape();
    }

    calculateShape() {
        const shape = [];
        for (const translation of this.translations) {
            const x = this.startPosition.x + translation[0];
            const y = this.startPosition.y + translation[1];
            shape.push([x, y]);
        }
        return shape;
    }

    show() {
        const blockContainer = document.createElement("div");
        blockContainer.classList.add("block-container");
        blockContainer.dataset.type = this.type;

        blockContainer.style.position = "absolute";

        this.parts = [];

        for (let i = 0; i < this.translations.length; i++) {
            const translation = this.translations[i];
            const x = this.startPosition.x + translation[0];
            const y = this.startPosition.y + translation[1];

            let part = document.createElement("div");
            part.classList.add("block-part");
            part.style.backgroundColor = this.color;
            part.style.position = "absolute";
            part.style.width = "20px";
            part.style.height = "20px";
            part.style.top = `${(y * 20)}px`;
            part.style.left = `${(x * 20)}px`;
            part.dataset.partId = i;

            this.parts.push(part);
            blockContainer.appendChild(part);
        }

        blockContainer.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.blockContainer = blockContainer;
        return blockContainer;
    }

    onMouseDown(event) {
        // Get the block part that was clicked
        const partId = event.target.dataset.partId;
        if (!partId) return; // Ensure a valid block part is clicked
        this.selectedPart = this.parts[partId];

        // Record the initial mouse position relative to the entire block
        this.initialMouseX = event.clientX;
        this.initialMouseY = event.clientY;
        // Record the initial position of the block container
        const blockRect = this.blockContainer.getBoundingClientRect();
        this.initialBlockX = blockRect.left;
        this.initialBlockY = blockRect.top;
        // Record the initial position of the clicked part relative to the block container
        const partRect = this.selectedPart.getBoundingClientRect();
        this.initialPartX = partRect.left - blockRect.left;
        this.initialPartY = partRect.top - blockRect.top;
        // Add mouse move and mouse up event listeners
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseMove(event) {
        if (!this.selectedPart) return; // No part selected, exit
        // Calculate the movement offset relative to the initial click position
        const deltaX = event.clientX - this.initialMouseX;
        const deltaY = event.clientY - this.initialMouseY;
        // Calculate the new position of the entire block
        const newBlockX = this.initialBlockX + deltaX;
        const newBlockY = this.initialBlockY + deltaY;
        // Update the position of the entire block
        this.blockContainer.style.left = `${newBlockX}px`;
        this.blockContainer.style.top = `${newBlockY}px`;
    }

    onMouseUp(event) {
        if (!this.selectedPart) return; // No part selected, exit

        // Remove mouse move and mouse up event listeners
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
        document.removeEventListener('mouseup', this.onMouseUp.bind(this));

        // Decrease z-index to retrieve the correct element
        this.blockContainer.style.zIndex = '-999';
        const dropZone = document.elementFromPoint(event.clientX, event.clientY).closest('.dropZone');
        this.blockContainer.style.zIndex = null; // Reset z-index

        if (dropZone) {
            const isGridZone = dropZone.classList.contains('zoneGrid');
            if (isGridZone) {
                this.blockContainer.style.zIndex = '-999';
                const gridCell = document.elementFromPoint(event.clientX, event.clientY).closest('.grid-cell');
                this.blockContainer.style.zIndex = null; // Reset z-index

                if (gridCell) {
                    const gridX = parseInt(gridCell.dataset.x);
                    const gridY = parseInt(gridCell.dataset.y);

                    // Calculate the translation of the block based on the selected part
                    const translation = this.translations[this.selectedPart.dataset.partId];

                    // Generate coordinate list based on translation and release position
                    const startX = gridX - translation[0];
                    const startY = gridY - translation[1];
                    const coordList = this.generateCoordList(startX, startY, this.translations);

                    // Check if all grid cells in coordList are empty
                    const blockPlaced = coordList.every(([x, y]) => this.isGridCellEmpty(x, y));

                    if (blockPlaced) {
                        // Place the block in the grid and mark occupied cells
                        this.placeBlockInGrid(startX, startY, coordList);
                    } else {
                        // Reset block position to original position if blocked by occupied cells
                        this.resetBlockPosition();
                    }
                }
            }
        } else {
            // Reset block position to original position
            this.resetBlockPosition();
        }
        // Reset selected part and initial positions
        this.resetSelectedPartAndPositions();
    }

    checkBlockOccupied(startX, startY) {
        for (const [xOffset, yOffset] of this.translations) {
            const gridX = startX + xOffset;
            const gridY = startY + yOffset;

            if (!this.isGridCellEmpty(gridX, gridY)) {
                return true; // Block is occupied or out of bounds
            }
        }
        return false; // Block can be placed
    }

    placeBlockInGrid(startX, startY, coordList) {
        for (const [gridX, gridY] of coordList) {
            const gridCell = document.querySelector(`.grid-cell[data-x="${gridX}"][data-y="${gridY}"]`);
            gridCell.classList.add('occupied');
            gridCell.dataset.blockId = this.blockContainer.dataset.blockId;
            gridCell.style.backgroundColor = this.color;
        }
        this.blockContainer.removeEventListener('mousedown', this.onMouseDown.bind(this));
        this.blockContainer.remove();
        this.station.dispatchEvent(new CustomEvent('blockPlaced', { detail: this.station.id }));

    }

    generateCoordList(startX, startY) {
        const coordList = [];
        for (const [xOffset, yOffset] of this.translations) {
            const gridX = startX + xOffset;
            const gridY = startY + yOffset;
            coordList.push([gridX, gridY]);
        }
        return coordList;
    }

    isGridCellEmpty(gridX, gridY) {
        const gridCell = document.querySelector(`.grid-cell[data-x="${gridX}"][data-y="${gridY}"]`);
        return gridCell && !gridCell.classList.contains('occupied');
    }

    resetBlockPosition() {
        this.blockContainer.style.left = `${this.initialBlockX}px`;
        this.blockContainer.style.top = `${this.initialBlockY}px`;
    }

    resetSelectedPartAndPositions() {
        this.selectedPart = null;
        this.initialMouseX = null;
        this.initialMouseY = null;
        this.initialPartX = null;
        this.initialPartY = null;
    }
}
export default Block;
