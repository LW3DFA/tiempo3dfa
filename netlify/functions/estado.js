import { getStore } from "@netlify/blobs";

export async function handler(event) {

  const store = getStore("monitor-multimodo");

  // --------------------
  // POST → guardar datos
  // --------------------
  if (event.httpMethod === "POST") {
    try {

      const data = JSON.parse(event.body);

      const estadoActual = {
        Multimodo: data.Multimodo ?? "N/A",
        "Temp°C": data["Temp°C"] ?? null,
        fecha: new Date().toISOString()
      };

      await store.set("estado", JSON.stringify(estadoActual));

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true })
      };

    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // --------------------
  // GET → devolver datos guardados
  // --------------------
  if (event.httpMethod === "GET") {

    const data = await store.get("estado");

    if (!data) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          Multimodo: "Sin datos",
          "Temp°C": null,
          fecha: null
        })
      };
    }

    return {
      statusCode: 200,
      body: data
    };
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed"
  };
}
