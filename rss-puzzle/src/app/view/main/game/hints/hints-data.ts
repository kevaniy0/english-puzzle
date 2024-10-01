import { ElementParams } from '../../../../utils/elementCreator/elementCreator';

export const component: ElementParams<'div'> = { tag: 'div', className: ['hints'] };
export const translate: ElementParams<'p'> = { tag: 'p', className: ['translation-sentence'] };
export const iconsWrapper: ElementParams<'div'> = { tag: 'div', className: ['hint-icons'] };
export const translateButton: ElementParams<'button'> = {
    tag: 'button',
    className: ['hint-icon', 'translate-button', 'translate-button--on'],
};
export const translateSpan: ElementParams<'span'> = { tag: 'span', className: ['translate-span'] };
export const translateHoverTitle: string = 'Translate Sentence';
