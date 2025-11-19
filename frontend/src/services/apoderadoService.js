import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

async function safeRequest(request) {
  try {
    return await request;
  } catch (err) {
    console.error("❌ Error en apoderadoService:", err);
    return { data: null, error: err };
  }
}

export const apoderadoService = {
  obtenerNotificaciones: () =>
    safeRequest(axios.get(`${API}/api/apoderado/notificaciones`, { headers: authHeaders() })),

  marcarTodasLeidas: () =>
    safeRequest(axios.put(`${API}/api/apoderado/notificaciones/leidas`, {}, { headers: authHeaders() })),

  confirmarAsistencia: (id) =>
    safeRequest(axios.put(`${API}/api/apoderado/notificaciones/${id}/confirmar`, {}, { headers: authHeaders() }))
};
