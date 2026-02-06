const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        entry.target.classList.remove("opacity-0", "translate-y-10");
        entry.target.classList.add("opacity-100", "translate-y-0");
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
// Get pages.json
let pageTitleMap = new Map();
function normalizeUrl(url) {
  return url.replace(/\/$/, "").toLowerCase();
}
async function loadPagesIndex() {
  const response = await fetch("/search/pages.json");

  if (!response.ok) {
    throw new Error("Failed to load pages.json");
  }

  const pages = await response.json();

  pages.forEach((page) => {
    pageTitleMap.set(page.url, page.title);
  });
}

function getTitle(url) {
  return pageTitleMap.get(normalizeUrl(url)) || null;
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadPagesIndex();
});
// Menu
const toggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

let open = false;

toggle.addEventListener("click", () => {
  open = !open;

  mobileMenu.classList.toggle("opacity-0");
  mobileMenu.classList.toggle("-translate-y-4");
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
const tutorialsbtn = document.getElementById("tutorialsBtn");
const themesmenu = document.getElementById("themesmegaMenu");
const helpcentermenu = document.getElementById("helpcentermegaMenu");
const tutorialsmenu = document.getElementById("tutorialsmegaMenu");

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
  if (
    !helpcenterbtn.contains(e.target) &&
    !helpcentermenu.contains(e.target)
  ) {
    helpcentermenu.classList.add(
      "opacity-0",
      "pointer-events-none",
      "translate-y-4",
    );
  }
});

// Tutorials Menu Toggle
tutorialsbtn.addEventListener("click", () => {
  tutorialsmenu.classList.toggle("opacity-0");
  tutorialsmenu.classList.toggle("pointer-events-none");
  tutorialsmenu.classList.toggle("translate-y-4");
});

document.addEventListener("click", (e) => {
  if (!tutorialsbtn.contains(e.target) && !tutorialsmenu.contains(e.target)) {
    tutorialsmenu.classList.add(
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

/* =====================================
   GLORIOUS ELITE SEARCH (STACK SAFE)
   ===================================== */

/* ===============================
   SEARCH ENGINE
   =============================== */

class KnowledgeBaseSearch {
  constructor(data) {
    const map = new Map();

    data.forEach((item) => {
      const key = item.urls.join("-");
      if (!map.has(key)) map.set(key, item);
    });

    this.index = [...map.values()].map((item) => ({
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
      .filter((w) => w.length > 2 && !stopWords.has(w));
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

      if (item.blob.includes(word.slice(0, 4))) {
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
      .filter((i) => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

/* ===============================
   DEBOUNCE
   =============================== */

function debounce(fn, delay = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ===============================
   INIT
   =============================== */

document.addEventListener("DOMContentLoaded", initGloriousSearch);

async function initGloriousSearch() {
  try {
    const res = await fetch("/search/search-glorious.json");

    if (!res.ok) throw new Error("Knowledgebase failed to load");

    const data = await res.json();

    const kbSearch = new KnowledgeBaseSearch(data);

    setupSearchInput(kbSearch);
  } catch (err) {
    console.error("Search init error:", err);
  }
}

/* ===============================
   UI + POPOVER (BODY PORTAL)
   =============================== */

function setupSearchInput(kbSearch) {
  const input = document.querySelector("#glorious-search-input");
  if (!input) return;

  /* ---------- CREATE POPOVER ---------- */

  const popover = document.createElement("div");

  popover.className = "glorious-popover";

  Object.assign(popover.style, {
    position: "fixed",
    background: "#fff",
    padding: "8px",
    borderRadius: "12px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
    border: "1px solid #eee",
    zIndex: "10000",
    display: "none",
    minHeight: "50px",
    overflowY: "auto",
  });

  document.body.appendChild(popover);

  /* ---------- POSITION ENGINE ---------- */

  function positionPopover() {
    const rect = input.getBoundingClientRect();

    popover.style.top = rect.bottom + 6 + "px";
    popover.style.left = rect.left + "px";
    popover.style.width = rect.width + "px";
  }

  /* ---------- RENDER ---------- */

  function render(results) {
    popover.innerHTML = "";

    if (!results.length) {
      popover.innerHTML = `<div style="padding:20px;color:#777">
                    No articles found
                 </div>`;

      positionPopover();
      popover.style.display = "block";
      return;
    }
    console.log(results);
    results.forEach((item) => {
      item.urls.forEach((url) => {
        const link = document.createElement("a");

        link.href = url;
        if (getTitle(url)) {
          link.textContent = getTitle(url);

          Object.assign(link.style, {
            display: "block",
            padding: "16px",
            textDecoration: "none",
            color: "#222",
            fontSize: "14px",
          });

          link.addEventListener("mouseenter", () => {
            link.style.background = "#f5f5f5";
          });

          link.addEventListener("mouseleave", () => {
            link.style.background = "transparent";
          });

          popover.appendChild(link);
        }
      });
    });

    positionPopover();
    popover.style.display = "block";
  }

  /* ---------- SEARCH ---------- */

  let lastQuery = "";

  const handleSearch = debounce((e) => {
    const query = e.target.value.trim();

    if (query.length < 2) {
      popover.style.display = "none";
      return;
    }

    if (query === lastQuery) return;
    lastQuery = query;

    const results = kbSearch.search(query);

    render(results);
  }, 300);

  input.addEventListener("input", handleSearch);

  /* ---------- OPEN ON FOCUS ---------- */

  input.addEventListener("focus", () => {
    const query = input.value.trim();

    if (query.length >= 2) {
      render(kbSearch.search(query));
    }
  });

  /* ---------- PREVENT BLUR WHEN CLICKING POPOVER ---------- */

  popover.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

  /* ---------- OUTSIDE CLICK ---------- */

  document.addEventListener("pointerdown", (e) => {
    if (!popover.contains(e.target) && e.target !== input) {
      popover.style.display = "none";
    }
  });

  /* ---------- KEEP POSITION PERFECT ---------- */

  window.addEventListener("resize", positionPopover);
  window.addEventListener("scroll", positionPopover, true);
}

/* BLOG PAGE SPECIFIC JS */
/*
const track = document.getElementById("track");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let _blog_index = 0;

function getCardWidth() {
  const card = track.querySelector("article");
  const gap = 32; // gap-8
  return card.offsetWidth + gap;
}
if (next) {
  next.addEventListener("click", () => {
    const maxIndex = track.children.length - 1;
    if (_blog_index < maxIndex) _blog_index++;
    track.style.transform = `translateX(-${_blog_index * getCardWidth()}px)`;
  });
}

prev.addEventListener("click", () => {
  if (_blog_index > 0) _blog_index--;
  track.style.transform = `translateX(-${_blog_index * getCardWidth()}px)`;
});

// Optional: swipe support
let startX = 0;

track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

track.addEventListener("touchend", (e) => {
  let diff = startX - e.changedTouches[0].clientX;

  if (diff > 50) next.click();
  if (diff < -50) prev.click();
});*/

class BlogSlider extends HTMLElement {
  constructor() {
    super();

    // bind methods so "this" always refers to the component
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this._blog_index = 0;
  }

  getCardWidth() {
    const card = track.querySelector("article");
    const gap = 32; // gap-8
    return card.offsetWidth + gap;
  }

  connectedCallback() {
    // Runs when element is added to DOM
    this.nextBtn = this.querySelector("#next");
    this.prevBtn = this.querySelector("#prev");

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", this.handleNext);
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", this.handlePrev);
    }
  }

  disconnectedCallback() {
    // Clean up listeners (important for theme editor reloads)
    if (this.nextBtn) {
      this.nextBtn.removeEventListener("click", this.handleNext);
    }

    if (this.prevBtn) {
      this.prevBtn.removeEventListener("click", this.handlePrev);
    }
  }

  handleNext() {
    this.slide("next");
  }

  handlePrev() {
    this.slide("prev");
  }

  slide(direction) {
    //console.log(`Sliding ${direction}`);

    // 👉 Put your slider logic here
    // Example:
    // this.track.scrollBy({ left: 300, behavior: "smooth" });
    if (direction == "next") {
      const maxIndex = track.children.length - 1;
      if (this._blog_index < maxIndex) this._blog_index++;
      track.style.transform = `translateX(-${this._blog_index * this.getCardWidth()}px)`;
    } else {
      if (this._blog_index > 0) this._blog_index--;
      track.style.transform = `translateX(-${this._blog_index * this.getCardWidth()}px)`;
    }
  }
}

customElements.define("blog-slider", BlogSlider);

// Staggered reveal animation
window.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".fade-up");
  const hero = document.querySelector(".hero-reveal");
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), 180 * i);
  });
  if (hero) {
    setTimeout(() => hero.classList.add("show"), 500);
  }
});
/*
class BlogSlider extends HTMLElement {
  constructor() {
    super();

    this.track = this.querySelector("#track");
    this.next = this.querySelector("#next");
    this.prev = this.querySelector("#prev");

    this.index = 0;
    this.startX = 0;
  }

  connectedCallback() {
    if (!this.track) return;

    this.next?.addEventListener("click", this.handleNext);
    this.prev?.addEventListener("click", this.handlePrev);

    // Swipe
    this.track.addEventListener("touchstart", this.handleTouchStart, {
      passive: true,
    });

    this.track.addEventListener("touchend", this.handleTouchEnd);
  }

  disconnectedCallback() {
    this.next?.removeEventListener("click", this.handleNext);
    this.prev?.removeEventListener("click", this.handlePrev);
  }

  getCardWidth() {
    const card = this.track.querySelector("article");
    if (!card) return 0;

    const styles = window.getComputedStyle(this.track);
    const gap = parseInt(styles.columnGap || styles.gap || 0);

    return card.offsetWidth + gap;
  }

  updateSlider() {
    this.track.style.transform = `translateX(-${
      this.index * this.getCardWidth()
    }px)`;
  }

  handleNext = () => {
    const maxIndex = this.track.children.length - 1;
    if (this.index < maxIndex) {
      this.index++;
      this.updateSlider();
    }
  };

  handlePrev = () => {
    if (this.index > 0) {
      this.index--;
      this.updateSlider();
    }
  };

  handleTouchStart = (e) => {
    this.startX = e.touches[0].clientX;
  };

  handleTouchEnd = (e) => {
    const diff = this.startX - e.changedTouches[0].clientX;

    if (diff > 50) this.handleNext();
    if (diff < -50) this.handlePrev();
  };
}

customElements.define("blog-slider", BlogSlider);
*/
/***** Megamenu closing *****/
const wrappers = document.querySelectorAll(".mega-wrapper");


function closeAllMegaMenus() {
  wrappers.forEach((wrapper) => {
    //console.log("Closing menu in wrapper:", wrapper.querySelector(".mega-menu"));
    wrapper.querySelector(".mega-menu")?.classList.add("hidden");
  });
}

// Toggle menu
/*
wrappers.forEach((wrapper) => {
  const trigger = wrapper.querySelector(".mega-trigger");
  const menu = wrapper.querySelector(".mega-menu");

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();

    // close others first (pro UX)
    closeAllMegaMenus();

    menu.classList.toggle("hidden");
  });

  // prevent inside clicks from bubbling to document
  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

// ✅ CLICK OUTSIDE
document.addEventListener("click", () => {
  closeAllMegaMenus();
});

// ✅ ENTER + ESC KEY
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === "Escape") {
    closeAllMegaMenus();
  }
});*/
/*
function hasOpenMenu() {
  return [...wrappers].some(w =>
    !w.querySelector(".mega-menu")?.classList.contains("hidden")
  );
}

document.addEventListener("click", () => {
  if (hasOpenMenu()) closeAllMegaMenus();
});*/

/***** Chatwoot *****/
(function (d, t) {
  var BASE_URL = "https://srv1267364.hstgr.cloud";
  var g = d.createElement(t),
    s = d.getElementsByTagName(t)[0];
  g.src = BASE_URL + "/packs/js/sdk.js";
  g.async = true;
  s.parentNode.insertBefore(g, s);
  g.onload = function () {
    window.chatwootSDK.run({
      websiteToken: "Reioogm8okSEw3WT44dUNeYf",
      baseUrl: BASE_URL,
    });
  };
})(document, "script");
