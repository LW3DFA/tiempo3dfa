export async function handler(event) {

  // --------------------
  // POST → guardar datos
  // --------------------
  if (event.httpMethod === "POST") {
    try {

      const data = JSON.parse(event.body);

      console.log("POST recibido:", data);

      return {
        statusCode: 200,
        body: JSON.stringify({
          Multimodo: data.Multimodo,
          "Temp°C": data["Temp°C"],
          fecha: new Date().toISOString()
        })
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
  // GET → devolver algo simple
  // --------------------
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        mensaje: "Function activa correctamente"
      })
    };
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed"
  };
}
