import { createOptimizedPicture } from '../../scripts/aem.js';

const ICONS = {
    facebook: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691V11.01h3.13V8.309c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"/>
    </svg>
  `,
    twitter: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.68 4.68 0 0 0 2.048-2.578 9.37 9.37 0 0 1-2.965 1.133 4.66 4.66 0 0 0-7.93 4.248A13.23 13.23 0 0 1 1.671 3.149a4.66 4.66 0 0 0 1.443 6.213 4.64 4.64 0 0 1-2.112-.584v.06a4.66 4.66 0 0 0 3.737 4.566 4.67 4.67 0 0 1-2.104.08 4.66 4.66 0 0 0 4.35 3.234A9.34 9.34 0 0 1 .96 19.54a13.19 13.19 0 0 0 7.548 2.212c9.057 0 14.01-7.496 14.01-13.986 0-.21-.006-.423-.016-.634a10.01 10.01 0 0 0 2.46-2.548z"/>
    </svg>
  `,
    instagram: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.343 3.608 1.318.975.975 1.256 2.242 1.318 3.608.058 1.266.07 1.646.07 4.84 0 3.204-.012 3.584-.07 4.85-.062 1.366-.343 2.633-1.318 3.608-.975.975-2.242 1.256-3.608 1.318-1.266.058-1.646.07-4.85.07-3.194 0-3.574-.012-4.84-.07-1.366-.062-2.633-.343-3.608-1.318-.975-.975-1.256-2.242-1.318-3.608-.058-1.266-.07-1.646-.07-4.85 0-3.194.012-3.574.07-4.84.062-1.366.343-2.633 1.318-3.608.975-.975 2.242-1.256 3.608-1.318 1.266-.058 1.646-.07 4.84-.07z"/>
    </svg>
  `,
};

export default function decorate(block) {
    const ul = document.createElement('ul');

    [...block.children].forEach((row) => {
        const li = document.createElement('li');

        while (row.firstElementChild) li.append(row.firstElementChild);
        li.querySelectorAll('a[title]').forEach((a) => {
            const key = a.title.toLowerCase();
            if (ICONS[key]) {
                a.innerHTML = ICONS[key];
                a.classList.add('social-icon', `social-${key}`);
                a.setAttribute('aria-label', key);
            }
        });

        ul.append(li);
    });

    block.textContent = '';
    block.append(ul);
}
