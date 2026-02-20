Promise.all([
  fetch("data/musicas.json").then(r => r.json()),
  fetch("data/fixas.json").then(r => r.json())
])
.then(([musicas, fixas]) => {

  const todasMusicas = [...musicas, ...fixas];

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const repertorios = JSON.parse(localStorage.getItem("repertorios")) || [];
  const repertorio = repertorios.find(r => r.id === id);

  const container = document.getElementById("detalhe-repertorio");

  if (!repertorio) {
    container.innerHTML = "<p>Repertório não encontrado.</p>";
    return;
  }

  // Renderiza repertório
  container.innerHTML = `
    <h2>${repertorio.ministerio}</h2>
    <p>📅 ${repertorio.data} – ⏰ ${repertorio.hora}</p>
    <hr>
  `;

  repertorio.musicas.forEach(item => {
    const musica = todasMusicas.find(m => m.id === item.id);
    if (!musica) return;

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="linha-musica">
        ${item.parte}: ${musica.titulo} (Tom: ${item.tom})
      </div>
    `;

    container.appendChild(div);
  });

  // 👇 AQUI entra o código do WhatsApp

  const btnCompartilhar = document.getElementById("btn-compartilhar-detalhe");

  if (btnCompartilhar) {
    btnCompartilhar.addEventListener("click", () => {

      let mensagem = `🎵 REPERTÓRIO DA MISSA\n\n`;
      mensagem += `📌 Ministério: ${repertorio.ministerio}\n`;
      mensagem += `📅 Data: ${repertorio.data}\n`;
      mensagem += `⏰ Hora: ${repertorio.hora}\n\n`;
      mensagem += `-----------------------------------\n\n`;

      repertorio.musicas.forEach(item => {

        const musica = todasMusicas.find(m => m.id === item.id);
        if (!musica) return;

        mensagem += `${item.parte}: ${musica.titulo} (Tom: ${item.tom})\n`;
      });

      const textoCodificado = encodeURIComponent(mensagem);

      window.open(`https://wa.me/?text=${textoCodificado}`, "_blank");
    });
  }

})
.catch(err => {
  console.error("Erro ao carregar detalhe:", err);
});