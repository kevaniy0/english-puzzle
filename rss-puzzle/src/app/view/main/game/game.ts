import './game.scss';
import * as GAME from './game-data';
import View from '../../view';
import Router from '../../../router/router';
import ElementCreator, { ElementParams } from '../../../utils/elementCreator/elementCreator';
import shuffleCards from '../../../utils/helpers/shuffleCards';
import getJson from '../../../utils/helpers/getJson';
import calculateBlockWidth from '../../../utils/helpers/calculateWidth';
import swapElements from '../../../utils/helpers/swapElements';
import eventEmitter from '../../../utils/eventEmitter/eventEmitter';
import { checkCorrectnessSentence, disableButton, enableButton, hideButton, showButton } from './game-events';
import Hints from './hints/hints';

class GameView extends View {
    router: Router;
    collection: Promise<GAME.Collection>;
    hints: Hints;
    level: number = 0;
    round: number = 0;
    currentRow: number = 1;
    gameField: HTMLDivElement;
    rowField: HTMLDivElement;
    sourceBlock: HTMLDivElement;
    sourceSentence: string = '';
    currentAnswerSentence: string = '';
    checkDrag: GAME.CheckDrag = {
        element: null,
        DRAX_PX: 10,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
    };
    dragging: boolean = false;
    onClickCard?: (event: PointerEvent) => void;
    constructor(router: Router) {
        super(GAME.page);
        this.router = router;
        this.gameField = this.createGameField();
        this.rowField = this.createRowsField();
        this.sourceBlock = this.createSourceBlock();
        this.collection = getJson('./data/wordCollectionLevel1.json');
        this.hints = new Hints();

        this.configureView();
    }

    private createGameField() {
        const gameField = new ElementCreator(GAME.field).getElement();
        return gameField;
    }

    private createRowsField(): HTMLDivElement {
        const rowsField = new ElementCreator(GAME.rowsFild);
        return rowsField.getElement();
    }
    private createCard(cardParams: ElementParams<'div'>): HTMLDivElement {
        const card = new ElementCreator(cardParams);
        return card.getElement();
    }

    private createSourceBlock(): HTMLDivElement {
        const sourceBlock = new ElementCreator(GAME.sourceWords).getElement();
        return sourceBlock;
    }

    private createCurrentSourceWords(arrayWords: string[]) {
        const arrayCards: HTMLDivElement[] = [];
        arrayWords.forEach((word, index) => {
            const card = this.createCard({ tag: 'div', className: [`source-word`, `source-word-${index + 1}`] });
            card.textContent = word;
            card.id = `w${index}`;
            if (index === 0) card.classList.add('first-puzzle');
            if (index === arrayWords.length - 1) card.classList.add('last-puzzle');
            arrayCards.push(card);
        });
        shuffleCards(arrayCards);
        arrayCards.forEach((item) => this.sourceBlock.append(item));
        this.onClickCard = this.createCallbackCard.bind(this);
        this.gameField.addEventListener('pointerup', this.onClickCard);
    }

    private configureAsnwerRow() {
        const quantityClearBlocks = Array.from(this.sourceBlock.children).length;
        for (let i = 0; i < quantityClearBlocks; i += 1) {
            const clearCard = this.createCard({ tag: 'div', className: ['clear-card'] });
            this.rowField.children[this.currentRow - 1].append(clearCard);
        }
    }

    private configureGame() {
        this.updateSourceBlock();
        this.collection.then((item) => {
            const wordsArray: string[] = item.rounds[this.round].words[this.currentRow - 1].textExample.split(' ');
            this.sourceSentence = wordsArray.join(' ');
            this.hints.translationSentence.setTextContent(
                item.rounds[this.round].words[this.currentRow - 1].textExampleTranslate
            );
            this.hints.audioFile = this.hints.getAudio(item, this.round, this.currentRow);

            if (this.hints.translationIcon.getElement().classList.contains('translate-button--off')) {
                this.hints.translationSentence.getElement().hidden = true;
            }
            if (!this.hints.pronounceHintIcon.getElement().classList.contains('pronounce-hint-button--on')) {
                this.hints.pronounceSentence.getElement().hidden = true;
            }
            this.createCurrentSourceWords(wordsArray);

            const arrayWords = Array.from(this.sourceBlock.children) as HTMLElement[];

            this.configureAsnwerRow();
            this.onDragCard();

            calculateBlockWidth(this.rowField, arrayWords);
            window.addEventListener('resize', () => {
                calculateBlockWidth(this.rowField, arrayWords);
            });
            eventEmitter.emit('disableCheckButton');
            eventEmitter.emit('showAutoCompleteButton');
        });
    }

    private updateRowField() {
        while (this.rowField.firstElementChild) {
            this.rowField.firstElementChild.remove();
        }
        for (let i = 0; i < 10; i += 1) {
            const row = new ElementCreator(GAME.row);
            row.getElement().classList.add(`row-${i + 1}`);
            this.rowField.append(row.getElement());
        }
    }

    private updateSourceBlock() {
        while (this.sourceBlock.firstElementChild) {
            this.sourceBlock.firstElementChild.remove();
        }
    }

    private createCallbackCard(event: PointerEvent) {
        const target = event.target! as HTMLElement;
        if (!target.classList.contains('source-word')) return;
        if (this.wasDraggin(event.clientX, event.clientY)) return;

        target.classList.remove('paint-wrong', 'paint-true', 'source-word--selected');
        const currentRow = Array.from(this.rowField.children)[this.currentRow - 1] as HTMLElement;
        swapElements(target, currentRow, this.sourceBlock);
        this.updateAnswerSentence(currentRow);
        this.checkFullFilledRow(currentRow);
        this.dragging = false;
    }

    private createContinueButton(): HTMLButtonElement {
        const btn = new ElementCreator(GAME.continueButton);
        btn.getElement().addEventListener('click', () => {
            if (this.onClickCard) this.gameField.removeEventListener('pointerdown', this.onClickCard);
            eventEmitter.emit('hideContinueButton');
            eventEmitter.emit('showCheckButton');

            this.currentRow += 1;
            if (this.currentRow === 11) {
                this.round += 1;
                this.currentRow = 1;
                this.updateRowField();
            }

            if (this.gameField) this.configureGame();
        });

        eventEmitter.subscribe('showContinueButton', showButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('hideContinueButton', hideButton.bind(null, btn.getElement()));
        return btn.getElement();
    }

    private createCheckButton(): HTMLButtonElement {
        const btn = new ElementCreator(GAME.checkButton);
        btn.getElement().disabled = true;
        const timer: GAME.Timer = { removeClasses: null };
        btn.getElement().addEventListener('click', () => {
            if (!checkCorrectnessSentence(this.sourceSentence, this.currentAnswerSentence)) {
                this.paintCheckBlocks(this.sourceSentence, this.currentAnswerSentence, timer);
            }
        });

        eventEmitter.subscribe('showCheckButton', showButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('hideCheckButton', hideButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('enableCheckButton', enableButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('disableCheckButton', disableButton.bind(null, btn.getElement()));
        return btn.getElement();
    }

    private createAutoCompleteButton(): HTMLButtonElement {
        const btn = new ElementCreator(GAME.autoComplete);

        btn.getElement().addEventListener('click', this.onAutoComplete.bind(this));

        eventEmitter.subscribe('hideAutoCompleteButton', hideButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('showAutoCompleteButton', showButton.bind(null, btn.getElement()));

        return btn.getElement();
    }

    private createButtonField(): HTMLDivElement {
        const buttonWrapper = new ElementCreator(GAME.buttonWrapper);
        const checkButton = this.createCheckButton();
        const autoCompleteButton = this.createAutoCompleteButton();
        const continueBtn = this.createContinueButton();
        buttonWrapper.getElement().append(checkButton, autoCompleteButton, continueBtn);
        return buttonWrapper.getElement();
    }

    private paintCheckBlocks(correctSentence: string, currentSentence: string, timer: GAME.Timer): void {
        const currentBlocks = Array.from(this.rowField.children[this.currentRow - 1].children) as HTMLElement[];
        const correctWords = correctSentence.split(' ');
        const currentWords = currentSentence.split(' ');
        if (timer.removeClasses) {
            clearTimeout(timer.removeClasses);
            currentBlocks.forEach((item) => item.classList.remove('paint-wrong', 'paint-true'));
        }
        for (let i = 0; i < correctWords.length; i += 1) {
            currentBlocks[i].classList.remove('paint-wrong', 'paint-true');
            if (correctWords[i] === currentWords[i]) {
                currentBlocks[i].classList.add('paint-true');
            } else {
                currentBlocks[i].classList.add('paint-wrong');
            }
        }
        timer.removeClasses = setTimeout(() => {
            currentBlocks.forEach((item) => item.classList.remove('paint-wrong', 'paint-true'));
        }, 3000);
    }

    private onAutoComplete(): void {
        const wordsFromSource = Array.from(this.sourceBlock.children).filter((item) =>
            item.classList.contains('source-word')
        );
        const wordsFromAnswerRow = Array.from(this.rowField.children[this.currentRow - 1].children).filter((item) =>
            item.classList.contains('source-word')
        );
        const neededBlock = [...wordsFromSource, ...wordsFromAnswerRow];
        const row = this.rowField.children[this.currentRow - 1] as HTMLElement;
        while (row.firstElementChild) {
            row.firstElementChild.remove();
        }

        neededBlock.sort((a, b) => {
            const first = Number(a.id.slice(1));
            const second = Number(b.id.slice(1));
            return first - second;
        });

        neededBlock.forEach((item) => {
            row.append(item);
            item.classList.remove('paint-wrong', 'paint-true');
        });
        this.updateAnswerSentence(row);
        this.checkFullFilledRow(row);
        this.onDragCardRemove();
    }

    private onDragCard(): void {
        const zoneSource = this.sourceBlock as HTMLElement;
        const zoneAnswer = this.rowField.children[this.currentRow - 1] as HTMLElement;

        zoneSource.addEventListener('pointerdown', this.onPointerDown);
        zoneSource.addEventListener('pointerup', this.onPointerUp);
        zoneAnswer.addEventListener('pointerdown', this.onPointerDown);
        zoneAnswer.addEventListener('pointerup', this.onPointerUp);
        document.body.addEventListener('pointermove', this.onPointerMove);
    }

    private onDragCardRemove() {
        const zoneSource = this.sourceBlock as HTMLElement;
        const zoneAnswer = this.rowField.children[this.currentRow - 1] as HTMLElement;

        zoneSource.removeEventListener('pointerdown', this.onPointerDown);
        zoneSource.removeEventListener('pointerup', this.onPointerUp);
        zoneAnswer.removeEventListener('pointerdown', this.onPointerDown);
        zoneAnswer.removeEventListener('pointerup', this.onPointerUp);
        document.body.removeEventListener('pointermove', this.onPointerMove);
    }

    private onPointerDown = (event: PointerEvent): void => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        const element = event.target as HTMLElement;
        if (!element.classList.contains('source-word')) return;

        this.checkDrag.element = element;
        this.dragging = true;
        this.checkDrag.startX = event.clientX;
        this.checkDrag.startY = event.clientY;
        this.checkDrag.currentX = event.clientX;
        this.checkDrag.currentY = event.clientY;
        element.classList.add('source-word--selected');
    };
    private onPointerMove = (event: PointerEvent): void => {
        if (!this.dragging) return;
        if (this.wasDraggin(event.clientX, event.clientY)) {
            document.body.style.cursor = 'grabbing';
            this.checkDrag.element!.style.cursor = 'grabbing';
            this.checkDrag.currentX = event.clientX;
            this.checkDrag.currentY = event.clientY;
            this.checkDrag.element!.style.transform = `translate(${this.checkDrag.currentX - this.checkDrag.startX}px, ${this.checkDrag.currentY - this.checkDrag.startY}px)`;
        }
    };

    private onPointerUp = (event: PointerEvent): void => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (!this.checkDrag.element) return;
        if (!this.wasDraggin(event.clientX, event.clientY)) return;
        const target = event.target as HTMLElement;
        if (!target.classList.contains('source-word')) return;
        this.dragging = false;

        const element = this.checkDrag.element;
        element.style.zIndex = '-1';
        const hovered = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
        const hoveredParent = hovered.parentElement;
        const elementParent = this.checkDrag.element.parentElement;

        if (element.parentElement?.classList.contains('game-field__source-words')) {
            // *** Если взяли элемент из source block

            if (
                hovered.classList.contains(`row-${this.currentRow}`) ||
                (hovered.classList.contains(`clear-card`) &&
                    hoveredParent?.classList.contains(`row-${this.currentRow}`))
            ) {
                // * Если навелись на область строки с ответом или пустую ячейку (вставляем вначало)
                swapElements(element, this.rowField.children[this.currentRow - 1] as HTMLElement, this.sourceBlock);
            } else if (
                hovered.classList.contains(`source-word`) &&
                hoveredParent?.classList.contains(`row-${this.currentRow}`)
            ) {
                // * Если навели на вставленную карточку в строке с ответами (вставляем перед наведенным элементом)
                swapElements(element, this.rowField.children[this.currentRow - 1] as HTMLElement, this.sourceBlock);
                (this.rowField.children[this.currentRow - 1] as HTMLElement).insertBefore(element, hovered);
            }
        } else if (element.parentElement?.classList.contains(`row-${this.currentRow}`)) {
            // *** Если взяли элемент из answer row

            if (
                hovered.classList.contains('source-word') &&
                hoveredParent?.classList.contains(`row-${this.currentRow}`)
            ) {
                // * Если меняем элементы в строке ответов
                const tempNode = document.createElement('div');
                elementParent?.replaceChild(tempNode, element);
                elementParent?.replaceChild(element, hovered);
                elementParent?.replaceChild(hovered, tempNode);
            } else if (hoveredParent?.classList.contains('game-field__source-words')) {
                // * Если из строки ответов тянем в строку слов
                swapElements(element, this.rowField.children[this.currentRow - 1] as HTMLElement, this.sourceBlock);
            }
        }

        this.updateAnswerSentence(this.rowField.children[this.currentRow - 1] as HTMLElement);
        this.checkFullFilledRow(this.rowField.children[this.currentRow - 1] as HTMLElement);
        document.body.style.cursor = '';
        element.style.cursor = '';
        element.style.transform = '';
        element.classList.add('source-word--up');
        element.classList.remove('source-word--selected');
        setTimeout(() => element.classList.remove('source-word--up'), 501);
        setTimeout(() => (element.style.zIndex = ''), 1);
        this.checkDrag.element = null;
    };

    private wasDraggin(currentX: number, currentY: number): boolean {
        const deltaX = Math.abs(currentX - this.checkDrag.startX);
        const deltaY = Math.abs(currentY - this.checkDrag.startY);
        if (deltaX > this.checkDrag.DRAX_PX || deltaY > this.checkDrag.DRAX_PX) {
            return true;
        }
        return false;
    }

    private checkFullFilledRow(answerRow: HTMLElement): void {
        const arrayFromRow = Array.from(answerRow.children);
        const result = arrayFromRow.every((item) => !item.classList.contains('clear-card'));
        if (!result) {
            eventEmitter.emit('disableCheckButton');
            return;
        }
        if (checkCorrectnessSentence(this.sourceSentence, this.currentAnswerSentence)) {
            eventEmitter.emit('showContinueButton');
            eventEmitter.emit('hideCheckButton');
            eventEmitter.emit('hideAutoCompleteButton');
            this.showHintsAfterSuccess();
            if (this.onClickCard && this.gameField) {
                this.gameField.removeEventListener('pointerup', this.onClickCard);
            }
        } else {
            eventEmitter.emit('enableCheckButton');
        }
    }

    private updateAnswerSentence(row: HTMLElement): void {
        const arrayFromRow = Array.from(row.children).map((item) => item.textContent);
        this.currentAnswerSentence = arrayFromRow.join(' ');
    }

    private onClickTranslationIcon(): void {
        const translateButton = this.hints.translationIcon.getElement();
        translateButton.addEventListener('click', () => {
            if (translateButton.classList.contains('translate-button--on')) {
                translateButton.classList.remove('translate-button--on');
                translateButton.classList.add('translate-button--off');
                this.hints.translationSentence.getElement().hidden = true;
            } else {
                translateButton.classList.remove('translate-button--off');
                translateButton.classList.add('translate-button--on');
                this.hints.translationSentence.getElement().hidden = false;
            }
        });
    }

    private onPronounceClick = (): void => {
        this.hints.pronounceSentence.getElement().addEventListener('click', () => {
            if (this.hints.audioFile) {
                this.hints.audioFile.play();
                eventEmitter.emit('showLoader');
                this.hints.audioFile.addEventListener('ended', () => {
                    eventEmitter.emit('hideLoader');
                });
            }
        });
    };

    private onPronounceHintClick = (): void => {
        const pronounceHintButton = this.hints.pronounceHintIcon.getElement();
        pronounceHintButton.addEventListener('click', () => {
            if (pronounceHintButton.classList.contains('pronounce-hint-button--on')) {
                pronounceHintButton.classList.remove('pronounce-hint-button--on');
                this.hints.pronounceSentence.getElement().hidden = true;
            } else {
                pronounceHintButton.classList.add('pronounce-hint-button--on');
                this.hints.pronounceSentence.getElement().hidden = false;
            }
        });
    };

    private showHintsAfterSuccess(): void {
        if (this.hints.translationIcon.getElement().classList.contains('translate-button--off')) {
            this.hints.translationSentence.getElement().hidden = false;
        }
        if (!this.hints.pronounceSentence.getElement().classList.contains('pronounce-hint-button--on')) {
            this.hints.pronounceSentence.getElement().hidden = false;
        }
    }

    configureView(): void {
        this.configureGame();
        this.updateRowField();
        const buttonField = this.createButtonField();
        this.onClickTranslationIcon();
        this.onPronounceClick();
        this.onPronounceHintClick();
        this.gameField.append(this.rowField, this.sourceBlock, buttonField);

        this.getViewHtml().append(this.hints.getViewHtml(), this.gameField);
    }
}

export default GameView;
