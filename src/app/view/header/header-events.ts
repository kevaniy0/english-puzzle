const showLogoutButton = (element: HTMLElement): void => {
    element.style.display = 'block';
};
const hideLogoutButton = (element: HTMLElement): void => {
    element.style.display = 'none';
};

const addMarginForLoginPage = (element: HTMLElement): void => {
    element.classList.add('header-login-page');
};
const removeMarginForLoginPage = (element: HTMLElement): void => {
    element.classList.remove('header-login-page');
};

export { showLogoutButton, hideLogoutButton, addMarginForLoginPage, removeMarginForLoginPage };
