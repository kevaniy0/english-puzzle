import { ElementParams } from '../../../../utils/elementCreator/elementCreator';

export const buttonWrapper: ElementParams<'div'> = { tag: 'div', className: ['game-button-field'] };

export const continueButton: ElementParams<'button'> = {
    tag: 'button',
    className: ['btn', 'btn-continue'],
    textContent: 'Continue',
};

export const checkButton: ElementParams<'button'> = {
    tag: 'button',
    className: ['btn', 'btn-check'],
    textContent: 'Check',
};
export const autoComplete: ElementParams<'button'> = {
    tag: 'button',
    className: ['btn', 'btn-auto-complete', 'btn--active'],
    textContent: 'Auto-Complete',
};
