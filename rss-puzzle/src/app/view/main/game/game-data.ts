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

export type Timer = {
    removeClasses: ReturnType<typeof setTimeout> | null;
};

export type CheckDrag = {
    element: HTMLElement | null;
    readonly DRAX_PX: 5;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
};

export const backgroundUrl: string =
    'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/';
export const audioUrl: string = 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/';

export const page: ElementParams<'section'> = { tag: 'section', className: ['game-section'] };
export const field: ElementParams<'div'> = { tag: 'div', className: ['game-field'] };
export const rowsFild: ElementParams<'div'> = { tag: 'div', className: ['game-field__rows-field'] };
export const row: ElementParams<'div'> = { tag: 'div', className: ['game-field__row'] };
export const sourceWords: ElementParams<'div'> = { tag: 'div', className: ['game-field__source-words'] };

export const autorBlock: ElementParams<'div'> = { tag: 'div', className: ['autor-block', 'show-autor'] };
