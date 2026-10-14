(() => {
  document.documentElement.classList.add("js");
  const content = window.LETTERGULLION_CONTENT;
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const contactUrls = {
    whatsapp: content.whatsappUrl,
    phone: content.phoneUrl,
    email: content.emailUrl,
    instagram: content.instagramUrl,
    facebook: content.facebookUrl,
    directions: content.directionsUrl
  };

  document.querySelectorAll("[data-contact]").forEach((link) => {
    const type = link.dataset.contact;
    const base = contactUrls[type];
    if (!base) return;
    if (type === "whatsapp" && link.dataset.message) {
      link.href = `${base}?text=${encodeURIComponent(link.dataset.message)}`;
      return;
    }
    link.href = base;
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  if (menuButton && nav) {
    const setMenu = (open) => {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    };

    menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  document.querySelectorAll("details").forEach((item) => {
    item.addEventListener("toggle", () => {
      const mark = item.querySelector("summary span");
      if (mark) mark.textContent = item.open ? "−" : "+";
    });
  });

  const form = document.querySelector("[data-enquiry-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const owner = data.get("ownerName").trim();
      const dog = data.get("dogName").trim();
      const body = [
        `Hi Libbie,`,
        ``,
        `My name is ${owner} and I’d like to enquire about ${data.get("service").toLowerCase()} for ${dog}.`,
        data.get("dates") ? `Dates: ${data.get("dates")}` : `Dates: To be discussed`,
        ``,
        data.get("message") || `I’d be happy to share more details about my dog.`,
        ``,
        `Thank you,`,
        owner
      ].join("\n");
      window.location.href = `${content.whatsappUrl}?text=${encodeURIComponent(body)}`;
    });
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
  }

  window.addEventListener("load", () => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (target) window.setTimeout(() => target.scrollIntoView({ block: "start" }), 80);
  });
})();
