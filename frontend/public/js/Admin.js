const API = 'http://localhost:5000/api';

async function loadDashboard() {
  try {
    const res = await fetch(`${API}/admin/responses`);
    const data = await res.json();

    document.getElementById('statTotal').textContent = data.stats.total;
    document.getElementById('statYes').textContent = data.stats.accepted;
    document.getElementById('statNo').textContent = data.stats.declined;

    const tbody = document.getElementById('responseBody');
    tbody.innerHTML = '';

    if (data.responses.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Aucune réponse pour l'instant 🌸</td></tr>`;
      return;
    }

    data.responses.forEach(r => {
      const date = new Date(r.createdAt).toLocaleString('fr-FR');
      const dateChosen = r.dateChosen
        ? new Date(r.dateChosen).toLocaleDateString('fr-FR')
        : '—';
      tbody.innerHTML += `
        <tr>
          <td>${date}</td>
          <td>${r.respondentName || '—'}</td>
          <td><span class="badge ${r.accepted ? 'badge-yes' : 'badge-no'}">${r.accepted ? '💗 Oui!' : '😕 Non'}</span></td>
          <td>${dateChosen}</td>
          <td>${r.timeChosen || '—'}</td>
          <td>${r.foodChosen || '—'}</td>
          <td><button class="btn-del" onclick="deleteOne('${r._id}')">Supprimer</button></td>
        </tr>`;
    });
  } catch (err) {
    document.getElementById('responseBody').innerHTML =
      `<tr><td colspan="7" class="empty-state">Erreur serveur 😢</td></tr>`;
  }
}

async function deleteOne(id) {
  if (!confirm('Supprimer cette réponse?')) return;
  await fetch(`${API}/admin/responses/${id}`, { method: 'DELETE' });
  loadDashboard();
}

async function deleteAll() {
  if (!confirm('Tout effacer?')) return;
  await fetch(`${API}/admin/responses`, { method: 'DELETE' });
  loadDashboard();
}

loadDashboard();