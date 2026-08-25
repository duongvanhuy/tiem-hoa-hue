document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-ready");

  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (toggle && menu) {
    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
      const icon = toggle.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = open ? "close" : "menu";
    };

    setOpen(false);

    toggle.addEventListener("click", () => {
      setOpen(!menu.classList.contains("is-open"));
    });

    menu.addEventListener("click", (event) => {
      if (event.target === menu) setOpen(false);
    });
  }

  const chips = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      chips.forEach((item) => item.classList.remove("is-active"));
      chip.classList.add("is-active");

      cards.forEach((card) => {
        const categories = (card.dataset.category || "").split(/\s+/);
        const show = filter === "all" || categories.includes(filter);
        card.classList.toggle("hidden", !show);
      });
    });
  });

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const note = document.querySelector("[data-form-success]");
      if (note) {
        note.classList.remove("hidden");
        note.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      form.reset();
    });
  }

  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-in"));
  }
});
