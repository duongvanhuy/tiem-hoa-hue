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
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  }

  const consult = document.querySelector("[data-consult-go]");
  const topic = document.querySelector("#topic");
  if (consult && topic) {
    consult.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = topic.value;
    });
  }

  const chips = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").trim().toLowerCase();
  const cat = params.get("cat") || "";

  const applyFilter = (filter, text) => {
    cards.forEach((card) => {
      const categories = (card.dataset.category || "").split(/\s+/);
      const name = (card.dataset.name || card.textContent || "").toLowerCase();
      const matchCat = filter === "all" || !filter || categories.includes(filter);
      const matchText = !text || name.includes(text);
      card.hidden = !(matchCat && matchText);
    });
  };

  if (chips.length && cards.length) {
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((item) => item.classList.remove("is-active"));
        chip.classList.add("is-active");
        applyFilter(chip.dataset.filter, query);
      });
    });

    if (cat) {
      const active = [...chips].find((chip) => chip.dataset.filter === cat);
      chips.forEach((item) => item.classList.remove("is-active"));
      if (active) active.classList.add("is-active");
      applyFilter(cat, query);
    } else if (query) {
      applyFilter("all", query);
    }
  }

  const searchInput = document.querySelector("[data-live-search]");
  if (searchInput) {
    if (query) searchInput.value = query;
    searchInput.addEventListener("input", () => {
      const current = document.querySelector("[data-filter].is-active");
      applyFilter(current ? current.dataset.filter : "all", searchInput.value.trim().toLowerCase());
    });
  }

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const note = document.querySelector("[data-form-success]");
      if (note) {
        note.hidden = false;
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

  const cardsForPhoto = document.querySelectorAll(".p-card");
  if (cardsForPhoto.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Xem ảnh sản phẩm");
    box.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Đóng">×</button>
      <div class="lightbox__stage"><img alt=""></div>
      <p class="lightbox__cap"></p>
    `;
    document.body.appendChild(box);

    const photo = box.querySelector("img");
    const caption = box.querySelector(".lightbox__cap");
    const closeBtn = box.querySelector(".lightbox__close");

    const closePhoto = () => {
      box.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      photo.removeAttribute("src");
    };

    const openPhoto = (card) => {
      const img = card.querySelector(".p-card__media img");
      if (!img) return;
      const title = (card.querySelector("h3")?.textContent || img.alt || "").trim();
      photo.src = img.currentSrc || img.src;
      photo.alt = img.alt || title;
      caption.innerHTML = `${title}<span class="lightbox__hint">Chạm ảnh để đóng</span>`;
      box.classList.add("is-open");
      document.body.classList.add("lightbox-open");
      closeBtn.focus();
    };

    cardsForPhoto.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest(".p-card__cta")) return;
        openPhoto(card);
      });
    });

    closeBtn.addEventListener("click", closePhoto);
    box.querySelector(".lightbox__stage").addEventListener("click", closePhoto);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && box.classList.contains("is-open")) closePhoto();
    });
  }
});
