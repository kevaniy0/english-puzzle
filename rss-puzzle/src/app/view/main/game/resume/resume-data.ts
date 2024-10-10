import { ElementParams } from '../../../../utils/elementCreator/elementCreator';

export const component: ElementParams<'div'> = { tag: 'div', className: ['auto-resume-game'] };
export const resumeTitle: ElementParams<'p'> = {
    tag: 'p',
    className: ['resume-title'],
    textContent: 'The game was resumed!',
};
