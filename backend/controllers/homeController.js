import HallController from './HallController.js';

document.addEventListener('DOMContentLoaded', () => {
    const loadHallsContainer = document.getElementById('load-halls-container');
    const hallTemplate = document.getElementById('hall-template').content;
    const hallSwitch = document.getElementById('hallSwitch');

    const numberOfHalls = 2;
    const weatherApiKey = 'beeecd8942';
    const hallControllers = [];

    for (let i = 1; i <= numberOfHalls; i++) {
        const hallClone = document.importNode(hallTemplate, true);
        loadHallsContainer.appendChild(hallClone);
        const hallElement = loadHallsContainer.lastElementChild;

        hallElement.id = `hall-${i}`;
        hallElement.style.display = i === 1 ? 'block' : 'none';

        const hallController = new HallController(hallElement, weatherApiKey);
        hallControllers.push(hallController);
    }

    hallSwitch.addEventListener('change', (event) => {
        const selectedHall = event.target.value;
        hallControllers.forEach((controller, index) => {
            const hallElement = document.getElementById(`hall-${index + 1}`);
            if (selectedHall == index + 1) {
                hallElement.style.display = 'block';
                // Resume the conveyor belts if they were paused
                controller.resumeConveyorBelts();
            } else {
                hallElement.style.display = 'none';
                // Pause the conveyor belts
                controller.pauseConveyorBelts();
            }
        });
    });
});
