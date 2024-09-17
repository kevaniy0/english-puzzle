import './header.scss';
import ElementCreator from '../../utils/elementCreator/elementCreator';
import { ElementParams } from '../../utils/elementCreator/elementCreator';
import View from '../view';
import * as HEADER_DATA from './header-data';
import Router from '../../router/router';
import PopupCreator from '../../utils/popupCreator/popupCreator';
import eventEmitter from '../../utils/eventEmitter/eventEmitter';
import { showLogoutButton, hideLogoutButton } from './header-events';
class Header extends View {
    router: Router;
    constructor(router: Router) {
        const params: ElementParams<'header'> = {
            tag: 'header',
            className: ['header'],
        };
        super(params);
        this.router = router;
        this.configureView();
    }

    private createTitle(params: ElementParams<'h1'>) {
        const title = new ElementCreator(params);
        return title;
    }

    private createLogout(params: ElementParams<'a'>) {
        const logout = new ElementCreator(params);

        return logout;
    }

    private createPopup(logout: ElementCreator<'a'>) {
        const pupup = new PopupCreator(
            this.router,
            HEADER_DATA.popupParams,
            HEADER_DATA.popupWrapperParams,
            HEADER_DATA.logoutImgParams,
            HEADER_DATA.popupTitleParams,
            HEADER_DATA.popupBtnsWrapperParams,
            HEADER_DATA.popupBtnYesParams,
            HEADER_DATA.popupBtnNoParams,
            logout
        );

        return pupup;
    }

    configureView(): void {
        const title = this.createTitle(HEADER_DATA.titleParams);
        this.view.getElement().append(title.getElement());

        const logout = this.createLogout(HEADER_DATA.logoutParams);
        eventEmitter.subscribe('showLogoutButton', showLogoutButton.bind(null, logout.getElement()));
        eventEmitter.subscribe('hideLogoutButton', hideLogoutButton.bind(null, logout.getElement()));

        const popup = this.createPopup(logout);
        this.view.getElement().append(popup.getElement());

        this.view.getElement().append(logout.getElement());

        logout.getElement().addEventListener('click', () => {
            popup.getElement().hidden = false;
        });
    }
}

export default Header;
