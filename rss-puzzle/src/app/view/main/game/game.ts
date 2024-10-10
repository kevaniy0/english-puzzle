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
import Hints from './hints/hints';
import storage from '../../../services/storage-service';
import ButtonsField from './buttons-field/buttons-field';
import SelectionField from './selection-field/selection-field';
import { checkAnswer } from '../../../utils/helpers/checkAnswer';
class GameView extends View {
    router: Router;
    collection: Promise<GAME.Collection>;
    buttonField: ButtonsField;
    hints: Hints;
    selectionField: SelectionField;
    gameField: HTMLDivElement;
    rowField: HTMLDivElement;
    sourceBlock: HTMLDivElement;
    checkDrag: GAME.CheckDrag = {
        element: null,
        DRAX_PX: 10,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
    };
    dragging: boolean = false;
    timer: GAME.Timer = { removeClasses: null };
    onClickCard?: (event: PointerEvent) => void;
    constructor(router: Router) {
        super(GAME.page);
        this.router = router;
        this.gameField = this.createGameField();
        this.rowField = this.createRowsField();
        this.sourceBlock = this.createSourceBlock();
        this.collection = getJson(`./data/wordCollectionLevel${storage.USER_DATA!.statistic.gameStats.level + 1}.json`);
        this.hints = new Hints();
        this.buttonField = new ButtonsField(
            this.onClickCheck.bind(this),
            this.onClickContinue.bind(this),
            this.onClickAutoComplete.bind(this)
        );
        this.selectionField = new SelectionField(this.onChangeLevel.bind(this), this.onChangeRound.bind(this));
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

    private addBackgroundAsPuzzle() {
        const blocks = Array.from(this.sourceBlock.children) as HTMLElement[];
        blocks.sort((a, b) => {
            const first = Number(a.id.slice(1));
            const second = Number(b.id.slice(1));
            return first - second;
        });
        let backgroundShift = 0;
        const width = this.rowField.clientWidth;
        const height = this.rowField.clientHeight;

        for (let i = 0; i < blocks.length; i += 1) {
            blocks[i].style.backgroundSize = `${width}px ${height}px`;
            blocks[i].style.backgroundRepeat = 'no-repeat';
            blocks[i].style.setProperty('--after-backgroundSize', `${width}px ${height}px`);
            blocks[i].style.backgroundPosition =
                `-${backgroundShift}px -${40 * (storage.USER_DATA!.statistic.gameStats.currentRow - 1)}px`;
            backgroundShift += parseFloat(blocks[i].style.width);

            const afterBackgroundShiftX = backgroundShift - 2;
            const afterBackgroundShiftY = 40 * (storage.USER_DATA!.statistic.gameStats.currentRow - 1) + 11.5;

            blocks[i].style.setProperty(
                '--after-backgroundPosition',
                `-${afterBackgroundShiftX}px -${afterBackgroundShiftY}px`
            );
        }
    }

    private toggleBackground() {
        const fild = Array.from(
            this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1].children
        ) as HTMLElement[];
        if (checkAnswer(fild)) return;
        const currentWords: HTMLElement[] = [];
        const sourceCards = Array.from(this.sourceBlock.children) as HTMLElement[];
        sourceCards.forEach((item) => {
            if (item.classList.contains('source-word')) {
                currentWords.push(item);
            }
        });
        fild.forEach((item) => {
            if (item.classList.contains('source-word')) {
                currentWords.push(item);
            }
        });
        currentWords.forEach((item) => {
            if (this.hints.backgroundHintIcon.getElement().classList.contains('background-hint-button--on')) {
                item.style.backgroundImage = `url(${storage.USER_DATA!.statistic.gameStats.currentPuctire})`;
                item.style.setProperty(
                    '--after-backgroundImage',
                    `url(${storage.USER_DATA!.statistic.gameStats.currentPuctire})`
                );
            } else {
                item.style.backgroundImage = 'none';
                item.style.setProperty('--after-backgroundImage', 'none');
            }
        });
    }

    private showBackgroundOnCorrect() {
        const cards = Array.from(
            this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1].children
        ) as HTMLElement[];
        cards.forEach((item) => {
            item.style.backgroundImage = `url(${storage.USER_DATA!.statistic.gameStats.currentPuctire})`;
            item.style.setProperty(
                '--after-backgroundImage',
                `url(${storage.USER_DATA!.statistic.gameStats.currentPuctire})`
            );
        });
    }

    private resizeBackground() {
        const field = Array.from(this.rowField.children) as HTMLElement[];
        field.forEach((item) => {
            (Array.from(item.children) as HTMLElement[]).forEach((card) => {
                card.style.backgroundSize = `${this.rowField.clientWidth}px ${this.rowField.clientHeight}px`;
            });
        });
    }

    private configureAsnwerRow() {
        const quantityClearBlocks = Array.from(this.sourceBlock.children).length;
        for (let i = 0; i < quantityClearBlocks; i += 1) {
            const clearCard = this.createCard({ tag: 'div', className: ['clear-card'] });
            this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1].append(clearCard);
        }
    }

    private configureGame() {
        this.updateSourceBlock();
        this.collection.then((item) => {
            const wordsArray: string[] =
                item.rounds[storage.USER_DATA!.statistic.gameStats.round].words[
                    storage.USER_DATA!.statistic.gameStats.currentRow - 1
                ].textExample.split(' ');
            storage.USER_DATA!.statistic.gameStats.correctSentence = wordsArray.join(' ');
            storage.USER_DATA!.statistic.gameStats.maxRoundOfLevel = item.roundsCount;
            this.selectionField.updateLevel(storage.USER_DATA!.statistic.gameStats.level + 1, item.roundsCount);
            this.selectionField.updateRoundOptions(item.roundsCount);
            this.hints.translationSentence.setTextContent(
                item.rounds[storage.USER_DATA!.statistic.gameStats.round].words[
                    storage.USER_DATA!.statistic.gameStats.currentRow - 1
                ].textExampleTranslate
            );
            this.hints.audioFile = this.hints.getAudio(
                item,
                storage.USER_DATA!.statistic.gameStats.round,
                storage.USER_DATA!.statistic.gameStats.currentRow
            );
            storage.USER_DATA!.statistic.gameStats.currentPuctire = `${GAME.backgroundUrl}${item.rounds[storage.USER_DATA!.statistic.gameStats.round].levelData.imageSrc}`;
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
            this.addBackgroundAsPuzzle();
            this.toggleBackground();
            window.addEventListener('resize', () => {
                calculateBlockWidth(this.rowField, arrayWords);
                // this.resizeBackground();
            });
            if (this.buttonField.continueButton.getElement().style.display !== 'none') {
                this.buttonField.hideButton(this.buttonField.continueButton.getElement());
                this.buttonField.showButton(this.buttonField.checkButton.getElement());
            }
            this.buttonField.disableButton(this.buttonField.checkButton.getElement());
            this.buttonField.showButton(this.buttonField.autoCompleteButton.getElement());
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
        const currentRow = Array.from(this.rowField.children)[
            storage.USER_DATA!.statistic.gameStats.currentRow - 1
        ] as HTMLElement;
        swapElements(target, currentRow, this.sourceBlock);
        this.updateAnswerSentence(currentRow);
        this.checkFullFilledRow(currentRow);
        this.dragging = false;
    }

    private onClickCheck(): void {
        const currentRow = Array.from(this.rowField.children)[
            storage.USER_DATA!.statistic.gameStats.currentRow - 1
        ] as HTMLElement;
        const arrayFromRow = Array.from(currentRow.children) as HTMLElement[];
        if (!checkAnswer(arrayFromRow)) {
            this.paintCheckBlocks(
                storage.USER_DATA!.statistic.gameStats.correctSentence,
                storage.USER_DATA!.statistic.gameStats.currentAnswerSentence,
                this.timer
            );
        }
    }

    private onClickContinue(): void {
        if (this.onClickCard) this.gameField.removeEventListener('pointerdown', this.onClickCard);
        this.buttonField.hideButton(this.buttonField.continueButton.getElement());
        this.buttonField.showButton(this.buttonField.checkButton.getElement());

        this.completeRow();
    }

    private onClickAutoComplete() {
        const wordsFromSource = Array.from(this.sourceBlock.children).filter((item) =>
            item.classList.contains('source-word')
        );
        const wordsFromAnswerRow = Array.from(
            this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1].children
        ).filter((item) => item.classList.contains('source-word'));
        const neededBlock = [...wordsFromSource, ...wordsFromAnswerRow];
        const row = this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1] as HTMLElement;
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

    private paintCheckBlocks(correctSentence: string, currentSentence: string, timer: GAME.Timer): void {
        const currentBlocks = Array.from(
            this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1].children
        ) as HTMLElement[];
        if (timer.removeClasses) {
            clearTimeout(timer.removeClasses);
            currentBlocks.forEach((item) => item.classList.remove('paint-wrong', 'paint-true'));
        }
        for (let i = 0; i < currentBlocks.length; i += 1) {
            currentBlocks[i].classList.remove('paint-wrong', 'paint-true');
            if (currentBlocks[i].id === `w${i}`) {
                currentBlocks[i].classList.add('paint-true');
            } else {
                currentBlocks[i].classList.add('paint-wrong');
            }
        }
        timer.removeClasses = setTimeout(() => {
            currentBlocks.forEach((item) => item.classList.remove('paint-wrong', 'paint-true'));
        }, 3000);
    }

    private onDragCard(): void {
        const zoneSource = this.sourceBlock as HTMLElement;
        const zoneAnswer = this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1] as HTMLElement;

        zoneSource.addEventListener('pointerdown', this.onPointerDown);
        zoneSource.addEventListener('pointerup', this.onPointerUp);
        zoneAnswer.addEventListener('pointerdown', this.onPointerDown);
        zoneAnswer.addEventListener('pointerup', this.onPointerUp);
        document.body.addEventListener('pointermove', this.onPointerMove);
    }

    private onDragCardRemove() {
        const zoneSource = this.sourceBlock as HTMLElement;
        const zoneAnswer = this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1] as HTMLElement;

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
                hovered.classList.contains(`row-${storage.USER_DATA!.statistic.gameStats.currentRow}`) ||
                (hovered.classList.contains(`clear-card`) &&
                    hoveredParent?.classList.contains(`row-${storage.USER_DATA!.statistic.gameStats.currentRow}`))
            ) {
                // * Если навелись на область строки с ответом или пустую ячейку (вставляем вначало)
                swapElements(
                    element,
                    this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1] as HTMLElement,
                    this.sourceBlock
                );
            } else if (
                hovered.classList.contains(`source-word`) &&
                hoveredParent?.classList.contains(`row-${storage.USER_DATA!.statistic.gameStats.currentRow}`)
            ) {
                // * Если навели на вставленную карточку в строке с ответами (вставляем перед наведенным элементом)
                swapElements(
                    element,
                    this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1] as HTMLElement,
                    this.sourceBlock
                );
                (
                    this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1] as HTMLElement
                ).insertBefore(element, hovered);
            }
        } else if (
            element.parentElement?.classList.contains(`row-${storage.USER_DATA!.statistic.gameStats.currentRow}`)
        ) {
            // *** Если взяли элемент из answer row

            if (
                hovered.classList.contains('source-word') &&
                hoveredParent?.classList.contains(`row-${storage.USER_DATA!.statistic.gameStats.currentRow}`)
            ) {
                // * Если меняем элементы в строке ответов
                const tempNode = document.createElement('div');
                elementParent?.replaceChild(tempNode, element);
                elementParent?.replaceChild(element, hovered);
                elementParent?.replaceChild(hovered, tempNode);
            } else if (hoveredParent?.classList.contains('game-field__source-words')) {
                // * Если из строки ответов тянем в строку слов
                swapElements(
                    element,
                    this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1] as HTMLElement,
                    this.sourceBlock
                );
            }
        }

        this.updateAnswerSentence(
            this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1] as HTMLElement
        );
        this.checkFullFilledRow(
            this.rowField.children[storage.USER_DATA!.statistic.gameStats.currentRow - 1] as HTMLElement
        );
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
        const arrayFromRow = Array.from(answerRow.children) as HTMLElement[];
        const result = arrayFromRow.every((item) => !item.classList.contains('clear-card'));
        if (!result) {
            this.buttonField.disableButton(this.buttonField.checkButton.getElement());
            return;
        }

        if (checkAnswer(arrayFromRow)) {
            this.buttonField.showButton(this.buttonField.continueButton.getElement());
            this.buttonField.hideButton(this.buttonField.checkButton.getElement());
            this.buttonField.hideButton(this.buttonField.autoCompleteButton.getElement());
            this.showHintsAfterSuccess();
            this.showBackgroundOnCorrect();
            this.onDragCardRemove();

            if (this.onClickCard && this.gameField) {
                this.gameField.removeEventListener('pointerup', this.onClickCard);
            }
        } else {
            this.buttonField.enableButton(this.buttonField.checkButton.getElement());
        }
    }

    private updateAnswerSentence(row: HTMLElement): void {
        const arrayFromRow = Array.from(row.children).map((item) => item.textContent);
        storage.USER_DATA!.statistic.gameStats.currentAnswerSentence = arrayFromRow.join(' ');
    }

    private enableTranslateHint = (btn: HTMLButtonElement) => {
        btn.classList.remove('translate-button--off');
        btn.classList.add('translate-button--on');
        this.hints.translationSentence.getElement().hidden = false;
        storage.USER_DATA!.settings.translateHint = true;
    };

    private disableTranslateHint = (btn: HTMLButtonElement) => {
        btn.classList.remove('translate-button--on');
        btn.classList.add('translate-button--off');
        this.hints.translationSentence.getElement().hidden = true;
        storage.USER_DATA!.settings.translateHint = false;
    };

    private onClickTranslationIcon() {
        const translateButton = this.hints.translationIcon.getElement();
        translateButton.addEventListener('click', () => {
            const translateSettings = storage.USER_DATA!.settings.translateHint;
            if (translateSettings) {
                this.disableTranslateHint(translateButton);
            } else {
                this.enableTranslateHint(translateButton);
            }
            storage.updateStorage();
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
            const pronounceSettings = storage.USER_DATA!.settings.pronounceHint;
            if (pronounceSettings) {
                this.disablePronounceHint(pronounceHintButton);
            } else {
                this.enablePronounceHint(pronounceHintButton);
            }
            storage.updateStorage();
        });
    };

    private enablePronounceHint(btn: HTMLButtonElement): void {
        btn.classList.add('pronounce-hint-button--on');
        this.hints.pronounceSentence.getElement().hidden = false;
        storage.USER_DATA!.settings.pronounceHint = true;
    }

    private disablePronounceHint(btn: HTMLButtonElement): void {
        btn.classList.remove('pronounce-hint-button--on');
        this.hints.pronounceSentence.getElement().hidden = true;
        storage.USER_DATA!.settings.pronounceHint = false;
    }
    private onBackgroundHintClick = (): void => {
        const backgroundHint = this.hints.backgroundHintIcon.getElement();
        backgroundHint.addEventListener('click', () => {
            const backgroundSettings = storage.USER_DATA!.settings.backgroundHint;
            if (backgroundSettings) {
                this.disableBackgroundHint(backgroundHint);
            } else {
                this.enableBackgroundHint(backgroundHint);
            }

            storage.updateStorage();
        });
    };

    private enableBackgroundHint(btn: HTMLButtonElement): void {
        btn.classList.add('background-hint-button--on');
        this.toggleBackground();
        storage.USER_DATA!.settings.backgroundHint = true;
    }

    private disableBackgroundHint(btn: HTMLButtonElement): void {
        btn.classList.remove('background-hint-button--on');
        this.toggleBackground();
        storage.USER_DATA!.settings.backgroundHint = false;
    }

    private showHintsAfterSuccess(): void {
        if (this.hints.translationIcon.getElement().classList.contains('translate-button--off')) {
            this.hints.translationSentence.getElement().hidden = false;
        }
        if (!this.hints.pronounceSentence.getElement().classList.contains('pronounce-hint-button--on')) {
            this.hints.pronounceSentence.getElement().hidden = false;
        }
    }

    private addHintEvents() {
        this.onClickTranslationIcon();
        this.onPronounceClick();
        this.onPronounceHintClick();
        this.onBackgroundHintClick();
    }

    private setUserSettings() {
        const settings = storage.USER_DATA!.settings;
        if (!settings.translateHint) {
            this.disableTranslateHint(this.hints.translationIcon.getElement());
        }
        if (!settings.pronounceHint) {
            this.disablePronounceHint(this.hints.pronounceHintIcon.getElement());
        }
        if (!settings.backgroundHint) {
            this.disableBackgroundHint(this.hints.backgroundHintIcon.getElement());
        }
    }

    private onChangeLevel(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        storage.changeLevel(value);
        this.collection = getJson(`./data/wordCollectionLevel${storage.USER_DATA!.statistic.gameStats.level + 1}.json`);
        this.gameField.removeEventListener('pointerup', this.onClickCard!);
        this.updateRowField();
        this.configureGame();
    }

    private onChangeRound(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        storage.changeRound(value);
        this.selectionField.roundSelect.getElement().value = value;
        this.gameField.removeEventListener('pointerup', this.onClickCard!);
        this.updateRowField();
        this.configureGame();
    }

    private completeRow() {
        const data = storage.USER_DATA?.statistic;
        if (!data) return;
        data.gameStats.currentRow += 1;
        if (data.gameStats.currentRow === 11) {
            storage.saveCompletedRound();
            data.gameStats.currentRow = 1;
            this.updateRowField();
            const level = `level ${data.gameStats.level + 1}` as keyof typeof data.roundsCompleted;
            if (data.roundsCompleted[level][1] === true) {
                this.selectionField.levelSelect.getElement().options[data.gameStats.level].style.backgroundColor =
                    'green';
            }
            if (data.gameStats.level === 5 && data.gameStats.round === data.gameStats.maxRoundOfLevel) {
                data.gameStats.level = 0;
                data.gameStats.round = 0;
                this.collection = getJson(`./data/wordCollectionLevel${data.gameStats.level + 1}.json`);
                this.updateRowField();
            } else if (data.gameStats.round === data.gameStats.maxRoundOfLevel) {
                data.gameStats.level += 1;
                data.gameStats.round = 0;
                this.collection = getJson(`./data/wordCollectionLevel${data.gameStats.level + 1}.json`);
                this.updateRowField();
            }
            storage.updateStorage();
        }

        this.gameField.removeEventListener('pointerup', this.onClickCard!);
        if (this.gameField) this.configureGame();
    }

    configureView(): void {
        this.configureGame();
        this.updateRowField();
        this.addHintEvents();
        this.setUserSettings();
        this.gameField.append(this.rowField, this.sourceBlock, this.buttonField.getViewHtml());
        this.getViewHtml().append(this.selectionField.getViewHtml(), this.hints.getViewHtml(), this.gameField);
    }
}

export default GameView;
