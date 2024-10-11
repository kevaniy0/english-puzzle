import { ElementParams } from '../../../../utils/elementCreator/elementCreator';

export const statisticComponent: ElementParams<'div'> = { tag: 'div', className: ['statistic-view'] };
export const statisticWrapper: ElementParams<'div'> = { tag: 'div', className: ['statistic-wrapper'] };
export const continueButton: ElementParams<'button'> = {
    tag: 'button',
    className: ['btn', 'stats-continue-btn'],
    textContent: 'Continue',
};
