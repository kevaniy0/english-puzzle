function hideButton(element: HTMLButtonElement) {
    element.style.display = 'none';
    element.classList.remove('btn--active');
    if (element.classList.contains('btn-continue')) {
        element.classList.remove('btn-continue-animate');
    }
}
function showButton(element: HTMLButtonElement) {
    element.style.display = 'block';
    element.classList.add('btn--active');
    if (element.classList.contains('btn-continue')) {
        element.classList.add('btn-continue-animate');
    }
}

function enableButton(element: HTMLButtonElement) {
    element.disabled = false;
    element.classList.add('btn--active');
}

function disableButton(element: HTMLButtonElement) {
    element.disabled = true;
    element.classList.remove('btn--active');
}

function checkCorrectnessSentence(sourceSentence: string, answerSentence: string): boolean {
    return sourceSentence === answerSentence;
}

export { enableButton, disableButton, checkCorrectnessSentence, hideButton, showButton };
