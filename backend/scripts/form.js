export function initializeForm(container) {
    const steps = Array.from(container.querySelectorAll('.form-step'));
    const nextBtns = container.querySelectorAll('.next-btn');
    const prevBtns = container.querySelectorAll('.prev-btn');
    const form = container.querySelector('form');
    const lengthInput = container.querySelector('.length');
    const widthInput = container.querySelector('.width');
    const intervalInput = container.querySelector('.interval');
    const submitBtn = container.querySelector('.submitForm');
    const minLength = parseInt(lengthInput.min);
    const minWidth = parseInt(widthInput.min);
    const maxLength = parseInt(lengthInput.max);
    const maxWidth = parseInt(widthInput.max);
    let currentStep = 0;

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep, minLength, maxLength, minWidth, maxWidth)) {
                steps[currentStep].classList.remove('form-step-active');
                currentStep++;
                steps[currentStep].classList.add('form-step-active');

                focusOnNextInput(currentStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            steps[currentStep].classList.remove('form-step-active');
            currentStep--;
            steps[currentStep].classList.add('form-step-active');
            focusOnNextInput(currentStep);
        });
    });

    form.addEventListener('submit', (e) => {
        if (!validateForm(minLength, maxLength, minWidth, maxWidth)) {
            e.preventDefault();
        }
    });

    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentStep < steps.length - 1) {
                nextBtns[currentStep].click();
            } else if (currentStep === steps.length - 1) {
                submitBtn.click();
            }
        }
    });

    function validateStep(step, minLength, maxLength, minWidth, maxWidth) {
        const length = parseInt(lengthInput.value, 10);
        const width = parseInt(widthInput.value, 10);
        const interval = parseInt(intervalInput.value, 10);
        clearErrors();

        if (step === 0 && (isNaN(length) || length > maxLength || length < minLength)) {
            showError(lengthInput, `Length should be between ${minLength} and ${maxLength}.`);
            return false;
        } else if (step === 1 && (isNaN(width) || width > maxWidth || width < minWidth)) {
            showError(widthInput, `Width should be between ${minWidth} and ${maxWidth}.`);
            return false;
        } else if (step === 2 && (isNaN(interval) || interval < 0)) {
            showError(intervalInput, 'Interval should be a non-negative number.');
            return false;
        }
        return true;
    }

    function validateForm(minLength, maxLength, minWidth, maxWidth) {
        const length = parseInt(lengthInput.value, 10);
        const width = parseInt(widthInput.value, 10);
        const interval = parseInt(intervalInput.value, 10);
        clearErrors();

        if (isNaN(length) || length > maxLength || length < minLength) {
            showError(lengthInput, `Length should be between ${minLength} and ${maxLength}.`);
            return false;
        }
        if (isNaN(width) || width > maxWidth || width < minWidth) {
            showError(widthInput, `Width should be between ${minWidth} and ${maxWidth}.`);
            return false;
        }
        if (isNaN(interval) || interval < 0) {
            showError(intervalInput, 'Interval should be a non-negative number.');
            return false;
        }
        return true;
    }

    function showError(inputElement, message) {
        let errorElement = container.querySelector(`.${inputElement.className}-error`);
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = `${inputElement.className}-error error-message`;
            inputElement.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearErrors() {
        const errors = container.querySelectorAll('.error-message');
        errors.forEach(error => error.textContent = '');
    }

    function focusOnNextInput(step) {
        if (step === 1) {
            widthInput.focus();
        } else if (step === 2) {
            intervalInput.focus();
        } else if (step === 3) {
            container.querySelector('.type').focus();
        }
    }
}
