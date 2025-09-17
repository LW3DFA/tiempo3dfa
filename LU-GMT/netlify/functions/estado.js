📦 Estructura del proyecto Netlify
/tiempolw3dfa/
 ├─ index.html
 └─ netlify/
     └─ functions/
         └─ estado.js

Index simple para probar
******************************************************************
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Monitoreo Multimodo</title>
</head>
<body>
  <h1>Panel de estado</h1>
  <p id="multimodo">Multimodo: cargando...</p>

  <script>
    async function actualizarEstado() {
      try {
        const resp = await fetch("/.netlify/functions/estado");
        const data = await resp.json();
        let texto = `Multimodo: ${data.estado}`;
        if (data.temp !== null) {
          texto += ` (${data.temp}°C)`;
        }
        if (data.fecha) {
          texto += ` - Último envío: ${new Date(data.fecha).toLocaleString()}`;
        }
        document.getElementById("multimodo").innerText = texto;
      } catch {
        document.getElementById("multimodo").innerText = "Error consultando estado";
      }
    }

    actualizarEstado();
    setInterval(actualizarEstado, 300000); // refresca cada 5 min
  </script>
</body>
</html>

**********************************************

📄 netlify/functions/estado.js

**********************************************

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


