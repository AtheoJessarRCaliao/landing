const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const menuFilters = document.querySelectorAll(".menu-filter");
const menuCards = document.querySelectorAll(".menu-item-card");
const revealTargets = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const yearNode = document.getElementById("year");
const backToTop = document.getElementById("backToTop");
const sectionAnchors = Array.from(document.querySelectorAll("main section[id]"));

function setHeaderState() {
  const scrolled = window.scrollY > 18;
  header.classList.toggle("is-scrolled", scrolled);
  backToTop.classList.toggle("is-visible", window.scrollY > 600);
}

function closeMobileMenu() {
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function openMobileMenu() {
  header.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
}

function toggleMobileMenu() {
  const isOpen = header.classList.contains("is-open");
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function smoothScrollWithOffset(targetId) {
  const section = document.querySelector(targetId);
  if (!section) return;

  const top = section.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
  window.scrollTo({ top, behavior: "smooth" });
}

function setActiveNav() {
  const currentTop = window.scrollY + header.offsetHeight + 18;

  let activeId = sectionAnchors[0]?.id || "";
  for (const section of sectionAnchors) {
    if (currentTop >= section.offsetTop) {
      activeId = section.id;
    }
  }

  navLinks.forEach((link) => {
    const linkTarget = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("is-active", linkTarget === activeId);
  });
}

function handleMenuFilterClick(event) {
  const filter = event.currentTarget.dataset.filter;

  menuFilters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
  });

  menuCards.forEach((card) => {
    const show = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !show);
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

navToggle?.addEventListener("click", toggleMobileMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    event.preventDefault();
    smoothScrollWithOffset(href);
    closeMobileMenu();
  });
});

menuFilters.forEach((button) => {
  button.addEventListener("click", handleMenuFilterClick);
});

window.addEventListener("scroll", () => {
  setHeaderState();
  setActiveNav();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMobileMenu();
  }
});

document.addEventListener("click", (event) => {
  if (
    header.classList.contains("is-open") &&
    !header.contains(event.target)
  ) {
    closeMobileMenu();
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();

  if (!name) {
    formMessage.textContent = "Please provide your name before submitting.";
    return;
  }

  formMessage.textContent = `Thank you, ${name}. Your message has been received. We will contact you shortly.`;
  contactForm.reset();
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

yearNode.textContent = String(new Date().getFullYear());
setHeaderState();
setActiveNav();
