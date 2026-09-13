/* ============================================
   FSOCIETY | EXPOSED — Script principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       EFECTO DE ESCRITURA EN LA FIRMA
       ============================================ */
    const firma = document.querySelector('.firma');

    if (firma) {
        const textoOriginal = firma.textContent.trim();
        firma.textContent = '';

        let i = 0;
        function escribirFirma() {
            if (i < textoOriginal.length) {
                firma.textContent += textoOriginal.charAt(i);
                i++;
                setTimeout(escribirFirma, 80);
            }
        }

        setTimeout(escribirFirma, 500);
    }

    /* ============================================
       BUSCADOR + PAGINACIÓN DE ANEXOS
       ============================================ */
    const buscador   = document.getElementById('buscador');
    const clearBtn   = document.getElementById('clear-search');
    const lista      = document.getElementById('anexos-list');
    const contador   = document.getElementById('results-count');
    const noResults  = document.getElementById('no-results');
    const pagination = document.getElementById('pagination');

    const POR_PAGINA = 5;   // ← 5 anexos por página

    let paginaActual = 1;

    if (buscador && lista) {
        const todosLosItems = Array.from(lista.querySelectorAll('li'));

        // -------- Render principal --------
        function renderizar() {
            const query = buscador.value.trim().toLowerCase();

            // Filtrar por búsqueda
            const filtrados = todosLosItems.filter(item =>
                item.textContent.toLowerCase().includes(query)
            );

            // Total de páginas
            const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
            if (paginaActual > totalPaginas) paginaActual = totalPaginas;

            const inicio = (paginaActual - 1) * POR_PAGINA;
            const fin    = inicio + POR_PAGINA;

            // Ocultar todos
            todosLosItems.forEach(item => item.style.display = 'none');

            // Mostrar solo los de esta página
            filtrados.slice(inicio, fin).forEach(item => {
                item.style.display = '';
            });

            // Mensaje sin resultados
            noResults.classList.toggle('visible', filtrados.length === 0);

            // Contador
            actualizarContador(filtrados.length, todosLosItems.length);

            // Paginación
            renderizarPaginacion(totalPaginas);
        }

        // -------- Render de botones de paginación --------
        function renderizarPaginacion(totalPaginas) {
            if (!pagination) return;
            pagination.innerHTML = '';

            if (totalPaginas <= 1) return;   // sin paginación si hay 1 sola página

            // Botón "‹" (anterior)
            const prev = document.createElement('button');
            prev.textContent = '‹';
            prev.className = 'page-btn';
            prev.disabled = paginaActual === 1;
            prev.addEventListener('click', () => {
                paginaActual--;
                renderizar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(prev);

            // Números de página
            for (let i = 1; i <= totalPaginas; i++) {
                const btn = document.createElement('button');
                btn.textContent = i;
                btn.className = 'page-btn' + (i === paginaActual ? ' active' : '');
                btn.addEventListener('click', () => {
                    paginaActual = i;
                    renderizar();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                pagination.appendChild(btn);
            }

            // Botón "›" (siguiente)
            const next = document.createElement('button');
            next.textContent = '›';
            next.className = 'page-btn';
            next.disabled = paginaActual === totalPaginas;
            next.addEventListener('click', () => {
                paginaActual++;
                renderizar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(next);
        }

        // -------- Contador de resultados --------
        function actualizarContador(visibles, total) {
            if (!contador) return;

            if (visibles === total) {
                contador.textContent = `${total} expedientes disponibles`;
            } else {
                contador.textContent = `${visibles} de ${total} expedientes coinciden`;
            }
        }

        // -------- Eventos --------
        buscador.addEventListener('input', () => {
            paginaActual = 1;   // al buscar, volver a la página 1
            clearBtn.classList.toggle('visible', buscador.value.length > 0);
            renderizar();
        });

        clearBtn.addEventListener('click', () => {
            buscador.value = '';
            paginaActual = 1;
            clearBtn.classList.remove('visible');
            renderizar();
            buscador.focus();
        });

        // -------- Render inicial --------
        renderizar();
    }

});