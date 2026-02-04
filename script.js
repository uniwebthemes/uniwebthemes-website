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

// Menu
const toggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

let open = false;

toggle.addEventListener("click", () => {

  open = !open;

  mobileMenu.classList.toggle("opacity-0");
  mobileMenu.classList.toggle("-translate-y-3");
  mobileMenu.classList.toggle("pointer-events-none");

});


// Dropdowns
document.querySelectorAll(".mobileDropdown").forEach(btn => {

  btn.addEventListener("click", () => {

    const content = btn.nextElementSibling;

    content.classList.toggle("hidden");

    // Optional + → –
    btn.querySelector("span").textContent =
      content.classList.contains("hidden") ? "+" : "−";

  });

});

// Scroll spy
const sections = document.querySelectorAll("article section[id]");
const tocLinks = document.querySelectorAll(".toc-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  tocLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

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

const yearSpans = document.querySelectorAll(".year-span");
const currentYear = new Date().getFullYear();
yearSpans.forEach((span) => {
  span.textContent = currentYear;
});

/***** Back to top scroll *****/
const btn = document.getElementById("backToTop");

// Show / Hide button on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    btn.classList.remove("opacity-0","pointer-events-none");
    btn.classList.add("opacity-100");
  } else {
    btn.classList.add("opacity-0","pointer-events-none");
    btn.classList.remove("opacity-100");
  }
});

// Smooth scroll to top
btn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});