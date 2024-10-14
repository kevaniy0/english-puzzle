import { ElementParams } from '../../utils/elementCreator/elementCreator';

export const titleParams: ElementParams<'h1'> = {
    tag: 'h1',
    className: ['logo', 'header-logo'],
    textContent: 'English Puzzle',
};
export const logoutParams: ElementParams<'a'> = { tag: 'a', className: ['logout'] };

export const popupWrapperParams: ElementParams<'div'> = { tag: 'div', className: ['popup-wrapper'] };
export const popupParams: ElementParams<'div'> = { tag: 'div', className: ['popup', 'logout-popup'] };
export const popupTitleParams: ElementParams<'h3'> = {
    tag: 'h3',
    className: ['popup-title'],
    textContent: 'Are you sure you want to log out? All your results will be permanently deleted',
};

export const popupBtnsWrapperParams: ElementParams<'div'> = { tag: 'div', className: ['popup-btn-wrapper'] };

export const popupBtnYesParams: ElementParams<'button'> = {
    tag: 'button',
    className: ['popup-btn', 'popup-btn_yes'],
    textContent: 'YES',
};
export const popupBtnNoParams: ElementParams<'button'> = {
    tag: 'button',
    className: ['popup-btn', 'popup-btn_no'],
    textContent: 'NO',
};
export const logoutImgParams: ElementParams<'img'> = { tag: 'img', className: ['popup-img', 'popup-logout-img'] };
