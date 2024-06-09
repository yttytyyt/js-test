import { initializeForm } from '../scripts/form.js';
import TetrominoController from './TetrominoController.js';
import WeatherController from './WeatherController.js';
import TruckController from './TruckController.js';
import ConveyorBeltController from './ConveyorBeltController.js';

export default class HallController {
    constructor(hallElement, weatherApiKey) {
        this.hallElement = hallElement;
        this.weatherApiKey = weatherApiKey;
        this.weatherController = null;
        this.conveyorBeltController = null;
        this.initialize();
    }

    initialize() {
        const tetrominoController = new TetrominoController(this.hallElement);
        this.weatherController = new WeatherController(this.weatherApiKey, this.hallElement);
        this.conveyorBeltController = new ConveyorBeltController(tetrominoController, this.hallElement);
        const truckController = new TruckController(this.hallElement, this.weatherController);

        this.weatherController.setupWeatherCheckButton(this.hallElement.querySelector('.checkWeatherBtn'));

        this.hallElement.querySelector('#tst-toggle').addEventListener('click', () => {
            this.conveyorBeltController.belts.forEach(belt => {
                belt.toggleBelt();
            });
        });

        initializeForm(this.hallElement);
    }

    pauseConveyorBelts() {
        this.conveyorBeltController.belts.forEach(belt => {
            if (!belt.isPaused) {
                belt.toggleBelt();
            }
        });
    }

    resumeConveyorBelts() {
        this.conveyorBeltController.belts.forEach(belt => {
            if (belt.isPaused) {
                belt.toggleBelt();
            }
        });
    }
}
