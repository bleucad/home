const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const quoteForm = document.querySelector("[data-quote-form]");
const formNote = document.querySelector("[data-form-note]");

function updateScrollState() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  document.documentElement.style.setProperty("--scroll-width", `${progress}%`);
  header.classList.toggle("is-scrolled", scrollTop > 20);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
  observer.observe(item);
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Demande prête. Connectez ce formulaire à votre email ou WhatsApp pour recevoir les projets.";
  formNote.classList.add("is-success");
  quoteForm.reset();
});
