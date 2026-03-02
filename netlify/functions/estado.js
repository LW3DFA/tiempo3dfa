import fs from "fs";

const filePath = "/tmp/estado.json";

export async function handler(event) {

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

      fs.writeFileSync(filePath, JSON.stringify(estadoActual));

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

    try {

      if (!fs.existsSync(filePath)) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            Multimodo: "Sin datos",
            "Temp°C": null,
            fecha: null
          })
        };
      }

      const data = fs.readFileSync(filePath, "utf8");

      return {
        statusCode: 200,
        body: data
      };

    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed"
  };
}
