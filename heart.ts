// The heart page's one interaction: scroll horizontally (or land a slice into
// view any other way) and the caption below updates to describe that slice —
// the same "single source of truth" shape as main.ts's setActiveStage, just
// driven by scroll position instead of a data-active-stage attribute.

interface Slice {
  id: string;
  caption: string;
}

const SLICES: Slice[] = [
  { id: "1", caption: "Slice 1 of 5 — Outer surface. This is the whole heart, seen from the front." },
  {
    id: "2",
    caption: "Slice 2 of 5 — The right heart: right atrium, right ventricle, and the tricuspid valve between them.",
  },
  {
    id: "3",
    caption: "Slice 3 of 5 — Down the middle: the septum dividing the chambers, with all four valves in cross-section.",
  },
  {
    id: "4",
    caption: "Slice 4 of 5 — The left heart: left atrium, left ventricle, and the mitral valve between them.",
  },
  {
    id: "5",
    caption: "Slice 5 of 5 — The great vessels: the aorta, pulmonary artery, pulmonary veins, and venae cavae.",
  },
];

const caption = document.querySelector<HTMLElement>("[data-testid='caption']");
const sections = document.querySelectorAll<HTMLElement>("[data-testid^='slice-']");

function setActiveSlice(id: string): void {
  const slice = SLICES.find((s) => s.id === id);
  if (!slice || !caption) return;
  caption.textContent = slice.caption;
}

const sliceForSection = new Map(
  [...sections].map((section) => [section, section.dataset.testid?.replace("slice-", "")]),
);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (visible.length === 0) return;

    const closest = visible.reduce((best, entry) => (entry.intersectionRatio > best.intersectionRatio ? entry : best));
    const id = sliceForSection.get(closest.target as HTMLElement);
    if (id) setActiveSlice(id);
  },
  { root: document.querySelector("#slices"), threshold: 0.6 },
);

for (const section of sections) observer.observe(section);
