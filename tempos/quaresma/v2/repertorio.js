Promise.all([
  fetch("data/musicas.json").then(r => r.json()),
  fetch("data/fixas.json").then(r => r.json())
])
  .then(([musicas, fixas]) => {

    const todasMusicas = [...musicas, ...fixas];

    const listaAtual = document.getElementById("lista-repertorio");
    const listaSalvos = document.getElementById("lista-repertorios-salvos");

    const btnSalvar = document.getElementById("btn-salvar-repertorio");
    const btnCompartilhar = document.getElementById("btn-compartilhar");

    const inputMinisterio = document.getElementById("ministerio");
    const inputData = document.getElementById("data-missa");
    const inputHora = document.getElementById("hora-missa");
    function formatarDataBR(dataISO) {
      if (!dataISO) return "";

      const [ano, mes, dia] = dataISO.split("-");
      return `${dia}/${mes}/${ano}`;
    }


    // =============================
    // REPERTÓRIO ATUAL
    // =============================

    function renderizarRepertorioAtual() {

      const repertorioAtual = JSON.parse(localStorage.getItem("repertorio")) || [];

      listaAtual.innerHTML = "";

      if (repertorioAtual.length === 0) {
        listaAtual.innerHTML = "<p>Seu repertório atual está vazio.</p>";
        return;
      }

      repertorioAtual.forEach(item => {

        const musica = todasMusicas.find(m => m.id === item.id);
        if (!musica) return;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <div class="linha-musica">
          ${item.parte}: ${musica.titulo} (Tom: ${item.tom})
          <button class="btn-remover-musica">🗑</button>
        </div>
      `;

        card.querySelector(".btn-remover-musica").onclick = () => {

          const novo = repertorioAtual.filter(m => m.id !== item.id);
          localStorage.setItem("repertorio", JSON.stringify(novo));

          renderizarRepertorioAtual();
        };

        listaAtual.appendChild(card);
      });
    }

    // =============================
    // REPERTÓRIOS SALVOS (COM ABRIR + EXCLUIR)
    // =============================

    function renderizarRepertoriosSalvos() {

      const repertorios = JSON.parse(localStorage.getItem("repertorios")) || [];

      listaSalvos.innerHTML = "";

      if (repertorios.length === 0) {
        listaSalvos.innerHTML = "<p>Nenhum repertório salvo ainda.</p>";
        return;
      }

      repertorios.forEach(rep => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <div class="linha-musica">
          <strong>${rep.ministerio}</strong> – ${rep.data} – ${rep.hora}
          <div>
            <button class="btn-abrir">
            <span class="material-icons">folder_open</span>
            </button>
            <button class="btn-excluir">
            <span class="material-icons">delete_outline</span>
            </button>

          </div>
        </div>
      `;

        // ABRIR
        card.querySelector(".btn-abrir").onclick = () => {
          window.location.href = `repertorio-detalhe.html?id=${rep.id}`;
        };

        // EXCLUIR
        card.querySelector(".btn-excluir").onclick = () => {

          const confirmar = confirm("Deseja excluir este repertório?");
          if (!confirmar) return;

          const novos = repertorios.filter(r => r.id !== rep.id);
          localStorage.setItem("repertorios", JSON.stringify(novos));

          renderizarRepertoriosSalvos();
        };

        listaSalvos.appendChild(card);
      });
    }

    // =============================
    // SALVAR REPERTÓRIO
    // =============================

    btnSalvar.addEventListener("click", () => {

      const repertorioAtual = JSON.parse(localStorage.getItem("repertorio")) || [];

      if (repertorioAtual.length === 0) {
        alert("Adicione músicas antes de salvar.");
        return;
      }

      const ministerio = inputMinisterio.value.trim();
      const data = formatarDataBR(inputData.value);
      const hora = inputHora.value;

      if (!ministerio || !data || !hora) {
        alert("Preencha Ministério, Data e Hora.");
        return;
      }

      const repertorios = JSON.parse(localStorage.getItem("repertorios")) || [];

      repertorios.push({
        id: "rep_" + Date.now(),
        ministerio,
        data,
        hora,
        musicas: repertorioAtual
      });

      localStorage.setItem("repertorios", JSON.stringify(repertorios));

      localStorage.removeItem("repertorio");


      inputMinisterio.value = "";
      inputData.value = "";
      inputHora.value = "";

      renderizarRepertorioAtual();
      renderizarRepertoriosSalvos();
    });

    // =============================
    // COMPARTILHAR WHATSAPP
    // =============================

    btnCompartilhar.addEventListener("click", () => {

      const repertorioAtual = JSON.parse(localStorage.getItem("repertorio")) || [];

      if (repertorioAtual.length === 0) {
        alert("Adicione músicas antes de compartilhar.");
        return;
      }

      const ministerio = inputMinisterio.value.trim();
      const data = formatarDataBR(inputData.value);
      const hora = inputHora.value;

      if (!ministerio || !data || !hora) {
        alert("Preencha Ministério, Data e Hora antes de compartilhar.");
        return;
      }

      let mensagem = `🎵 REPERTÓRIO DA MISSA\n\n`;
      mensagem += `📌 Ministério: ${ministerio}\n`;
      mensagem += `📅 Data: ${data}\n`;
      mensagem += `⏰ Hora: ${hora}\n\n`;
      mensagem += `-----------------------------------\n\n`;

      repertorioAtual.forEach(item => {

        const musica = todasMusicas.find(m => m.id === item.id);
        if (!musica) return;

        mensagem += `${item.parte}: ${musica.titulo} (Tom: ${item.tom})\n`;
      });

      const textoCodificado = encodeURIComponent(mensagem);

      window.location.href = `https://wa.me/?text=${textoCodificado}`;
    });

    // =============================
    // INICIALIZAÇÃO
    // =============================

    renderizarRepertorioAtual();
    renderizarRepertoriosSalvos();

  })
  .catch(err => {
    console.error("Erro ao carregar repertório:", err);
  });
