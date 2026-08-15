// Each door layer is a pair of images (left/right half, clipped at the centre
// seam) that hinge open around that seam as the user scrolls, like the
// exploded-view "case opening" on ciechanow.ski/mechanical-watch — except
// here the layers are the heart's own surface/cutaway/flow images, not a
// synthetic 3D model.
const MAX_ANGLE_DEG = 100;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const slices = document.querySelector<HTMLDivElement>("#slices");
const layer1Left = document.querySelector<HTMLElement>('[data-door-layer="1"] [data-door="left"]');
const layer1Right = document.querySelector<HTMLElement>('[data-door-layer="1"] [data-door="right"]');
const layer2Left = document.querySelector<HTMLElement>('[data-door-layer="2"] [data-door="left"]');
const layer2Right = document.querySelector<HTMLElement>('[data-door-layer="2"] [data-door="right"]');

if (slices && layer1Left && layer1Right && layer2Left && layer2Right) {
  const update = () => {
    const maxScroll = slices.scrollWidth - slices.clientWidth;
    const fraction = maxScroll > 0 ? clamp(slices.scrollLeft / maxScroll, 0, 1) : 0;

    // First half of the scroll: the outer-surface doors swing open.
    const layer1T = clamp(fraction / 0.5, 0, 1);
    // Second half: the cutaway doors swing open to reveal the flow layer.
    const layer2T = clamp((fraction - 0.5) / 0.5, 0, 1);

    const angle1 = layer1T * MAX_ANGLE_DEG;
    const angle2 = layer2T * MAX_ANGLE_DEG;

    layer1Left.style.transform = `rotateY(${angle1}deg)`;
    layer1Right.style.transform = `rotateY(${-angle1}deg)`;
    layer2Left.style.transform = `rotateY(${angle2}deg)`;
    layer2Right.style.transform = `rotateY(${-angle2}deg)`;
  };

  let ticking = false;
  const onScrollOrResize = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  slices.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  update();
}
