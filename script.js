// Animate on scroll
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".fade-in, .slide-up").forEach(el => {
  observer.observe(el);
});
