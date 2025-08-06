document.addEventListener("DOMContentLoaded", function () {
  // --- Pre-loader Logic ---
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    preloader.classList.add("loaded");
  });

  // --- Custom Cursor Logic ---
  const cursorDot = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");

  window.addEventListener("mousemove", (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
  });

  const interactiveElements = document.querySelectorAll(
    ".interactive-link, button"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover")
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover")
    );
  });

  // --- Greeting Cycle Logic ---
  const greetingElement = document.getElementById("greeting-text");
  const greetings = [
    "Namaste",
    "Bonjour",
    "Ciao",
    "Hola!",
    "Hey there!",
    "Wassup?",
    "Yo!",
    "Sup?",
  ];
  let greetingIndex = 0;

  function cycleGreetings() {
    greetingElement.classList.remove("visible");

    setTimeout(() => {
      greetingIndex = (greetingIndex + 1) % greetings.length;
      greetingElement.textContent = greetings[greetingIndex];
      greetingElement.classList.add("visible");
    }, 200);
  }

  greetingElement.textContent = greetings[greetingIndex];
  greetingElement.classList.add("visible");
  setInterval(cycleGreetings, 2500);

  // --- Typewriter Logic ---
  const typewriterElement = document.getElementById("typewriter");
  const words = [
    "one lazy soul.",
    "chess he he☺",
    "pretty li'l delusional.",
    "thinking...",
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    let displayText = "";

    if (isDeleting) {
      displayText = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      displayText = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    typewriterElement.textContent = displayText;

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }
  setTimeout(type, 500);

  // --- Header Scroll Logic ---
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("header-scrolled", window.scrollY > 50);
  });

  // --- Scroll Animation ---
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => observer.observe(el));

  // --- Mobile Menu ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenuCloseButton = document.getElementById(
    "mobile-menu-close-button"
  );
  const mobileMenuBackdrop = document.getElementById("mobile-menu-backdrop");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  function openMenu() {
    mobileMenuBackdrop.classList.add("open");
  }
  function closeMenu() {
    mobileMenuBackdrop.classList.remove("open");
  }
  mobileMenuButton.addEventListener("click", openMenu);
  mobileMenuCloseButton.addEventListener("click", closeMenu);
  mobileMenuBackdrop.addEventListener("click", (event) => {
    if (event.target === mobileMenuBackdrop) closeMenu();
  });
  mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // --- Vanilla Tilt ---
  VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
  });

  const scrollContainer = document.getElementById("projects-container");
  const scrollLeftBtn = document.getElementById("scroll-left-btn");
  const scrollRightBtn = document.getElementById("scroll-right-btn");

  if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
    const updateButtonState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const isAtStart = scrollLeft < 10;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

      scrollLeftBtn.style.opacity = isAtStart ? "0" : "1";
      scrollLeftBtn.style.pointerEvents = isAtStart ? "none" : "auto";

      scrollRightBtn.style.opacity = isAtEnd ? "0" : "1";
      scrollRightBtn.style.pointerEvents = isAtEnd ? "none" : "auto";
    };

    scrollRightBtn.addEventListener("click", () => {
      const scrollAmount = scrollContainer.clientWidth * 0.8;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    scrollLeftBtn.addEventListener("click", () => {
      const scrollAmount = scrollContainer.clientWidth * 0.8;
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    scrollContainer.addEventListener("scroll", updateButtonState, {
      passive: true,
    });
    window.addEventListener("load", updateButtonState);
    window.addEventListener("resize", updateButtonState);
  }
});


const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        formStatus.textContent = '';
        
        const formData = new FormData(contactForm);
        const formObject = Object.fromEntries(formData.entries());

        try {
            // This submits to YOUR serverless function, not Formspree
            const response = await fetch('/.netlify/functions/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject),
            });

            const result = await response.json();

            if (response.ok) {
                formStatus.textContent = result.message;
                formStatus.style.color = 'var(--accent-gold)';
                contactForm.reset();
            } else {
                formStatus.textContent = result.message || 'An error occurred.';
                formStatus.style.color = '#ff6b6b'; // A red color for errors
            }
        } catch (error) {
            formStatus.textContent = 'A network error occurred. Please try again.';
            formStatus.style.color = '#ff6b6b';
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}