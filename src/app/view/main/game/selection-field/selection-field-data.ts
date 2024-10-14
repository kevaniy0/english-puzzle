import { ElementParams } from '../../../../utils/elementCreator/elementCreator';

export const field: ElementParams<'div'> = { tag: 'div', className: ['selection-field'] };
export const wrapperLevel: ElementParams<'div'> = { tag: 'div', className: ['level-wrapper'] };
export const levelTitle: ElementParams<'label'> = { tag: 'label', className: ['level-title'], textContent: 'Level:' };
export const levelSelect: ElementParams<'select'> = { tag: 'select', className: ['level-select'] };
export const wrapperRound: ElementParams<'div'> = { tag: 'div', className: ['round-wrapper'] };
export const roundTitle: ElementParams<'label'> = { tag: 'label', className: ['round-title'], textContent: 'Round:' };
export const roundSelect: ElementParams<'select'> = { tag: 'select', className: ['round-select'] };
