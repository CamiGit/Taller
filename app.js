const API_URL = 'https://jsonplaceholder.typicode.com/users';

const usersEl = document.getElementById('users');
const statusEl = document.getElementById('status');
const searchInput = document.getElementById('search');
let cachedUsers = [];

function escapeHtml(str = ''){
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

function renderUsers(list){
  usersEl.innerHTML = '';
  if(!list || list.length === 0){
    usersEl.innerHTML = '<p class="empty">No hay usuarios para mostrar.</p>';
    return;
  }

  list.forEach(user => {
    const name = escapeHtml(user.name || '—');
    const email = escapeHtml(user.email || '—');
    const city = escapeHtml(user.address?.city || '—');

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3 class="card-title">${name}</h3>
      <p class="card-meta"><a href="mailto:${email}">${email}</a></p>
      <p class="card-city">Ciudad: <strong>${city}</strong></p>
    `;

    usersEl.appendChild(card);
  });
}

async function fetchUsers(){
  statusEl.textContent = 'Cargando usuarios...';
  try{
    const resp = await fetch(API_URL);
    if(!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    cachedUsers = data;
    renderUsers(cachedUsers);
    statusEl.textContent = `${cachedUsers.length} usuarios cargados.`;
  }catch(err){
    console.error(err);
    statusEl.textContent = 'Error al cargar usuarios: ' + err.message;
    usersEl.innerHTML = '<p class="error">No se pudieron obtener los datos. Intenta de nuevo más tarde.</p>';
  }
}

function applyFilter(q){
  const query = String(q).toLowerCase().trim();
  if(!query){
    renderUsers(cachedUsers);
    statusEl.textContent = `${cachedUsers.length} usuarios mostrados.`;
    return;
  }
  const filtered = cachedUsers.filter(u => {
    const hay = [u.name, u.email, u.address?.city]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(query);
  });
  renderUsers(filtered);
  statusEl.textContent = `${filtered.length} resultados para "${query}"`;
}


searchInput.addEventListener('input', (e) => applyFilter(e.target.value));

fetchUsers();
