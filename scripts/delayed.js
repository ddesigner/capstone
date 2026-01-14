/**
*match URl and add active class on nav
 */
function addNavActive() {
    const containers = document.querySelectorAll(".nav-sections .button-container");
    const currentPath = window.location.pathname;

    containers.forEach(container => {
        const link = container.querySelector("a");
        if (!link) return;

        if (currentPath === link.pathname) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

addNavActive();