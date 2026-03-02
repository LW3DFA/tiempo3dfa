let estadoGuardado = {
  Multimodo: "N/A",
  "Temp°C": null,
  fecha: null
};

export async function handler(event) {

  // ---------------------
  // POST → guardar datos
  // ---------------------
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);

      estadoGuardado = {
        Multimodo: data.Multimodo ?? "N/A",
        "Temp°C": data["Temp°C"] ?? null,
        fecha: new Date().toISOString()
      };

      console.log("Datos guardados:", estadoGuardado);

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true })
      };

    } catch (error) {
      console.error("Error POST:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // ---------------------
  // GET → devolver datos
  // ---------------------
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify(estadoGuardado)
    };
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed"
  };
}
