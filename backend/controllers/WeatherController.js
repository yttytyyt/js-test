class WeatherController {
    constructor(apiKey, container) {
        this.apiKey = apiKey;
        this.container = container;
        this.currentRestrictions = [];
    }

    fetchWeatherData(city) {
        const url = `https://weerlive.nl/api/json-data-10min.php?key=${this.apiKey}&locatie=${encodeURIComponent(city)}`;

        return fetch(url)
            .then(response => response.json())
            .then(data => this.processWeatherData(data.liveweer[0]))
            .catch(error => console.error('Fout bij het ophalen van weerdata:', error));
    }

    processWeatherData(weatherData) {
        const condition = weatherData.samenv.toLowerCase(); // Korte samenvatting van het weer

        const temp = parseFloat(weatherData.temp); // Temperatuur
        const windkracht = parseInt(weatherData.windk, 10); // Windsnelheid

        this.currentRestrictions = [];

        if (condition.includes("regen") || condition.includes("sneeuw")) {
            this.currentRestrictions.push("breekbaar");
        }
        if (temp > 35) {
            this.currentRestrictions.push("koud");
        }
        if (windkracht > 7) { // Gebruik de Beaufort-schaal voor windkracht
            this.currentRestrictions.push("pallets");
        }

        return this.currentRestrictions;
    }

    setupWeatherCheckButton(buttonElement) {
        buttonElement.addEventListener('click', () => {
            const city = this.container.querySelector('.locationInput').value;
            console.log(city);

            this.fetchWeatherData(city)
                .then(restrictions => this.displayRestrictions(restrictions));
        });
    }

    displayRestrictions(restrictions) {
        const resultDiv = this.container.querySelector('.weatherResult');
        resultDiv.innerHTML = restrictions.map(restriction => {
            if (restriction === "breekbaar") {
                return "Breekbaar Transport rijdt niet";
            } else if (restriction === "koud") {
                return "Koud Transport rijdt niet";
            } else if (restriction === "pallets") {
                return "Palletvrachtwagen rijdt niet";
            } else {
                return "Alle vrachtwagens rijden";
            }
        }).join('<br>');
    }

    canSendTruck(truckType) {
        return !this.currentRestrictions.includes(truckType);
    }
}

export default WeatherController;
