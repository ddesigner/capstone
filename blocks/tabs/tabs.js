// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
    // build tablist
    const tablist = document.createElement('div');
    tablist.className = 'tabs-list';
    tablist.setAttribute('role', 'tablist');

    // decorate tabs and tabpanels
    const tabs = [...block.children].map((child) => child.firstElementChild);
    tabs.forEach((tab, i) => {
        const id = toClassName(tab.textContent);

        // decorate tabpanel
        const tabpanel = block.children[i];
        tabpanel.className = 'tabs-panel';
        tabpanel.id = `tabpanel-${id}`;
        tabpanel.setAttribute('aria-hidden', !!i);
        tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
        tabpanel.setAttribute('role', 'tabpanel');

        // build tab button
        const button = document.createElement('button');
        button.className = 'tabs-tab';
        button.id = `tab-${id}`;
        button.innerHTML = tab.innerHTML;
        button.setAttribute('aria-controls', `tabpanel-${id}`);
        button.setAttribute('aria-selected', !i);
        button.setAttribute('role', 'tab');
        button.setAttribute('type', 'button');
        button.addEventListener('click', () => {
            block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
                panel.setAttribute('aria-hidden', true);
            });
            tablist.querySelectorAll('button').forEach((btn) => {
                btn.setAttribute('aria-selected', false);
            });
            tabpanel.setAttribute('aria-hidden', false);
            button.setAttribute('aria-selected', true);

            //Call on tab click
            filterAndRender(id)
        });
        tablist.append(button);
        tab.remove();
    });

    block.prepend(tablist);

    //Call on page load
    const firstTab = block.children[1].id
    getAdventures(firstTab);
}
let adventuresCache = null;
async function getAdventures(firstTab) {
    if (adventuresCache) {
        console.log("Using cached adventures");
        renderList(adventuresCache);
        return adventuresCache;
    }
    let response;
    try {
        response = await fetch("/adventures/adventures.json");
        if (!response.ok) {
            throw new Error(`Fetched faild ${response.status} ${response.statusText}`)
        }
        const advantureList = await response.json();
        if (!advantureList && !Array.isArray(advantureList.data)) {
            throw new Error(`Invalid response shape:data:[]`)
        }
        adventuresCache = advantureList.data;
        renderList(adventuresCache, firstTab)
        return adventuresCache
    } catch (err) {
        throw new Error("Unable to load adventures", { cause: err });

    }
}

function filterAndRender(id) {
    const panelId = `tabpanel-${id}`;
    if (adventuresCache !== null && !document.getElementById(panelId).querySelectorAll('.adv-wrapper').length) {
        const filterData = adventuresCache.filter((item) => {
            return item.category.includes(id);
        });
        renderList(filterData, panelId)
    }

}

function renderList(adventuresList, panelId) {
    const tabContainer = document.getElementById(panelId);
    const ul = document.createElement("ul");
    adventuresList.map((item) => {
        const li = document.createElement('li');
        li.className = "adv-wrapper";

        const imageWrap = document.createElement("div");
        imageWrap.className = "adv-img";
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.title;
        image.loading = 'lazy';
        image.decoding = 'async';
        imageWrap.appendChild(image);

        const detailWrap = document.createElement("div");
        detailWrap.className = "adv-details"

        const title = document.createElement("h3");
        title.className = "adv-title";
        title.textContent = item.title;

        const description = document.createElement("p");
        description.className = "adv-des";
        description.textContent = item.description;

        //create link
        const link = item.title !== '' ? 'adventures/' + item.title.toLowerCase().replaceAll(' ', '-') : '';
        const href = document.createElement('a');
        href.setAttribute('href', link);
        href.setAttribute('title', title)

        detailWrap.appendChild(title);
        detailWrap.appendChild(description);

        li.appendChild(imageWrap);
        li.appendChild(detailWrap);

        // Now wrap all current children of <li> with <a>
        while (li.firstChild) {
            href.appendChild(li.firstChild);
        }
        li.appendChild(href);
        ul.appendChild(li);
    })
    tabContainer.append(ul);
}