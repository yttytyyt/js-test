import Truck from '../models/Truck.js';

class TruckController {
  constructor(container, weatherController) {
    this.trucks = [];
    this.container = container;
    this.weatherController = weatherController;
    this.trucksContainer = this.container.querySelector('.truckContainer') || document.createElement('div');
    this.trucksContainer.classList.add('truckContainer');
    this.container.appendChild(this.trucksContainer);
    this.attachFormSubmitEvent();
  }

  attachFormSubmitEvent() {
    const form = this.container.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const truckLength = parseInt(this.container.querySelector('.length').value, 10);
      const truckWidth = parseInt(this.container.querySelector('.width').value, 10);
      const minAllowedLength = parseInt(this.container.querySelector('.length').min);
      const minAllowedWidth = parseInt(this.container.querySelector('.width').min);
      const maxAllowedLength = parseInt(this.container.querySelector('.length').max);
      const maxAllowedWidth = parseInt(this.container.querySelector('.width').max);
      const truckType = this.container.querySelector('.type').value;

      if (isLengthValid(truckLength, minAllowedLength, maxAllowedLength) &&
        isWidthValid(truckWidth, minAllowedWidth, maxAllowedWidth)) {
        this.addTruck(new Truck(truckLength, truckWidth, truckType, this.container));
      } else {
        if (!isLengthValid(truckLength, minAllowedLength, maxAllowedLength)) {
          alert(`Length should be between ${minAllowedLength} and ${maxAllowedLength}.`);
        }
        if (!isWidthValid(truckWidth, minAllowedWidth, maxAllowedWidth)) {
          alert(`Width should be between ${minAllowedWidth} and ${maxAllowedWidth}.`);
        }
      }
    });

    function isLengthValid(length, minLength, maxLength) {
      return length >= minLength && length <= maxLength;
    }

    function isWidthValid(width, minWidth, maxWidth) {
      return width >= minWidth && width <= maxWidth;
    }
  }

  addTruck(truck) {
    const interval = parseInt(this.container.querySelector('.interval').value, 10);
    console.log(`Interval: ${interval}`); // Debug: Log interval value

    setTimeout(() => {
      this.trucks.push(truck);
      this.renderTruck(truck);
    }, interval * 1000);
  }

  renderTruck(truck) {
    const truckElement = truck.createTruckElement();
    const sendButton = document.createElement('button');
    sendButton.innerText = 'Send';
    sendButton.addEventListener('click', () => {
      if (this.weatherController.canSendTruck(truck.type)) {
        this.sendTruck(truck, truckElement);
      } else {
        alert(`The ${truck.type} cannot be sent due to current weather conditions.`);
      }
    });
    truckElement.appendChild(sendButton);
    this.trucksContainer.appendChild(truckElement);
  }

  sendTruck(truck, truckElement) {
    truckElement.classList.add('depart');

    setTimeout(() => {
      this.trucks = this.trucks.filter(t => t !== truck);
      truckElement.remove();
    }, 2000);
  }
}

export default TruckController;
