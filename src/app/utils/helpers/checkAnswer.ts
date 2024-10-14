export function checkAnswer(asnwerArray: HTMLElement[]): boolean {
    if (asnwerArray.every((item, index) => item.id === `w${index}`)) return true;
    return false;
}
