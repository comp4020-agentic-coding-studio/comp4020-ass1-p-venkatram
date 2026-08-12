// The one interaction this prototype has: pick a stage — by clicking it or by
// scrolling it into view — and the heart diagram highlights that stage's
// path and animates blood cells along it. `setActiveStage` is the single
// place that happens, so click and scroll can never disagree with each other.

interface Stage {
  id: string;
  caption: string;
}

const STAGES: Stage[] = [
  { id: "1", caption: "Deoxygenated blood returns from the body through the venae cavae into the right atrium." },
  { id: "2", caption: "The right atrium pushes blood through the tricuspid valve into the right ventricle." },
  { id: "3", caption: "The right ventricle pumps blood through the pulmonary valve toward the lungs." },
  { id: "4", caption: "Oxygenated blood returns from the lungs through the pulmonary veins into the left atrium." },
  { id: "5", caption: "The left atrium pushes blood through the mitral valve into the left ventricle." },
  {
    id: "6",
    caption: "The left ventricle pumps oxygenated blood through the aortic valve into the aorta, out to the body.",
  },
];

const diagram = document.querySelector<HTMLElement>("[data-testid=\"diagram\"]");
const caption = document.querySelector<HTMLElement>("[data-testid=\"caption\"]");
const flowchart = document.querySelector<HTMLElement>("#flowchart");
const buttons = document.querySelectorAll<HTMLButtonElement>("[data-stage-target]");
const sections = document.querySelectorAll<HTMLElement>("[data-testid^='stage-']");

function setActiveStage(id: string): void {
  const stage = STAGES.find((s) => s.id === id);
  if (!stage || !diagram || !caption) return;

  diagram.dataset.activeStage = id;
  caption.textContent = stage.caption;
  if (flowchart) flowchart.dataset.activeStage = id;

  for (const button of buttons) {
    button.setAttribute("aria-pressed", String(button.dataset.stageTarget === id));
  }

  for (const flow of diagram.querySelectorAll<SVGGElement>(".flow-path")) {
    const isActive = flow.id === `flow-${id}`;
    flow.classList.toggle("is-active", isActive);
    if (!isActive) continue;

    const branches = flow.querySelectorAll<SVGGElement>(".flow-branch");
    const groups = branches.length > 0 ? [...branches] : [flow];
    for (const group of groups) {
      const guide = group.querySelector<SVGPathElement>("path");
      const d = guide?.getAttribute("d");
      if (!d) continue;
      for (const cell of group.querySelectorAll<SVGCircleElement>(".blood-cell")) {
        cell.style.offsetPath = `path('${d}')`;
      }
    }
  }
}

for (const button of buttons) {
  button.addEventListener("click", () => {
    const id = button.dataset.stageTarget;
    if (!id) return;
    setActiveStage(id);
    button.closest("section")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

const stageForSection = new Map(
  [...sections].map((section) => [section, section.querySelector<HTMLButtonElement>("[data-stage-target]")?.dataset.stageTarget]),
);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (visible.length === 0) return;

    const closest = visible.reduce((best, entry) => (entry.intersectionRatio > best.intersectionRatio ? entry : best));
    const id = stageForSection.get(closest.target as HTMLElement);
    if (id) setActiveStage(id);
  },
  { rootMargin: "-45% 0px -45% 0px" },
);

for (const section of sections) observer.observe(section);

setActiveStage("1");
