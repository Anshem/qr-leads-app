function mostrarDatosQR(texto) {
  let resultado = document.getElementById("result");
  resultado.innerHTML = "";

  try {
    const datos = JSON.parse(texto);
    for (const clave in datos) {
      resultado.innerHTML += `<p><strong>${clave}:</strong> ${datos[clave]}</p>`;
    }
  } catch (e) {
    resultado.innerHTML = `<p>Texto escaneado: ${texto}</p>`;
  }
}

const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(cameras => {
  if (cameras && cameras.length) {
    html5QrCode.start(
      cameras[0].id,
      {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1.777,
      },
      mostrarDatosQR
    );
  }
}).catch(err => {
  console.error("Error al acceder a la cámara", err);
});
