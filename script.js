document.addEventListener('DOMContentLoaded', () => {
  
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

  // --- Menu sanduíche ---
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("main-nav");
  const navLinks = nav ? Array.from(nav.querySelectorAll("a")) : [];

  function openMenu() {
    if (!nav) return;
    nav.classList.add("show");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("show");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", (e) => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMenu(); else openMenu();
    });

    // fecha ao clicar em um link (útil no mobile)
    navLinks.forEach(a => a.addEventListener("click", () => {
      if (window.innerWidth <= 768) closeMenu();
    }));

    // fecha ao clicar fora
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("show")) return;
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
    });

    // se redimensionar para desktop, garante menu fechado (sincroniza estado)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
});
