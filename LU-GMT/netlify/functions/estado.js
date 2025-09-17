let ultimoEstado = { estado: "N/A", temp: null, fecha: null };

export async function handler(event, context) {
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      ultimoEstado = {
        estado: data.estado,
        temp: data.temp,
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

  // GET devuelve el último estado
  return {
    statusCode: 200,
    body: JSON.stringify(ultimoEstado)
  };
}


