
export default async function decorate(block) {

    // Containers
    const listContainer = document.createElement('div');
    listContainer.className = 'writer-container';
    const ul = document.createElement('ul');
    ul.className = 'writer-list';
    listContainer.append(ul);
    block.appendChild(listContainer);
    let writers = [];

    try {
        // Fetch writer data (fix the double .json if it was a typo)
        const response = await fetch('/writer.json', { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching /writer.json`);
        const json = await response.json();

        writers = Array.isArray(json?.data) ? json.data : [];
        console.log(writers);
        renderList(writers);
    } catch (error) {
        console.error('Error loading writers:', error);
        block.textContent = 'Failed to load writers.';
    }

    /** Renders all items (no pagination) into <ul> */
    function renderList(items) {
        ul.innerHTML = '';

        const frag = document.createDocumentFragment();

        items.forEach((writer) => {
            const li = document.createElement('li');
            li.className = 'writer-card';

            // avatar container
            const imgWrap = document.createElement('div');
            imgWrap.className = 'avatar-img';

            const img = document.createElement('img');
            const src = typeof writer.avatar === 'string' && writer.avatar.trim()
                ? writer.avatar
                : ''; // optional: put your placeholder URL here
            img.src = src;
            img.alt = typeof writer.name === 'string' && writer.name.trim()
                ? writer.name
                : 'writer photo';
            img.loading = 'lazy';
            img.decoding = 'async';

            imgWrap.appendChild(img);
            li.appendChild(imgWrap);

            // Safe text rows (avoid innerHTML for user data)
            const row = (value) => {
                const div = document.createElement('div');
                div.className = 'writer-details';

                const writerName = document.createElement('h3');
                writerName.className = 'name';
                writerName.textContent = value ?? '';

                div.append(writerName);
                return div;
            };

            const name = typeof writer.name === 'string' ? writer.name : '';
            const title = typeof writer.title === 'string' ? writer.title : '';

            li.appendChild(row(name));
            li.appendChild(row(title));

            frag.appendChild(li);
        });

        if (items.length === 0) {
            const li = document.createElement('li');
            li.className = 'writer-card empty';
            li.textContent = 'No writers found.';
            frag.appendChild(li);
        }

        ul.appendChild(frag);
    }
}
