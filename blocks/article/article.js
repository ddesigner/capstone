
export default async function decorate(block) {

    // Containers
    const listContainer = document.createElement('div');
    listContainer.className = 'article-container';
    const ul = document.createElement('ul');
    ul.className = 'article-list';
    listContainer.append(ul);
    block.appendChild(listContainer);
    let articles = [];

    try {
        // Fetch article data (fix the double .json if it was a typo)
        const response = await fetch('/articles.json', { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching /articles.json`);
        const json = await response.json();

        articles = Array.isArray(json?.data) ? json.data : [];
        console.log("article", articles);
        renderList(articles);
    } catch (error) {
        console.error('Error loading articles:', error);
        block.textContent = 'Failed to load articles.';
    }

    /** Renders all items (no pagination) into <ul> */
    function renderList(items) {
        ul.innerHTML = '';

        const frag = document.createDocumentFragment();

        items.forEach((article) => {
            const li = document.createElement('li');
            li.className = 'article-card';

            // avatar container
            const imgWrap = document.createElement('div');
            imgWrap.className = 'article-img';

            const img = document.createElement('img');
            const src = typeof article.image === 'string' && article.image.trim()
                ? article.image
                : '';
            img.src = src;
            img.alt = typeof article.name === 'string' && article.name.trim()
                ? article.name
                : 'article photo';
            img.loading = 'lazy';
            img.decoding = 'async';

            imgWrap.appendChild(img);
            li.appendChild(imgWrap);

            // Safe text rows (avoid innerHTML for user data)
            const div = document.createElement('div');
            div.className = 'article-details';
            const row = (value, className) => {
                const articleTitle = document.createElement('p');
                articleTitle.className = className;
                articleTitle.textContent = value ?? '';

                div.append(articleTitle);
                return div;
            };

            const description = typeof article.description === 'string' ? article.description : '';
            const title = typeof article.title === 'string' ? article.title : '';

            li.appendChild(row(title, "title"));
            li.appendChild(row(description, "description"));

            frag.appendChild(li);
        });

        if (items.length === 0) {
            const li = document.createElement('li');
            li.className = 'article-card empty';
            li.textContent = 'No articles found.';
            frag.appendChild(li);
        }

        ul.appendChild(frag);
    }
}
