/**
*match URl and add active class on nav
 */
function addNavActive() {
    function normalizePath(path) {
        return path.replace(/\/+$/, "") || "/";
    }

    const containers = document.querySelectorAll(".nav-sections .button-container");
    const currentPath = normalizePath(window.location.pathname);
    if (currentPath === "/") return;

    containers.forEach(container => {
        const link = container.querySelector("a");
        if (!link) return;

        const linkPath = normalizePath(new URL(link.href).pathname);

        if (currentPath === linkPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

}

addNavActive();