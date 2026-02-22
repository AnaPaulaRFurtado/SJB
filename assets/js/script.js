
document.querySelectorAll(".tab-btn").forEach(button => {
  button.addEventListener("click", () => {
    const tabId = button.dataset.tab;

    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

    button.classList.add("active");
    const el = document.getElementById(tabId);
    if (el) el.classList.add("active");
  });
});

document.querySelectorAll(".toggleLetra").forEach(btn => {
  btn.addEventListener("click", () => {
    const letraDiv = document.getElementById(btn.dataset.target);

    if (letraDiv.style.display === "none") {
      letraDiv.style.display = "block";
      btn.textContent = "Esconder ⤼";
    } else {
      letraDiv.style.display = "none";
      btn.textContent = "Mostrar ⤵️";
    }
  });
});

document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const alvo = btn.dataset.target;

    document.getElementById("menu-lista").classList.add("hidden");
    document.getElementById("conteudo").classList.remove("hidden");

    document.querySelectorAll(".canto").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(alvo).classList.remove("hidden");

    document.getElementById("btn-voltar").style.display = "block";
  });
});

const btnVoltar = document.getElementById("btn-voltar");

if (btnVoltar) {
  btnVoltar.addEventListener("click", () => {
    const conteudo = document.getElementById("conteudo");
    const menuLista = document.getElementById("menu-lista");

    if (conteudo) conteudo.classList.add("hidden");
    if (menuLista) menuLista.classList.remove("hidden");

    btnVoltar.style.display = "none";
  });
}

const btnVoltarHeader = document.getElementById("btn-voltar-header");

if (btnVoltarHeader) {
  btnVoltarHeader.addEventListener("click", () => {
    const menuLista = document.getElementById("menu-lista");
    const conteudo = document.getElementById("conteudo");
    const btnVoltar = document.getElementById("btn-voltar");

    if (menuLista && !menuLista.classList.contains("hidden")) {
      window.location.href = "index.html";
      return;
    }

    if (conteudo) conteudo.classList.add("hidden");
    if (menuLista) menuLista.classList.remove("hidden");
    if (btnVoltar) btnVoltar.style.display = "none";
  });
}