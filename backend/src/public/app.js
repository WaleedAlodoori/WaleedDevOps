const api = (path, opts={}) => fetch(path, {
  headers: { 'Content-Type': 'application/json' },
  ...opts
}).then(r => (r.status === 204 ? null : r.json()));

const rows = document.getElementById('rows');

async function load() {
  const data = await api('/api/tasks');
  rows.innerHTML = '';
  data.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.title}</td>
      <td>${t.status}</td>
      <td>${t.assignee || ''}</td>
      <td>${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ''}</td>
      <td class="labels">${(t.labels||[]).map(l=>`<span class="chip">${l}</span>`).join('')}</td>
      <td>
        <button data-id="${t.id}" class="done">Mark Done</button>
        <button data-id="${t.id}" class="del" style="background:#dc2626">Delete</button>
      </td>`;
    rows.appendChild(tr);
  });
}

function gather() {
  return {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    status: document.getElementById('status').value,
    assignee: document.getElementById('assignee').value,
    dueDate: document.getElementById('dueDate').value,
    labels: document.getElementById('labels').value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  };
}

async function create() {
  const body = gather();
  await api('/api/tasks', { method: 'POST', body: JSON.stringify(body) });
  await load();
}

rows.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-id');
  if (!id) return;
  if (e.target.classList.contains('done')) {
    await api(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ status: 'done' }) });
    await load();
  }
  if (e.target.classList.contains('del')) {
    await api(`/api/tasks/${id}`, { method: 'DELETE' });
    await load();
  }
});

document.getElementById('create').addEventListener('click', create);

load();
