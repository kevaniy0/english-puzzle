import { ElementParams } from '../../../utils/elementCreator/elementCreator';
export const page: ElementParams<'section'> = { tag: 'section', className: ['section-greeting'] };
export const title: ElementParams<'h2'> = {
    tag: 'h2',
    className: ['greeting-title'],
    textContent: 'English Puzzle - Build Your English, Block by Block',
};

export const description: ElementParams<'h3'> = {
    tag: 'h3',
    className: ['greeting-description'],
    textContent:
        'Engaging game designed to help players learn English through puzzle-solving. Players form correct sentences by connecting words, enhancing their grammar and vocabulary skills. Suitable for all language levels, this game turns learning into a fun and interactive experience!',
};

export const wrapperBlock: ElementParams<'div'> = { tag: 'div', className: ['interaction-block'] };
export const imgLearn: ElementParams<'img'> = { tag: 'img', className: ['greeting-lern-pic', 'img'] };
export const imgPuzzle: ElementParams<'img'> = { tag: 'img', className: ['greeting-puzzle-pic', 'img'] };
export const startButton: ElementParams<'a'> = {
    tag: 'a',
    className: ['greeting-start-button'],
    textContent: 'START',
};

export const user: ElementParams<'div'> = { tag: 'div', className: ['user-greeting'] };
export const userTitle: ElementParams<'h4'> = { tag: 'h4', className: ['user-greeting__title'] };
