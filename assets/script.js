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
document.querySelectorAll(".mobileDropdown").forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;

    content.classList.toggle("hidden");

    // Optional + → –
    btn.querySelector("span").textContent = content.classList.contains("hidden")
      ? "+"
      : "−";
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
    btn.classList.remove("opacity-0", "pointer-events-none");
    btn.classList.add("opacity-100");
  } else {
    btn.classList.add("opacity-0", "pointer-events-none");
    btn.classList.remove("opacity-100");
  }
});

// Smooth scroll to top
btn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* ===============================
   GLORIOUS KNOWLEDGEBASE SEARCH
   =============================== */

class KnowledgeBaseSearch {
  constructor(data) {
    // Remove duplicates
    const map = new Map();

    data.forEach((item) => {
      const key = item.urls.join("-");
      if (!map.has(key)) map.set(key, item);
    });

    this.data = [...map.values()];

    // Build fast searchable index
    this.index = this.data.map((item) => ({
      ...item,
      titleNorm: this.normalize(item.title),
      blob: this.normalize(
        item.title + " " + item.content + " " + item.keywords.join(" "),
      ),
    }));
  }

  normalize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();
  }

  extractKeywords(sentence) {
    const stopWords = new Set([
      "how",
      "to",
      "the",
      "is",
      "a",
      "an",
      "and",
      "or",
      "i",
      "want",
      "can",
      "you",
      "for",
      "of",
      "in",
      "on",
      "with",
      "me",
      "my",
      "do",
    ]);

    return this.normalize(sentence)
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));
  }

  scoreItem(item, words) {
    let score = 0;

    words.forEach((word) => {
      if (item.titleNorm.includes(word)) {
        score += 0.45;
        return;
      }

      if (item.blob.includes(word)) {
        score += 0.25;
        return;
      }

      // fuzzy partial match
      const partial = word.slice(0, 4);
      if (item.blob.includes(partial)) {
        score += 0.1;
      }
    });

    return Math.min(score, 1);
  }

  search(sentence, limit = 6) {
    const words = this.extractKeywords(sentence);

    if (!words.length) return [];

    return this.index
      .map((item) => ({
        ...item,
        score: this.scoreItem(item, words),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

/* ===============================
   DEBOUNCE (WAIT PERIOD)
   =============================== */

function debounce(fn, delay = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ===============================
   INIT SEARCH
   =============================== */

(async function initGloriousSearch() {
  try {
    const response = await fetch("/search/search-glorious.json");

    if (!response.ok) throw new Error("Knowledgebase failed to load");

    const data = await response.json();

    const kbSearch = new KnowledgeBaseSearch(data);

    setupSearchInput(kbSearch);
  } catch (err) {
    console.error("Search init error:", err);
  }
})();

/* ===============================
   INPUT HANDLER
   =============================== */

function setupSearchInput(kbSearch) {
  const input = document.querySelector("#glorious-search-input");

  if (!input) {
    console.warn("Search input not found");
    return;
  }

  // Wrap input so popover positions correctly
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";

  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  // Create popover
  const popover = document.createElement("div");
  popover.className =
    "glorious-popover flex flex-col gap-2 p-4 w-full mt-2 text-left rounded-lg shadow-lg bg-white border border-gray-200";
  popover.style.display = "none";

  wrapper.appendChild(popover);

  let lastQuery = "";

  const handleSearch = debounce((event) => {
    const query = event.target.value.trim();

    // prevent tiny searches
    if (query.length < 2) return;

    // prevent duplicate searches
    if (query === lastQuery) return;

    lastQuery = query;

    const results = kbSearch.search(query);

    console.log("Search Results:", results);

    renderPopover(results);
    // 👉 render dropdown here if needed
  }, 300);

  input.addEventListener("input", handleSearch);
  /* =========================
       RENDER RESULTS
       ========================= */

  function renderPopover(results) {
    popover.innerHTML = "";

    if (!results.length) {
      popover.innerHTML = `<div class="glorious-empty">No articles found</div>`;

      popover.style.display = "block";
      return;
    }

    results.forEach((item) => {
      item.urls.forEach((url) => {
        const link = document.createElement("a");

        link.href = url;
        link.className = "glorious-item";
        link.textContent = item.title;

        popover.appendChild(link);
      });
    });

    popover.style.display = "block";
  }

  /* =========================
       CLOSE ON OUTSIDE CLICK
       ========================= */

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      popover.style.display = "none";
    }
  });
  /* =========================
   OPEN ON INPUT FOCUS
   ========================= */

  input.addEventListener("focus", () => {
    const query = input.value.trim();

    // If user already typed something → show results immediately
    if (query.length >= 2) {
      const results = kbSearch.search(query);
      renderPopover(results);

      return;
    }

    // Optional behavior:
    // show nothing when empty
    popover.style.display = "none";
  });
  popover.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });
}
