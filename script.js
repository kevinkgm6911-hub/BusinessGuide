document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("questionnaire").classList.remove("hidden");
});

document.querySelectorAll(".answer").forEach(btn => {
  btn.addEventListener("click", () => {
    const next = btn.dataset.next;
    window.location.href = `resources/${next}.html`;
  });
});
