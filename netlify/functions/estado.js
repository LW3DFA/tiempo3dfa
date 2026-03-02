import { getStore } from "@netlify/blobs";

export async function handler(event) {
  const store = getStore("multimodo");

  // 📌 POST → Guardar estado
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);

      const nuevoEstado = {
        "Multimodo": data["Multimodo"],
        "Temp°C": data["Temp°C"],
        fecha: new Date().toISOString()
      };

      await store.set("estado", JSON.stringify(nuevoEstado));

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true })
      };
    } catch (err) {
      return { statusCode: 400, body: "Error en POST" };
    }
  }

  // 📌 GET → Leer estado
  const estado = await store.get("estado");

  if (!estado) {
    return {
      statusCode: 200,
      body: JSON.stringify({ "Multimodo": "N/A", "Temp°C": null, fecha: null })
    };
  }

  return {
    statusCode: 200,
    body: estado
  };
}
