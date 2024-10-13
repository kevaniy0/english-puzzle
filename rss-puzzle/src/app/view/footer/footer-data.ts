import { ElementParams } from '../../utils/elementCreator/elementCreator';

export const footerComponent: ElementParams<'footer'> = { tag: 'footer', className: ['footer'] };
export const info: ElementParams<'p'> = { tag: 'p', className: ['footer-info'], textContent: `©   2024` };
export const link: ElementParams<'a'> = { tag: 'a', className: ['github-link'] };
export const github = `https://github.com/kevaniy0`;
