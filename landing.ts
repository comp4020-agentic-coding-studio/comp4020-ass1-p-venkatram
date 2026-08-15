// The landing page's one interaction: clicking (or keyboard-activating) the
// heart plays a zoom transition before following its href to heart.html. The
// href is a real link throughout, so this is a progressive enhancement — with
// JS disabled, or under prefers-reduced-motion, the click just navigates.

const heartLink = document.querySelector<HTMLAnchorElement>("#heart-link");

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

heartLink?.addEventListener("click", (event) => {
  const href = heartLink.getAttribute("href");
  if (!href || prefersReducedMotion()) return;

  event.preventDefault();
  document.body.classList.add("zooming-to-heart");
  window.setTimeout(() => {
    window.location.href = href;
  }, 600);
});
