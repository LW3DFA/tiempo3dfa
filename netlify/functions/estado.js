let estadoActual = {
  Multimodo: "Sin datos",
  "Temp°C": null,
  fecha: null
};

export async function handler(event) {

  // --------------------
  // POST → guardar datos
  // --------------------
  if (event.httpMethod === "POST") {
    try {

      const data = JSON.parse(event.body);

      estadoActual = {
        Multimodo: data.Multimodo ?? "N/A",
        "Temp°C": data["Temp°C"] ?? null,
        fecha: new Date().toISOString()
      };

      console.log("Estado actualizado:", estadoActual);

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true })
      };

    } catch (error) {
      console.error("Error en POST:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // --------------------
  // GET → devolver último estado
  // --------------------
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify(estadoActual)
    };
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed"
  };
}
