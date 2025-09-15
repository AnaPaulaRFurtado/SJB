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


  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(a => a.classList.remove("active"));
      link.classList.add("active");
      setTimeout(() => link.blur(), 50);
    });
  });
});
