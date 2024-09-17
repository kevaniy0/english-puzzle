import { ElementParams } from '../../../utils/elementCreator/elementCreator';

export type Collection = {
    rounds: Round[];
    roundsCount: number;
};

export type Round = {
    levelData: LevelData;
    words: Word[];
};

export type LevelData = {
    id: string;
    name: string;
    imageSrc: string;
    cutSrc: string;
    author: string;
    year: string;
};

export type Word = {
    audioExample: string;
    textExample: string;
    textExampleTranslate: string;
    id: number;
    word: string;
    wordTranslate: string;
};

export const page: ElementParams<'section'> = { tag: 'section', className: ['game-section'] };
export const field: ElementParams<'div'> = { tag: 'div', className: ['game-field'] };
export const rowsFild: ElementParams<'div'> = { tag: 'div', className: ['game-field__rows-field'] };
export const row: ElementParams<'div'> = { tag: 'div', className: ['game-field__row'] };
export const cell: ElementParams<'div'> = { tag: 'div', className: ['game-field__cell'] };
export const sourceWords: ElementParams<'div'> = { tag: 'div', className: ['game-field__source-words'] };