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

})
.catch(err => {
  console.error("Erro ao carregar detalhe:", err);
});