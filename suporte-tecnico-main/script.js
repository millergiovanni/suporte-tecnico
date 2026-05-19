document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    // --- UI HELPERS ---
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Toggle Switch logic
    const toggles = document.querySelectorAll('.toggle-switch');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => toggle.classList.toggle('active'));
    });

    // --- SUPABASE INTEGRATION ---
    const client = window.supabaseClient;
    if (!client) {
        console.error('Supabase client not found');
        return;
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    let currentCategory = '';
    let currentSearch = '';

    if (currentPage === 'index.html' || currentPage === 'my-tickets.html') {
        loadTickets(currentPage === 'my-tickets.html');

        const filterPills = document.querySelectorAll('.filter-pill');
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCategory = pill.getAttribute('data-category') || '';
                loadTickets(currentPage === 'my-tickets.html');
            });
        });

        // Setup search logic
        const searchInput = document.getElementById('ticketSearchInput');
        const searchBtn = document.getElementById('ticketSearchBtn');

        const performSearch = () => {
            currentSearch = searchInput ? searchInput.value.trim() : '';
            loadTickets(currentPage === 'my-tickets.html');
        };

        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }
    }

    if (currentPage === 'new-ticket.html') {
        setupNewTicketPage();
    }

    if (currentPage === 'edit-ticket.html') {
        setupEditTicketPage();
    }

    if (currentPage === 'settings.html') {
        setupAdminSettings();
        
        const tabBtns = document.querySelectorAll('#settingsTabs button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                const content = document.getElementById(tabId);
                if (content) content.classList.add('active');
            });
        });

        // Search logic
        const settingsSearch = document.getElementById('settingsSearch');
        if (settingsSearch) {
            settingsSearch.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                const allTabs = document.querySelectorAll('.tab-content');
                const tabsContainer = document.getElementById('settingsTabs');

                if (term === '') {
                    tabsContainer.style.display = ''; // Restore flex
                    const activeBtn = document.querySelector('#settingsTabs button.active');
                    if (activeBtn) activeBtn.click();
                } else {
                    tabsContainer.style.display = 'none';
                    allTabs.forEach(tab => {
                        const text = tab.innerText.toLowerCase();
                        if (text.includes(term)) {
                            tab.classList.add('active');
                        } else {
                            tab.classList.remove('active');
                        }
                    });
                }
            });
        }
    }

    // --- FUNCTIONS ---

    async function loadTickets(isMyTickets = false) {
        const ticketList = document.querySelector('.data-table tbody');
        if (!ticketList) return;

        ticketList.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Carregando chamados...</td></tr>';
        
        let query = client
            .from('tickets')
            .select(`
                *,
                categories(name),
                statuses(name, color_class)
            `)
            .order('created_at', { ascending: false });

        if (isMyTickets) {
            query = query.eq('user_id', 'Agent 007');
        }

        const { data: tickets, error } = await query;

        if (error) {
            console.error('Erro ao buscar tickets:', error);
            alert('Erro ao carregar chamados: ' + error.message);
            return;
        }

        let filteredTickets = tickets;
        if (currentCategory) {
            filteredTickets = tickets.filter(t => t.categories && t.categories.name && t.categories.name.toLowerCase().includes(currentCategory.toLowerCase()));
        }

        if (currentSearch) {
            filteredTickets = filteredTickets.filter(t => {
                const subjectMatch = t.subject && t.subject.toLowerCase().includes(currentSearch.toLowerCase());
                const userMatch = t.user_id && t.user_id.toLowerCase().includes(currentSearch.toLowerCase());
                return subjectMatch || userMatch;
            });
        }

        ticketList.innerHTML = '';
        
        if (filteredTickets.length === 0) {
            ticketList.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Nenhum chamado encontrado.</td></tr>';
            updateMetrics(filteredTickets);
            return;
        }

        filteredTickets.forEach(ticket => {
            const priorityColors = {
                'critica': 'bg-error',
                'alta': 'bg-high',
                'media': 'bg-primary-fixed-dim',
                'baixa': 'bg-outline'
            };
            
            const priorityLabel = ticket.priority ? ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1) : 'N/A';
            const colorClass = priorityColors[ticket.priority] || 'bg-outline';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="data-mono">#${ticket.id.slice(0, 5).toUpperCase()}</td>
                <td class="font-semibold">${ticket.subject}</td>
                <td><span class="badge badge-primary">${ticket.categories?.name || 'Geral'}</span></td>
                <td>
                    <div class="status-indicator">
                        <span class="dot ${colorClass}"></span> ${priorityLabel}
                    </div>
                </td>
                <td><span class="badge ${ticket.statuses?.color_class || 'badge-outline'}">${ticket.statuses?.name || 'Aberto'}</span></td>
                <td class="text-right">
                    <button class="icon-btn-sm" title="Visualizar"><span class="material-symbols-outlined">visibility</span></button>
                    <a href="edit-ticket.html?id=${ticket.id}" class="icon-btn-sm" title="Editar" style="display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: inherit;"><span class="material-symbols-outlined">edit</span></a>
                </td>
            `;
            ticketList.appendChild(row);
        });

        updateMetrics(filteredTickets);
    }

    function updateMetrics(tickets) {
        const metrics = {
            total: tickets.length,
            pending: tickets.filter(t => t.statuses?.name === 'Pendente').length,
            progress: tickets.filter(t => t.statuses?.name === 'Em Progresso').length,
            completed: tickets.filter(t => t.statuses?.name === 'Concluído').length
        };

        const totalCard = document.querySelector('.metric-card:nth-child(1) .display-lg');
        if (totalCard) totalCard.textContent = metrics.total;

        const pendingCard = document.querySelector('.metric-card:nth-child(2) .display-lg');
        if (pendingCard) pendingCard.textContent = metrics.progress; // Usando progresso como exemplo

        const progressCard = document.querySelector('.metric-card:nth-child(3) .display-lg');
        if (progressCard) progressCard.textContent = metrics.pending;
    }

    async function setupNewTicketPage() {
        const form = document.getElementById('newTicketForm');
        const categorySelect = document.querySelector('select[name="category"]');
        
        if (!form) return;

        const { data: categories } = await client.from('categories').select('*');
        if (categories && categorySelect) {
            categorySelect.innerHTML = '<option value="" disabled selected>Selecione a categoria</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Enviando...';

            const formData = new FormData(form);
            const { data: statusData } = await client.from('statuses').select('id').eq('name', 'Pendente').single();

            const { error } = await client.from('tickets').insert([{
                subject: formData.get('subject'),
                description: formData.get('description'),
                category_id: formData.get('category'),
                priority: formData.get('priority'),
                status_id: statusData?.id || null,
                user_id: 'Agent 007',
                created_at: new Date().toISOString()
            }]);

            if (error) {
                alert('Erro ao criar chamado: ' + error.message);
                btn.disabled = false;
                btn.textContent = 'Abrir Chamado';
            } else {
                alert('Chamado aberto com sucesso!');
                window.location.href = 'index.html';
            }
        });
    }

    async function setupAdminSettings() {
        const loadAdminData = async () => {
            const categoryList = document.querySelector('#admin .data-table-container:nth-of-type(1) tbody');
            const statusList = document.querySelector('#admin .data-table-container:nth-of-type(2) tbody');
            
            if (categoryList) {
                const { data: categories } = await client.from('categories').select('*').order('name');
                categoryList.innerHTML = categories?.map(cat => `
                    <tr>
                        <td>${cat.name}</td>
                        <td class="text-right">
                            <button class="icon-btn-sm" onclick="editCategory('${cat.id}', '${cat.name}')"><span class="material-symbols-outlined">edit</span></button>
                            <button class="icon-btn-sm text-error" onclick="deleteCategory('${cat.id}')"><span class="material-symbols-outlined">delete</span></button>
                        </td>
                    </tr>
                `).join('') || '<tr><td>Nenhuma categoria.</td></tr>';
            }

            if (statusList) {
                const { data: statuses } = await client.from('statuses').select('*').order('name');
                statusList.innerHTML = statuses?.map(st => `
                    <tr>
                        <td><span class="badge ${st.color_class || 'badge-outline'}">${st.name}</span></td>
                        <td class="text-right">
                            <button class="icon-btn-sm" onclick="editStatus('${st.id}', '${st.name}')"><span class="material-symbols-outlined">edit</span></button>
                            <button class="icon-btn-sm text-error" onclick="deleteStatus('${st.id}')"><span class="material-symbols-outlined">delete</span></button>
                        </td>
                    </tr>
                `).join('') || '<tr><td>Nenhum status.</td></tr>';
            }
        };

        await loadAdminData();

        window.editCategory = async (id, oldName) => {
            const newName = prompt('Editar Categoria:', oldName);
            if (newName && newName !== oldName) {
                await client.from('categories').update({ name: newName }).eq('id', id);
                loadAdminData();
            }
        };

        window.deleteCategory = async (id) => {
            if (confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar chamados vinculados.')) {
                await client.from('categories').delete().eq('id', id);
                loadAdminData();
            }
        };

        window.editStatus = async (id, oldName) => {
            const newName = prompt('Editar Status:', oldName);
            if (newName && newName !== oldName) {
                await client.from('statuses').update({ name: newName }).eq('id', id);
                loadAdminData();
            }
        };

        window.deleteStatus = async (id) => {
            if (confirm('Tem certeza que deseja excluir este status? Isso pode afetar chamados vinculados.')) {
                await client.from('statuses').delete().eq('id', id);
                loadAdminData();
            }
        };

        const btnAddCategory = document.getElementById('btnAddCategory');
        if (btnAddCategory) {
            btnAddCategory.addEventListener('click', async () => {
                const name = prompt('Nova Categoria:');
                if (name) {
                    await client.from('categories').insert([{ name }]);
                    loadAdminData();
                }
            });
        }

        const btnAddStatus = document.getElementById('btnAddStatus');
        if (btnAddStatus) {
            btnAddStatus.addEventListener('click', async () => {
                const name = prompt('Novo Status:');
                if (name) {
                    await client.from('statuses').insert([{ name, color_class: 'badge-outline' }]);
                    loadAdminData();
                }
            });
        }
    }

    async function setupEditTicketPage() {
        const form = document.getElementById('editTicketForm');
        const urlParams = new URLSearchParams(window.location.search);
        const ticketId = urlParams.get('id');

        if (!form || !ticketId) {
            alert('Ticket inválido.');
            window.location.href = 'index.html';
            return;
        }

        const categorySelect = document.querySelector('select[name="category"]');
        const statusSelect = document.querySelector('select[name="status"]');

        // Carregar categorias
        const { data: categories } = await client.from('categories').select('*');
        if (categories && categorySelect) {
            categorySelect.innerHTML = '<option value="" disabled>Selecione a categoria</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
        }

        // Carregar status
        const { data: statuses } = await client.from('statuses').select('*');
        if (statuses && statusSelect) {
            statusSelect.innerHTML = '<option value="" disabled>Selecione o status</option>';
            statuses.forEach(st => {
                const option = document.createElement('option');
                option.value = st.id;
                option.textContent = st.name;
                // Guardar nome para lógica de fechamento
                option.dataset.name = st.name; 
                statusSelect.appendChild(option);
            });
        }

        // Buscar dados do ticket
        const { data: ticket, error } = await client.from('tickets').select('*').eq('id', ticketId).single();
        if (error || !ticket) {
            alert('Erro ao carregar o chamado.');
            window.location.href = 'index.html';
            return;
        }

        // Preencher form
        form.querySelector('#ticketId').value = ticket.id;
        form.querySelector('#subject').value = ticket.subject || '';
        form.querySelector('#description').value = ticket.description || '';
        form.querySelector('#actions').value = ticket.actions || '';
        
        if (ticket.category_id) categorySelect.value = ticket.category_id;
        if (ticket.priority) form.querySelector('#priority').value = ticket.priority;
        if (ticket.status_id) statusSelect.value = ticket.status_id;

        // Formatar datas
        if (ticket.created_at) {
            form.querySelector('#created_at').value = new Date(ticket.created_at).toLocaleString('pt-BR');
        }
        if (ticket.closed_at) {
            form.querySelector('#closed_at').value = new Date(ticket.closed_at).toLocaleString('pt-BR');
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Salvando...';

            const formData = new FormData(form);
            const statusOption = statusSelect.options[statusSelect.selectedIndex];
            const isClosed = statusOption && (statusOption.dataset.name === 'Concluído' || statusOption.dataset.name === 'Fechado');
            
            const updateData = {
                subject: formData.get('subject'),
                description: formData.get('description'),
                category_id: formData.get('category'),
                priority: formData.get('priority'),
                status_id: formData.get('status'),
                actions: formData.get('actions')
            };

            // Se for concluído, define a data de fechamento se ainda não tiver
            if (isClosed && !ticket.closed_at) {
                updateData.closed_at = new Date().toISOString();
            } else if (!isClosed) {
                // Se foi reaberto, remove a data de fechamento
                updateData.closed_at = null;
            }

            const { error: updateError } = await client.from('tickets').update(updateData).eq('id', ticketId);

            if (updateError) {
                alert('Erro ao atualizar chamado: ' + updateError.message);
                btn.disabled = false;
                btn.textContent = 'Salvar Alterações';
            } else {
                alert('Chamado atualizado com sucesso!');
                window.location.href = 'index.html';
            }
        });
    }
});
