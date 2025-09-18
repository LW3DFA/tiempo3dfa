let ultimoEstado = { "Multimodo": "N/A", "Temp°C": null, fecha: null };

export async function handler(event, context) {
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);

      // Guardamos con las claves exactas que envía el monitor
      ultimoEstado = {
        "Multimodo": data["Multimodo"],
        "Temp°C": data["Temp°C"],
        fecha: new Date().toISOString()
      };

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, recibido: ultimoEstado })
      };
    } catch (err) {
      return { statusCode: 400, body: "Error en datos" };
    }
  }

  // GET devuelve el último estado completo
  return {
    statusCode: 200,
    body: JSON.stringify(ultimoEstado)
  };
}
