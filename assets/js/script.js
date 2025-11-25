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

