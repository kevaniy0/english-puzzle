import { ElementParams } from '../../../../utils/elementCreator/elementCreator';

export const statisticComponent: ElementParams<'div'> = { tag: 'div', className: ['statistic-view'] };
export const statisticWrapper: ElementParams<'div'> = { tag: 'div', className: ['statistic-wrapper'] };
export const continueButton: ElementParams<'button'> = {
    tag: 'button',
    className: ['btn', 'stats-continue-btn'],
    textContent: 'Continue',
};

export const knownField: ElementParams<'div'> = { tag: 'div', className: ['sentences-field', 'known-field'] };
export const unknownField: ElementParams<'div'> = { tag: 'div', className: ['sentences-field', 'unknown-field'] };

export const knownTitle: ElementParams<'p'> = {
    tag: 'p',
    className: ['known-title', 'stat-title'],
    textContent: 'I know:',
};
export const unknownTitle: ElementParams<'p'> = {
    tag: 'p',
    className: ['unknown-title', 'stat-title'],
    textContent: "I don't know:",
};

export const sentencesWrapper: ElementParams<'div'> = { tag: 'div', className: ['sentences-wrapper'] };

export const sentenceItem: ElementParams<'p'> = { tag: 'p', className: ['sentence-item'] };

export const audioIcon: ElementParams<'span'> = { tag: 'span', className: ['audio-icon'] };
export const audioLoader: ElementParams<'span'> = { tag: 'span', className: ['audio-loader'] };
