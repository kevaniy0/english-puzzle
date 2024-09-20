function enableButton(element: HTMLButtonElement) {
    element.disabled = false;
}

function disableButton(element: HTMLButtonElement) {
    element.disabled = true;
}

function checkCorrectnessSentence(sourceSentence: string, answerSentence: string): boolean {
    return sourceSentence === answerSentence;
}

export { enableButton, disableButton, checkCorrectnessSentence };
