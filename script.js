const modalButtons = document.querySelectorAll("[data-modal]");
const modalCloseButtons = document.querySelectorAll("[data-close-modal]");
const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function closeMobileNav() {
  if (!navToggle || !mobileNav) return;
  navToggle.classList.remove("is-open");
  mobileNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Mở menu");
  document.body.classList.remove("nav-open");
}

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = !navToggle.classList.contains("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    mobileNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
    document.body.classList.toggle("nav-open", isOpen);
  });

  mobileNav.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) return;
    if (event.target.closest(".mobile-nav") || event.target.closest(".nav-toggle")) return;
    closeMobileNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1060) closeMobileNav();
  });
}

function openBrochureModal(modal) {
  if (!modal) return;
  document.body.classList.add("modal-open");
  modal.classList.add("is-open");

  if (typeof modal.showModal === "function") {
    try {
      if (!modal.open) {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
      return;
    } catch (error) {
      // Fall through to the manual open-state path for browsers that
      // support <dialog> imperfectly, especially on older iOS builds.
    }
  }

  modal.setAttribute("open", "");
}

function closeBrochureModal(modal) {
  if (!modal) return;
  modal.classList.remove("is-open");

  if (typeof modal.close === "function" && modal.open) {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }

  document.body.classList.remove("modal-open");
}

modalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.getElementById(button.dataset.modal);
    if (!modal) return;
    openBrochureModal(modal);
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeBrochureModal(button.closest("dialog"));
  });
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    dialog.classList.remove("is-open");
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeBrochureModal(dialog);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll("dialog.brochure-modal[open]").forEach((dialog) => {
    closeBrochureModal(dialog);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    const header = document.querySelector(".site-header");
    const headerOffset = (header ? header.offsetHeight : 0) + 24;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    event.preventDefault();
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  });
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (form.closest("dialog")) return;
    event.preventDefault();
    form.reset();
  });
});
