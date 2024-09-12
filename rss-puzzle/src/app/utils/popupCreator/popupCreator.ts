import './popup.scss';
import Router from '../../router/router';
import ElementCreator from '../elementCreator/elementCreator';
import { ElementParams } from '../elementCreator/elementCreator';

class PopupCreator {
    router: Router;
    popup: ElementCreator<'div'>;
    constructor(
        router: Router,
        params: ElementParams<'div'>,
        popupWrapperParams: ElementParams<'div'>,
        logoutImgParams: ElementParams<'img'>,
        titlePopupParams: ElementParams<'h3'>,
        btnsWrapperParams: ElementParams<'div'>,
        btnYesParams: ElementParams<'button'>,
        btnNoParams: ElementParams<'button'>,
        logout: ElementCreator<'a'>
    ) {
        this.router = router;
        this.popup = this.createPopup(
            params,
            popupWrapperParams,
            logoutImgParams,
            titlePopupParams,
            btnsWrapperParams,
            btnYesParams,
            btnNoParams,
            logout
        );
    }

    private createPopup(
        params: ElementParams<'div'>,
        popupWrapperParams: ElementParams<'div'>,
        logoutImgParams: ElementParams<'img'>,
        titlePopupParams: ElementParams<'h3'>,
        btnsWrapperParams: ElementParams<'div'>,
        btnYesParams: ElementParams<'button'>,
        btnNoParams: ElementParams<'button'>,
        logout: ElementCreator<'a'>
    ): ElementCreator<'div'> {
        const popup = new ElementCreator(params);
        popup.getElement().hidden = true;
        const wrapperPopup = new ElementCreator(popupWrapperParams);
        popup.getElement().append(wrapperPopup.getElement());

        const logoutImg = new ElementCreator(logoutImgParams);
        logoutImg.getElement().src = './assets/img/user.png';
        wrapperPopup.getElement().append(logoutImg.getElement());

        const title = new ElementCreator(titlePopupParams);
        this.changeTitleColors(title);
        const btnsWrapper = new ElementCreator(btnsWrapperParams);
        const btnYes = new ElementCreator(btnYesParams);
        const btnNo = new ElementCreator(btnNoParams);
        btnsWrapper.getElement().append(btnYes.getElement(), btnNo.getElement());
        wrapperPopup.getElement().append(title.getElement(), btnsWrapper.getElement());

        popup.getElement().addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            if (target.classList.contains('popup-btn_yes')) {
                this.confirmLogout(logout);
                this.router.navigate('login');
            } else if (target.classList.contains('popup-btn_no') || target.classList.contains('logout-popup')) {
                popup.getElement().hidden = true;
            }
        });

        return popup;
    }

    changeTitleColors(title: ElementCreator<'h3'>) {
        const sentence = title.getElement().textContent!.split(' ');

        const spanText = sentence.splice(-2).join(' ');
        const span = new ElementCreator({ tag: 'span', className: ['title-span'] });
        span.getElement().textContent = spanText;

        title.getElement().textContent = sentence.join(' ') + ' ';
        title.getElement().append(span.getElement());
        return title;
    }

    getElement() {
        return this.popup.getElement();
    }

    confirmLogout(logout: ElementCreator<'a'>) {
        localStorage.removeItem('name');
        localStorage.removeItem('lastName');
        this.getElement().hidden = true;
        logout!.getElement().style.display = 'none';
    }
}

export default PopupCreator;
