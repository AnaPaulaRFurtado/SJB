document.addEventListener("DOMContentLoaded", () => {
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

  document.querySelectorAll("a[href$='.pdf']").forEach(link => {
    const file = link.getAttribute("href");
    if (!file.includes("visualizar.html")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `visualizar.html?file=${encodeURIComponent(file)}`;
      });
    }
  });
});
