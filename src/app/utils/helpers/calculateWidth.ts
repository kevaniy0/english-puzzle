function calculateBlockWidth(container: HTMLElement, array: HTMLElement[]) {
    const containerWidth = container.clientWidth;
    let amountLengthWords = 0;
    for (let i = 0; i < array.length; i += 1) {
        amountLengthWords += array[i].textContent!.length;
    }
    for (let j = 0; j < array.length; j += 1) {
        const textLength = array[j].textContent!.length;
        const blockWidth = (textLength / amountLengthWords) * containerWidth;
        array[j].style.width = `${blockWidth}px`;
    }
}

export default calculateBlockWidth;
