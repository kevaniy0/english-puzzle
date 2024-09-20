function swapElements(card: HTMLElement, aswerRow: HTMLElement, sourceBlock: HTMLElement): void {
    const parent = card.parentElement!;
    let neededRow: HTMLElement[] | null = null;
    let neededBlock: HTMLElement | null = null;
    if (parent.classList.contains('game-field__source-words')) {
        neededRow = Array.from(aswerRow.children) as HTMLElement[];
        neededBlock = neededRow.find((item) => item.classList.contains('clear-card')) as HTMLElement;
        if (neededBlock) {
            neededBlock.style.width = card.style.width;
            neededBlock.id = `clear_${card.id}`;
        }
    } else if (parent.classList.contains('game-field__row')) {
        neededRow = Array.from(sourceBlock.children) as HTMLElement[];
        neededBlock = neededRow.find((item) => item.id === `clear_${card.id}`) as HTMLElement;
        if (neededBlock) {
            neededBlock.removeAttribute('id');
        }
    }
    if (neededBlock) {
        const parent1 = card.parentElement;
        const parent2 = neededBlock.parentElement;
        const tempNode = document.createElement('div');
        parent1?.replaceChild(tempNode, card);
        parent2?.replaceChild(card, neededBlock);
        parent1?.replaceChild(neededBlock, tempNode);
    }
}

export default swapElements;
