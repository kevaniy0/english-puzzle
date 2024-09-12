import { ElementParams } from '../../../utils/elementCreator/elementCreator';
export const greetingPage: ElementParams<'section'> = { tag: 'section', className: ['section-greeting'] };
export const greetingTitle: ElementParams<'h2'> = {
    tag: 'h2',
    className: ['greeting-title'],
    textContent: 'English Puzzle - Build Your English, Block by Block',
};

export const greetingDescription: ElementParams<'h3'> = {
    tag: 'h3',
    className: ['greeting-description'],
    textContent:
        'Engaging game designed to help players learn English through puzzle-solving. Players form correct sentences by connecting words and phrases, enhancing their grammar and vocabulary skills. Suitable for all language levels, this game turns learning into a fun and interactive experience!',
};

export const greetingWrapperBlock: ElementParams<'div'> = { tag: 'div', className: ['wrapper-interaction-block'] };
export const greetingImgLearn: ElementParams<'img'> = { tag: 'img', className: ['greeting-lern-pic', 'img'] };
export const greetingImgPuzzle: ElementParams<'img'> = { tag: 'img', className: ['greeting-puzzle-pic', 'img'] };
export const greetingStartButton: ElementParams<'a'> = {
    tag: 'a',
    className: ['greeting-start-button'],
    textContent: 'START',
};
