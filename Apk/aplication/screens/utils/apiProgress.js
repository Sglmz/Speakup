import { API_URL } from '../../config';

export function apiBase() {
  return API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
}

export async function saveProgress({ userId, gameId }) {
  const res = await fetch(`${apiBase()}guardar_progreso.php`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ user_id: userId, game_id: gameId })
  }).then(r => r.json());

  if (res?.status !== 'success') {
    throw new Error(res?.message || 'No se pudo guardar el progreso');
  }
  return res; // trae {category_id, porcentaje} por si querés mostrar barra
}
