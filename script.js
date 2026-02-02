const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/***** Navigation *****/

const themesbtn = document.getElementById("themesBtn");
const helpcenterbtn = document.getElementById("helpcenterBtn");
const themesmenu = document.getElementById("themesmegaMenu");
const helpcentermenu = document.getElementById("helpcentermegaMenu");

// Themes Menu Toggle
themesbtn.addEventListener("click", () => {
  themesmenu.classList.toggle("opacity-0");
  themesmenu.classList.toggle("pointer-events-none");
  themesmenu.classList.toggle("translate-y-4");
});

document.addEventListener("click", (e) => {
  if (!themesbtn.contains(e.target) && !themesmenu.contains(e.target)) {
    themesmenu.classList.add(
      "opacity-0",
      "pointer-events-none",
      "translate-y-4",
    );
  }
});
// Help Center Menu Toggle
helpcenterbtn.addEventListener("click", () => {
  helpcentermenu.classList.toggle("opacity-0");
  helpcentermenu.classList.toggle("pointer-events-none");
  helpcentermenu.classList.toggle("translate-y-4");
});

document.addEventListener("click", (e) => {
  if (!helpcenterbtn.contains(e.target) && !helpcentermenu.contains(e.target)) {
    helpcentermenu.classList.add(
      "opacity-0",
      "pointer-events-none",
      "translate-y-4",
    );
  }
});

/***** Accordion *****/
document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.parentElement;
    const body = item.querySelector(".accordion-body");
    const icon = header.querySelector(".icon");

    document.querySelectorAll(".accordion-body").forEach((b) => {
      if (b !== body) {
        b.classList.add("hidden");
        b.parentElement.querySelector(".icon").textContent = "+";
      }
    });

    body.classList.toggle("hidden");
    icon.textContent = body.classList.contains("hidden") ? "+" : "−";
  });
});
/***** Testimonials *****/
const slides = document.querySelectorAll(".testimonial-slide");
const dots = document.querySelectorAll(".dot");
let index = 0;

function showSlide(i) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle("hidden", idx !== i);
    dots[idx].classList.toggle("bg-black", idx === i);
    dots[idx].classList.toggle("bg-black/30", idx !== i);
  });
}

function nextTestimonial() {
  index = (index + 1) % slides.length;
  showSlide(index);
}

function prevTestimonial() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}
