(() => {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".service-row").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.parentElement;
      const panel = item?.querySelector(".service-panel");
      if (!panel) return;

      const willOpen = button.getAttribute("aria-expanded") !== "true";

      document.querySelectorAll(".service-row").forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        other.parentElement?.querySelector(".service-panel")?.setAttribute("hidden", "");
      });

      if (willOpen) {
        button.setAttribute("aria-expanded", "true");
        panel.removeAttribute("hidden");
      }
    });
  });

  const materialNote = document.getElementById("material-note");
  const materialCopy = {
    eco: "Экокожа — основной вариант для рулей и сидений. Цвет и фактуру подбираем по фото и образцам.",
    natural: "Натуральная кожа — для рулей и сидений, где нужна износостойкая кожаная обивка.",
    combo: "Сочетания материалов и цвета строчки подбираем после оценки по фото.",
  };

  document.querySelectorAll(".material-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".material-card").forEach((el) => el.classList.remove("is-active"));
      card.classList.add("is-active");
      const key = card.dataset.material;
      if (materialNote && key && materialCopy[key]) {
        materialNote.textContent = materialCopy[key];
      }
    });
  });

  const filters = document.querySelectorAll(".filter");
  const works = document.querySelectorAll(".work");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((el) => el.classList.remove("is-active"));
      filter.classList.add("is-active");
      const value = filter.dataset.filter;

      works.forEach((work) => {
        const show = value === "all" || work.dataset.cat === value;
        work.classList.toggle("is-hidden", !show);
      });
    });
  });

  const stage = document.querySelector("[data-compare]");
  if (stage) {
    const before = stage.querySelector(".compare-before");
    const handle = stage.querySelector(".compare-handle");
    let dragging = false;

    const setPos = (clientX) => {
      const rect = stage.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const pct = `${(ratio * 100).toFixed(2)}%`;
      before.style.setProperty("--pos", pct);
      handle.style.left = pct;
      handle.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
    };

    const start = (event) => {
      dragging = true;
      stage.classList.add("is-dragging");
      const point = "touches" in event ? event.touches[0].clientX : event.clientX;
      setPos(point);
    };

    const move = (event) => {
      if (!dragging) return;
      const point = "touches" in event ? event.touches[0].clientX : event.clientX;
      setPos(point);
    };

    const end = () => {
      dragging = false;
      stage.classList.remove("is-dragging");
    };

    stage.addEventListener("mousedown", start);
    stage.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);

    handle.addEventListener("keydown", (event) => {
      const current = Number(handle.getAttribute("aria-valuenow") || "50");
      if (event.key === "ArrowLeft") {
        setPos(stage.getBoundingClientRect().left + ((current - 3) / 100) * stage.clientWidth);
      }
      if (event.key === "ArrowRight") {
        setPos(stage.getBoundingClientRect().left + ((current + 3) / 100) * stage.clientWidth);
      }
    });
  }

  const form = document.getElementById("estimate-form");
  const status = document.getElementById("form-status");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();
    const files = form.querySelector('input[type="file"]')?.files;

    const lines = [
      "Заявка с сайта Автоателье",
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      message ? `Запрос: ${message}` : "",
      files?.length ? `Фото: приложу ${files.length} шт.` : "Фото: нет",
    ].filter(Boolean);

    const body = encodeURIComponent(lines.join("\n"));
    const mailto = `mailto:himperm59@yandex.ru?subject=${encodeURIComponent("Оценка по фото — Автоателье")}&body=${body}`;

    if (status) {
      status.hidden = false;
      status.textContent = "Открываю почту для отправки заявки.";
    }

    window.location.href = mailto;
  });

  const onScroll = () => {
    if (!header) return;
    header.style.borderBottomColor =
      window.scrollY > 12 ? "rgba(196, 30, 42, 0.28)" : "rgba(168, 159, 147, 0.18)";
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
