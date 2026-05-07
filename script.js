const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const quoteForm = document.querySelector("[data-quote-form]");
const formNote = document.querySelector("[data-form-note]");
const whatsappPhone = "212631178841";

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

function buildWhatsappUrl(quote) {
  const message = [
    "Bonjour BLEUCAD, je souhaite faire une demande.",
    "",
    `Nom: ${quote.name}`,
    `Service: ${quote.service}`,
    `Details: ${quote.message}`,
    `Fichier joint: ${quote.fileName}`,
    `Date: ${quote.date}`,
    "",
    "Merci de me contacter pour le devis."
  ].join("\n");

  return `https://api.whatsapp.com/send/?phone=${whatsappPhone}&text=${encodeURIComponent(message)}`;
}

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(quoteForm);
  const file = formData.get("file");
  const quote = {
    date: new Date().toLocaleString("fr-FR"),
    name: formData.get("name"),
    service: formData.get("service"),
    message: formData.get("message"),
    fileName: file && file.name ? file.name : "Aucun fichier"
  };
  const whatsappUrl = buildWhatsappUrl(quote);

  formNote.textContent = "Message WhatsApp pret. Ouverture de WhatsApp...";
  formNote.classList.add("is-success");
  quoteForm.reset();

  const openedWindow = window.open(whatsappUrl, "_blank");
  if (!openedWindow) {
    window.location.href = whatsappUrl;
  }
});
