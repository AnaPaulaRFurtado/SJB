
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

document.getElementById("btn-voltar").addEventListener("click", () => {
  document.getElementById("conteudo").classList.add("hidden");
  document.getElementById("menu-lista").classList.remove("hidden");

  document.getElementById("btn-voltar").style.display = "none";
});


document.getElementById("btn-voltar-header").addEventListener("click", () => {
  if (!document.getElementById("menu-lista").classList.contains("hidden")) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("conteudo").classList.add("hidden");
  document.getElementById("menu-lista").classList.remove("hidden");
  document.getElementById("btn-voltar").style.display = "none";
});
