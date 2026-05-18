const algorithms = [
  {
    id: "sequential",
    name: "顺序查找",
    description: "从表的一端开始，逐个元素与目标值比较，直到成功或扫描完整个表。",
    cases: [
      {
        name: "第一个元素成功",
        note: "最好情况：比较 1 次。",
        data: [11, 23, 35, 47, 59, 71, 83],
        target: 11,
      },
      {
        name: "中间元素成功",
        note: "目标位于表中部，需要连续推进。",
        data: [11, 23, 35, 47, 59, 71, 83],
        target: 47,
      },
      {
        name: "最后元素成功",
        note: "成功查找中的最坏情况。",
        data: [11, 23, 35, 47, 59, 71, 83],
        target: 83,
      },
      {
        name: "查找失败",
        note: "扫描完整张表后仍未找到。",
        data: [11, 23, 35, 47, 59, 71, 83],
        target: 65,
      },
    ],
    generateSteps: generateSequentialSteps,
  },
  {
    id: "binary",
    name: "折半查找",
    description: "在有序表中维护 low、high，每次比较 mid，按大小关系缩小一半范围。",
    cases: [
      {
        name: "第一次 mid 命中",
        note: "中间元素就是目标值。",
        data: [7, 15, 23, 31, 43, 55, 63, 77, 89],
        target: 43,
      },
      {
        name: "向左查找命中",
        note: "目标小于 mid，范围向左收缩。",
        data: [7, 15, 23, 31, 43, 55, 63, 77, 89],
        target: 15,
      },
      {
        name: "向右查找命中",
        note: "目标大于 mid，范围向右收缩。",
        data: [7, 15, 23, 31, 43, 55, 63, 77, 89],
        target: 77,
      },
      {
        name: "查找失败",
        note: "范围最终为空，目标不存在。",
        data: [7, 15, 23, 31, 43, 55, 63, 77, 89],
        target: 51,
      },
    ],
    generateSteps: generateBinarySteps,
  },
  {
    id: "block",
    name: "分块查找",
    description: "先在索引表中确定目标所在块，再在块内进行顺序查找。",
    cases: [
      {
        name: "定位块后成功",
        note: "索引定位到第二块，块内找到目标。",
        data: [11, 17, 23, 31, 37, 43, 51, 59, 65, 73, 81, 89],
        target: 51,
        blockSize: 4,
      },
      {
        name: "块内查找失败",
        note: "索引能定位块，但块内没有目标。",
        data: [11, 17, 23, 31, 37, 43, 51, 59, 65, 73, 81, 89],
        target: 47,
        blockSize: 4,
      },
      {
        name: "目标小于所有块",
        note: "目标小于第一块最大值，进入第一块后失败。",
        data: [11, 17, 23, 31, 37, 43, 51, 59, 65, 73, 81, 89],
        target: 9,
        blockSize: 4,
      },
      {
        name: "目标大于所有块",
        note: "扫描完整个索引表后仍无法定位。",
        data: [11, 17, 23, 31, 37, 43, 51, 59, 65, 73, 81, 89],
        target: 95,
        blockSize: 4,
      },
    ],
    generateSteps: generateBlockSteps,
  },
];

const extraDataSets = {
  sequential: [
    [{ label: "数据组 B · 偶数", data: [8, 16, 24, 32, 40, 48], target: 8 }],
    [{ label: "数据组 B · 偶数", data: [8, 16, 24, 32, 40, 48], target: 32 }],
    [{ label: "数据组 B · 偶数", data: [8, 16, 24, 32, 40, 48], target: 48 }],
    [{ label: "数据组 B · 偶数", data: [8, 16, 24, 32, 40, 48], target: 36 }],
  ],
  binary: [
    [{ label: "数据组 B · 偶数", data: [4, 12, 20, 28, 36, 44, 52, 60], target: 28 }],
    [{ label: "数据组 B · 偶数", data: [4, 12, 20, 28, 36, 44, 52, 60], target: 12 }],
    [{ label: "数据组 B · 偶数", data: [4, 12, 20, 28, 36, 44, 52, 60], target: 60 }],
    [{ label: "数据组 B · 偶数", data: [4, 12, 20, 28, 36, 44, 52, 60], target: 50 }],
  ],
  block: [
    [
      {
        label: "数据组 B · 偶数",
        data: [8, 14, 20, 26, 34, 42, 50, 58, 66, 72, 80],
        target: 50,
        blockSize: 4,
      },
    ],
    [
      {
        label: "数据组 B · 偶数",
        data: [8, 14, 20, 26, 34, 42, 50, 58, 66, 72, 80],
        target: 46,
        blockSize: 4,
      },
    ],
    [
      {
        label: "数据组 B · 偶数",
        data: [8, 14, 20, 26, 34, 42, 50, 58, 66, 72, 80],
        target: 6,
        blockSize: 4,
      },
    ],
    [
      {
        label: "数据组 B · 偶数",
        data: [8, 14, 20, 26, 34, 42, 50, 58, 66, 72, 80],
        target: 94,
        blockSize: 4,
      },
    ],
  ],
};

const state = {
  algorithmIndex: 0,
  caseIndex: 0,
  dataSetIndex: 0,
  stepIndex: 0,
  steps: [],
  autoTimer: null,
};

const els = {
  algorithmTabs: document.querySelector("#algorithmTabs"),
  caseList: document.querySelector("#caseList"),
  caseCount: document.querySelector("#caseCount"),
  dataSetList: document.querySelector("#dataSetList"),
  dataSetCount: document.querySelector("#dataSetCount"),
  algorithmDescription: document.querySelector("#algorithmDescription"),
  caseTitle: document.querySelector("#caseTitle"),
  targetValue: document.querySelector("#targetValue"),
  indexZone: document.querySelector("#indexZone"),
  arrayZone: document.querySelector("#arrayZone"),
  pointerZone: document.querySelector("#pointerZone"),
  statusBadge: document.querySelector("#statusBadge"),
  stepProgress: document.querySelector("#stepProgress"),
  compareCount: document.querySelector("#compareCount"),
  stepText: document.querySelector("#stepText"),
  historyList: document.querySelector("#historyList"),
  prevBtn: document.querySelector("#prevBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  autoBtn: document.querySelector("#autoBtn"),
};

function generateSequentialSteps(searchCase) {
  const steps = [
    {
      text: "准备从下标 0 开始顺序比较。",
      compareCount: 0,
      status: "ready",
      pointers: [{ label: "i", value: 0 }],
    },
  ];

  for (let i = 0; i < searchCase.data.length; i += 1) {
    const value = searchCase.data[i];
    const found = value === searchCase.target;
    steps.push({
      text: found
        ? `比较 a[${i}] = ${value}，与目标 ${searchCase.target} 相等，查找成功。`
        : `比较 a[${i}] = ${value}，与目标 ${searchCase.target} 不相等，继续向后。`,
      activeIndex: i,
      foundIndex: found ? i : null,
      missIndexes: found ? [] : [i],
      compareCount: i + 1,
      status: found ? "success" : "running",
      pointers: [{ label: "i", value: i }],
      done: found,
    });

    if (found) return steps;
  }

  steps.push({
    text: `所有 ${searchCase.data.length} 个元素都已比较，未找到 ${searchCase.target}，查找失败。`,
    compareCount: searchCase.data.length,
    status: "failure",
    done: true,
  });

  return steps;
}

function generateBinarySteps(searchCase) {
  const steps = [
    {
      text: "准备在有序表中进行折半查找。",
      compareCount: 0,
      range: [0, searchCase.data.length - 1],
      status: "ready",
      pointers: [
        { label: "low", value: 0 },
        { label: "high", value: searchCase.data.length - 1 },
      ],
    },
  ];

  let low = 0;
  let high = searchCase.data.length - 1;
  let compareCount = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = searchCase.data[mid];
    compareCount += 1;

    if (value === searchCase.target) {
      steps.push({
        text: `mid = ${mid}，a[${mid}] = ${value}，与目标相等，查找成功。`,
        activeIndex: mid,
        foundIndex: mid,
        compareCount,
        range: [low, high],
        status: "success",
        pointers: [
          { label: "low", value: low },
          { label: "mid", value: mid },
          { label: "high", value: high },
        ],
        done: true,
      });
      return steps;
    }

    const goLeft = searchCase.target < value;
    steps.push({
      text: goLeft
        ? `mid = ${mid}，a[${mid}] = ${value}，目标 ${searchCase.target} 更小，high 移到 mid - 1。`
        : `mid = ${mid}，a[${mid}] = ${value}，目标 ${searchCase.target} 更大，low 移到 mid + 1。`,
      activeIndex: mid,
      missIndexes: [mid],
      compareCount,
      range: [low, high],
      status: "running",
      pointers: [
        { label: "low", value: low },
        { label: "mid", value: mid },
        { label: "high", value: high },
      ],
    });

    if (goLeft) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  steps.push({
    text: `low = ${low}，high = ${high}，查找范围为空，${searchCase.target} 不在表中。`,
    compareCount,
    range: null,
    status: "failure",
    pointers: [
      { label: "low", value: low },
      { label: "high", value: high },
    ],
    done: true,
  });

  return steps;
}

function generateBlockSteps(searchCase) {
  const blockSize = searchCase.blockSize;
  const blocks = makeBlocks(searchCase.data, blockSize);
  const steps = [
    {
      text: "准备先扫描索引表，每个索引项保存该块最大关键字和块范围。",
      compareCount: 0,
      blocks,
      status: "ready",
    },
  ];

  let compareCount = 0;
  let selectedBlock = null;

  for (const block of blocks) {
    compareCount += 1;
    const canEnter = searchCase.target <= block.max;
    steps.push({
      text: canEnter
        ? `比较索引项：目标 ${searchCase.target} <= 块最大值 ${block.max}，进入第 ${block.id + 1} 块。`
        : `比较索引项：目标 ${searchCase.target} > 块最大值 ${block.max}，继续检查下一块。`,
      compareCount,
      blocks,
      activeBlock: block.id,
      rejectedBlocks: blocks.filter((item) => item.id < block.id).map((item) => item.id),
      selectedBlock: canEnter ? block.id : null,
      blockRange: canEnter ? [block.start, block.end] : null,
      status: "running",
    });

    if (canEnter) {
      selectedBlock = block;
      break;
    }
  }

  if (!selectedBlock) {
    steps.push({
      text: `索引表已扫描完，目标 ${searchCase.target} 大于所有块最大值，查找失败。`,
      compareCount,
      blocks,
      status: "failure",
      done: true,
    });
    return steps;
  }

  for (let i = selectedBlock.start; i <= selectedBlock.end; i += 1) {
    const value = searchCase.data[i];
    const found = value === searchCase.target;
    compareCount += 1;
    steps.push({
      text: found
        ? `在第 ${selectedBlock.id + 1} 块内比较 a[${i}] = ${value}，与目标相等，查找成功。`
        : `在第 ${selectedBlock.id + 1} 块内比较 a[${i}] = ${value}，不相等，继续块内顺序查找。`,
      compareCount,
      blocks,
      selectedBlock: selectedBlock.id,
      blockRange: [selectedBlock.start, selectedBlock.end],
      activeIndex: i,
      foundIndex: found ? i : null,
      missIndexes: found ? [] : [i],
      status: found ? "success" : "running",
      pointers: [{ label: "块内 i", value: i }],
      done: found,
    });

    if (found) return steps;
  }

  steps.push({
    text: `第 ${selectedBlock.id + 1} 块已全部比较，未找到 ${searchCase.target}，查找失败。`,
    compareCount,
    blocks,
    selectedBlock: selectedBlock.id,
    blockRange: [selectedBlock.start, selectedBlock.end],
    status: "failure",
    done: true,
  });

  return steps;
}

function makeBlocks(data, blockSize) {
  const blocks = [];
  for (let start = 0; start < data.length; start += blockSize) {
    const end = Math.min(start + blockSize - 1, data.length - 1);
    const values = data.slice(start, end + 1);
    blocks.push({
      id: blocks.length,
      start,
      end,
      max: Math.max(...values),
    });
  }
  return blocks;
}

function currentAlgorithm() {
  return algorithms[state.algorithmIndex];
}

function currentCase() {
  return currentAlgorithm().cases[state.caseIndex];
}

function currentDataSet() {
  return getDataSets(currentAlgorithm(), currentCase(), state.caseIndex)[state.dataSetIndex];
}

function getDataSets(algorithm, searchCase, caseIndex) {
  const baseDataSet = {
    label: "数据组 A · 奇数",
    data: searchCase.data,
    target: searchCase.target,
    blockSize: searchCase.blockSize,
  };
  return [baseDataSet, ...(extraDataSets[algorithm.id]?.[caseIndex] ?? [])];
}

function currentStep() {
  return state.steps[state.stepIndex];
}

function init() {
  renderAlgorithmTabs();
  bindControls();
  els.caseList.addEventListener("click", handleCaseClick);
  els.dataSetList.addEventListener("click", handleDataSetClick);
  loadCase(0, 0);
}

function renderAlgorithmTabs() {
  els.algorithmTabs.innerHTML = algorithms
    .map(
      (algorithm, index) =>
        `<button type="button" data-algorithm="${index}">${algorithm.name}</button>`,
    )
    .join("");

  els.algorithmTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-algorithm]");
    if (!button) return;
    loadCase(Number(button.dataset.algorithm), 0);
  });
}

function renderCaseList() {
  const algorithm = currentAlgorithm();
  els.caseCount.textContent = `${algorithm.cases.length} 种`;
  els.caseList.innerHTML = algorithm.cases
    .map(
      (searchCase, index) => `
        <button type="button" class="case-button" data-case="${index}">
          <strong>${searchCase.name}</strong>
          <span>${searchCase.note}</span>
        </button>
      `,
    )
    .join("");
}

function renderDataSetList() {
  const dataSets = getDataSets(currentAlgorithm(), currentCase(), state.caseIndex);
  els.dataSetCount.textContent = `${dataSets.length} 组`;
  els.dataSetList.innerHTML = dataSets
    .map(
      (dataSet, index) => `
        <button
          type="button"
          class="dataset-button"
          data-dataset="${index}"
          title="${dataSet.data.join("，")}"
        >
          <strong>${dataSet.label}</strong>
          <span>${dataSetSummary(dataSet)}</span>
          <em>目标 ${dataSet.target}</em>
        </button>
      `,
    )
    .join("");
}

function dataSetSummary(dataSet) {
  const first = dataSet.data[0];
  const last = dataSet.data[dataSet.data.length - 1];
  const blockText = dataSet.blockSize ? ` · 每块 ${dataSet.blockSize} 个` : "";
  return `${dataSet.data.length} 个元素 · ${first} 至 ${last}${blockText}`;
}

function handleCaseClick(event) {
  const button = event.target.closest("button[data-case]");
  if (!button) return;
  loadCase(state.algorithmIndex, Number(button.dataset.case));
}

function handleDataSetClick(event) {
  const button = event.target.closest("button[data-dataset]");
  if (!button) return;
  loadDataSet(Number(button.dataset.dataset));
}

function bindControls() {
  els.prevBtn.addEventListener("click", () => {
    stopAuto();
    if (state.stepIndex > 0) {
      state.stepIndex -= 1;
      renderWithTransition();
    }
  });

  els.nextBtn.addEventListener("click", () => {
    stepForward();
  });

  els.resetBtn.addEventListener("click", () => {
    stopAuto();
    state.stepIndex = 0;
    renderWithTransition();
  });

  els.autoBtn.addEventListener("click", () => {
    if (state.autoTimer) {
      stopAuto();
    } else {
      startAuto();
    }
  });
}

function loadCase(algorithmIndex, caseIndex) {
  stopAuto();
  state.algorithmIndex = algorithmIndex;
  state.caseIndex = caseIndex;
  state.dataSetIndex = defaultDataSetIndex(algorithmIndex, caseIndex);
  state.stepIndex = 0;
  state.steps = currentAlgorithm().generateSteps(currentDataSet());
  renderCaseList();
  renderDataSetList();
  renderWithTransition();
}

function loadDataSet(dataSetIndex) {
  stopAuto();
  state.dataSetIndex = dataSetIndex;
  state.stepIndex = 0;
  state.steps = currentAlgorithm().generateSteps(currentDataSet());
  renderWithTransition();
}

function defaultDataSetIndex(algorithmIndex, caseIndex) {
  const algorithm = algorithms[algorithmIndex];
  const searchCase = algorithm.cases[caseIndex];
  const dataSets = getDataSets(algorithm, searchCase, caseIndex);
  return dataSets.length > 1 ? 1 : 0;
}

function stepForward() {
  if (state.stepIndex < state.steps.length - 1) {
    state.stepIndex += 1;
    renderWithTransition();
  } else {
    stopAuto();
  }
}

function startAuto() {
  if (state.stepIndex >= state.steps.length - 1) {
    state.stepIndex = 0;
    renderWithTransition();
  }
  els.autoBtn.textContent = "暂停";
  state.autoTimer = window.setInterval(() => {
    if (state.stepIndex >= state.steps.length - 1) {
      stopAuto();
      return;
    }
    stepForward();
  }, 1200);
}

function stopAuto() {
  if (state.autoTimer) {
    window.clearInterval(state.autoTimer);
    state.autoTimer = null;
  }
  els.autoBtn.textContent = "自动播放";
}

function renderWithTransition() {
  if (!document.startViewTransition) {
    render();
    return;
  }
  document.startViewTransition(() => render());
}

function render() {
  const algorithm = currentAlgorithm();
  const searchCase = currentCase();
  const dataSet = currentDataSet();
  const step = currentStep();

  document.querySelectorAll("[data-algorithm]").forEach((button) => {
    button.classList.toggle(
      "active",
      Number(button.dataset.algorithm) === state.algorithmIndex,
    );
  });

  document.querySelectorAll("[data-case]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.case) === state.caseIndex);
  });

  document.querySelectorAll("[data-dataset]").forEach((button) => {
    button.classList.toggle(
      "active",
      Number(button.dataset.dataset) === state.dataSetIndex,
    );
  });

  els.algorithmDescription.textContent = algorithm.description;
  els.caseTitle.textContent = `${searchCase.name} · ${dataSet.label}`;
  els.targetValue.textContent = dataSet.target;

  renderIndexZone(step);
  renderArray(dataSet, step);
  renderPointers(step);
  renderExplanation(step);
  updateButtons();
}

function renderIndexZone(step) {
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

function renderArray(searchCase, step) {
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
                ${renderCellPointers(step, index, searchCase.data.length)}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSelectedBlockBand(blockRange) {
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

function renderCellPointers(step, index, dataLength) {
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
  return `${currentHtml}${renderPointerTrail(currentPointers, index, dataLength)}`;
}

function renderPointerTrail(currentPointers, index, dataLength) {
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
      const key = pointerKey(pointer.label);
      if (
        pointer.value === index &&
        pointer.value >= 0 &&
        pointer.value < dataLength &&
        !currentKeys.has(key) &&
        !trail.some((item) => item.key === key && item.index === index)
      ) {
        trail.push({ pointer, key, age: offset, index });
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

function renderPointers(step) {
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

function pointerClass(label) {
  if (label === "low") return "pointer-low";
  if (label === "mid") return "pointer-mid";
  if (label === "high") return "pointer-high";
  return "pointer-scan";
}

function pointerKey(label) {
  if (label === "low") return "low";
  if (label === "mid") return "mid";
  if (label === "high") return "high";
  return "scan";
}

function pointerShortLabel(label) {
  if (label === "low") return "low";
  if (label === "mid") return "mid";
  if (label === "high") return "high";
  return "i";
}

function pointerDisplayLabel(label) {
  if (label === "low") return "左指针 low";
  if (label === "mid") return "中间 mid";
  if (label === "high") return "右指针 high";
  if (label === "块内 i") return "块内指针 i";
  return "当前指针 i";
}

function renderExplanation(step) {
  const statusText = {
    ready: "准备开始",
    running: "查找中",
    success: "查找成功",
    failure: "查找失败",
  };

  els.statusBadge.className = `status-badge ${step.status === "success" ? "success" : ""} ${
    step.status === "failure" ? "failure" : ""
  }`;
  els.statusBadge.textContent = statusText[step.status] ?? "查找中";
  els.stepProgress.textContent = `${state.stepIndex} / ${state.steps.length - 1}`;
  els.compareCount.textContent = step.compareCount ?? 0;
  els.stepText.textContent = step.text;
  els.historyList.innerHTML = state.steps
    .slice(1, state.stepIndex + 1)
    .map((item) => `<li>${item.text}</li>`)
    .join("");
}

function updateButtons() {
  els.prevBtn.disabled = state.stepIndex === 0;
  els.nextBtn.disabled = state.stepIndex >= state.steps.length - 1;
}

init();
