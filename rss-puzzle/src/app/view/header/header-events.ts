const showLogoutButton = (element: HTMLElement): void => {
    element.style.display = 'block';
};
const hideLogoutButton = (element: HTMLElement): void => {
    element.style.display = 'none';
};

export { showLogoutButton, hideLogoutButton };
