 const API_URL = 'http://localhost:3000';

async function fetchFiles() {
    const res = await fetch(`${API_URL}/files`);
    const files = await res.json();

        const list = document.getElementById('fileList');
        list.innerHTML = '';
        files.forEach(file => {
            const col = document.createElement('div');
            col.className = 'col-md-6';

            const card = document.createElement('div');
            card.className = 'card shadow-sm';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const name = document.createElement('h5');
            name.className = 'card-title';
            name.textContent = file.name;

            const preview = document.createElement('div');
            preview.className = 'mb-3';

            if (file.name.endsWith('.pdf')) {
                preview.innerHTML = `<embed class="preview w-100" src="${API_URL}/download/${file.id}" type="application/pdf" />`;
            } else if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                preview.innerHTML = `<img class="preview" src="${API_URL}/download/${file.id}" alt="${file.name}" />`;
            } else {
                preview.innerHTML = `<div class="text-center text-secondary py-5"><i class='bx bx-file-x' style="font-size: 3rem;"></i><p>Archivo no soportado</p></div>`;
            }

            const button = document.createElement('a');
            button.className = 'btn btn-outline-primary';
            button.textContent = '📥 Descargar';
            button.href = `${API_URL}/force-download/${file.id}`;
            button.target = '_blank';

            cardBody.appendChild(name);
            cardBody.appendChild(preview);
            cardBody.appendChild(button);
            card.appendChild(cardBody);
            col.appendChild(card);
            list.appendChild(col);
        });
}

window.onload = fetchFiles;