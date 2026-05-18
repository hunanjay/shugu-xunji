export function renderIndexZone(els, step) {
  if (!step.blocks) {
    els.indexZone.innerHTML = "";
    return;
  }

  const activeBlock = step.activeBlock;
  const selectedBlock = step.selectedBlock;
  const rejectedBlocks = step.rejectedBlocks ?? [];
  els.indexZone.innerHTML = `
    <div class="index-row">
      ${step.blocks
        .map((block) => {
          const classes = ["index-block"];
          if (block.id === activeBlock || block.id === selectedBlock) classes.push("active");
          if (rejectedBlocks.includes(block.id)) classes.push("rejected");
          return `
            <div class="${classes.join(" ")}">
              <div>
                <strong>max ${block.max}</strong>
                <span>块 ${block.id + 1}: ${block.start} - ${block.end}</span>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

export function renderArray(els, searchCase, step, state) {
  const range = step.range;
  const blockRange = step.blockRange;
  els.arrayZone.innerHTML = `
    <div class="array-row" style="--item-count: ${searchCase.data.length}">
      ${renderSelectedBlockBand(blockRange)}
      ${searchCase.data
        .map((value, index) => {
          const classes = ["array-cell"];
          if (index === step.activeIndex) classes.push("active");
          if (index === step.foundIndex) classes.push("found");
          if ((step.missIndexes ?? []).includes(index)) classes.push("miss");
          if (range && index >= range[0] && index <= range[1]) classes.push("in-range");
          if (range && (index < range[0] || index > range[1])) classes.push("out-range");
          if (blockRange && index >= blockRange[0] && index <= blockRange[1]) {
            classes.push("in-block");
          }
          if (blockRange && (index < blockRange[0] || index > blockRange[1])) {
            classes.push("out-range");
          }

          return `
            <div class="array-cell-wrap" style="grid-column: ${index + 1}">
              <div class="cell-label">${index}</div>
              <div class="${classes.join(" ")}">${value}</div>
              <div class="cell-markers">
                ${renderCellPointers(step, index, searchCase.data.length, state)}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

export function renderSelectedBlockBand(blockRange) {
  if (!blockRange) return "";
  const [start, end] = blockRange;
  return `
    <div
      class="selected-block-band"
      style="grid-column: ${start + 1} / ${end + 2}"
      aria-hidden="true"
    ></div>
  `;
}

export function renderCellPointers(step, index, dataLength, state) {
  const currentPointers = step.pointers ?? [];
  const currentHtml = currentPointers
    .filter((pointer) => pointer.value === index && pointer.value >= 0 && pointer.value < dataLength)
    .map(
      (pointer) => `
        <span
          class="cell-marker ${pointerClass(pointer.label)}"
          style="view-transition-name: pointer-${pointerKey(pointer.label)}"
        >
          ${pointerShortLabel(pointer.label)}
        </span>
      `,
    )
    .join("");
  return `${currentHtml}${renderPointerTrail(currentPointers, index, dataLength, state)}`;
}

export function renderPointerTrail(currentPointers, index, dataLength, state) {
  const currentKeys = new Set(
    currentPointers
      .filter((pointer) => pointer.value === index)
      .map((pointer) => pointerKey(pointer.label)),
  );
  const trail = [];

  for (let offset = 1; offset <= 2; offset += 1) {
    const step = state.steps[state.stepIndex - offset];
    if (!step) continue;
    for (const pointer of step.pointers ?? []) {
      if (
        pointer.value === index &&
        pointer.value >= 0 &&
        pointer.value < dataLength &&
        !currentKeys.has(pointerKey(pointer.label)) &&
        !trail.some((item) => pointerKey(item.pointer.label) === pointerKey(pointer.label) && item.index === index)
      ) {
        trail.push({ pointer, key: pointerKey(pointer.label), age: offset, index });
      }
    }
  }

  return trail
    .map(
      ({ pointer, age }) => `
        <span class="cell-marker trail trail-${age} ${pointerClass(pointer.label)}">
          ${pointerShortLabel(pointer.label)}
        </span>
      `,
    )
    .join("");
}

export function renderPointers(els, step) {
  const pointers = step.pointers ?? [];
  els.pointerZone.innerHTML = pointers
    .map(
      (pointer) => `
        <div class="pointer ${pointerClass(pointer.label)}">
          ${pointerDisplayLabel(pointer.label)}
          <small>${pointer.value}</small>
        </div>
      `,
    )
    .join("");
}

export function pointerClass(label) {
  if (label === "low") return "pointer-low";
  if (label === "mid") return "pointer-mid";
  if (label === "high") return "pointer-high";
  return "pointer-scan";
}

export function pointerKey(label) {
  if (label === "low") return "low";
  if (label === "mid") return "mid";
  if (label === "high") return "high";
  return "scan";
}

export function pointerShortLabel(label) {
  if (label === "low") return "low";
  if (label === "mid") return "mid";
  if (label === "high") return "high";
  return "i";
}

export function pointerDisplayLabel(label) {
  if (label === "low") return "左指针 low";
  if (label === "mid") return "中间 mid";
  if (label === "high") return "右指针 high";
  if (label === "块内 i") return "块内指针 i";
  return "当前指针 i";
}
