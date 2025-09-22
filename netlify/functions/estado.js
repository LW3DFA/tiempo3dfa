const owner = "LW3DFA"; // tu usuario de GitHub
const repo = "tiempo3dfa";     // nombre del repo
const path = "estado.json"; // archivo donde guardamos
const branch = "main";      // rama principal

// Variable cacheada para no pedir el sha en cada request
let lastSha = null;

export async function handler(event, context) {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return { statusCode: 500, body: "Falta GITHUB_TOKEN en Netlify" };
  }

  // 📌 POST → guardar estado en GitHub
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);

      // Leo las claves que envía el monitor
      const nuevoEstado = {
        "Multimodo": data["Multimodo"],
        "Temp°C": data["Temp°C"],
        fecha: new Date().toISOString()
      };

      // Primero obtenemos el SHA actual del archivo (necesario para update)
      const getResp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: { Authorization: `token ${githubToken}` }
        }
      );

      const getData = await getResp.json();
      lastSha = getData.sha;

      // Ahora actualizamos el archivo
      const putResp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: "Actualizando estado.json",
            content: Buffer.from(JSON.stringify(nuevoEstado, null, 2)).toString("base64"),
            sha: lastSha,
            branch
          })
        }
      );

      if (!putResp.ok) {
        const errText = await putResp.text();
        return { statusCode: 500, body: "Error actualizando GitHub: " + errText };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, guardado: nuevoEstado })
      };
    } catch (err) {
      return { statusCode: 400, body: "Error procesando POST: " + err.message };
    }
  }

  // 📌 GET → leer estado desde GitHub
  try {
    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: { Authorization: `token ${githubToken}` }
      }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      return { statusCode: 500, body: "Error leyendo GitHub: " + txt };
    }

    const fileData = await resp.json();
    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    const estado = JSON.parse(content);

    return { statusCode: 200, body: JSON.stringify(estado) };
  } catch (err) {
    return { statusCode: 500, body: "Error GET: " + err.message };
  }
}
