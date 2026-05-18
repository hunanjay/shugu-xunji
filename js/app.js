import { generateSequentialSteps } from "./algorithms/sequential.js";
import { generateBinarySteps } from "./algorithms/binary.js";
import { generateBlockSteps } from "./algorithms/block.js";
import { generateBTreeSteps } from "./algorithms/btree.js";
import { generateBPlusTreeSteps } from "./algorithms/bplustree.js";
import { generateRBTreeSteps } from "./algorithms/rbtree.js";

import { renderIndexZone, renderArray, renderPointers } from "./components/arrayVisualizer.js";
import { renderTree, drawTreeConnections } from "./components/treeVisualizer.js";

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
  themeToggle: document.querySelector("#themeToggle"),
};

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
  {
    id: "btree",
    name: "B树查找",
    description: "多路平衡查找树。在节点内有序键中查找，若命中则成功，否则沿对应子树指针向下查找。",
    cases: [
      {
        name: "根节点命中",
        note: "最好情况：根节点即命中目标。",
        data: [10, 20, 30, 40, 50, 60, 70],
        target: 40,
      },
      {
        name: "第一层子节点命中",
        note: "在第一层子节点中命中目标。",
        data: [10, 20, 30, 40, 50, 60, 70],
        target: 20,
      },
      {
        name: "第二层叶节点命中",
        note: "沿路径一直向下，在叶子节点命中目标。",
        data: [10, 20, 30, 40, 50, 60, 70],
        target: 50,
      },
      {
        name: "查找失败",
        note: "向下查找到叶子节点仍未找到目标。",
        data: [10, 20, 30, 40, 50, 60, 70],
        target: 35,
      },
    ],
    generateSteps: generateBTreeSteps,
  },
  {
    id: "bplustree",
    name: "B+树查找",
    description: "非叶节点仅作索引，数据全部存在叶子节点。查找必须直达叶子节点，叶节点间链表相连。",
    cases: [
      {
        name: "叶子节点命中",
        note: "通过索引最终在叶子节点命中目标。",
        data: [10, 20, 30, 40, 50, 60, 70, 80],
        target: 40,
      },
      {
        name: "右边界叶节点命中",
        note: "查找最大叶子节点元素。",
        data: [10, 20, 30, 40, 50, 60, 70, 80],
        target: 80,
      },
      {
        name: "查找失败",
        note: "到达叶子节点后发现目标不存在。",
        data: [10, 20, 30, 40, 50, 60, 70, 80],
        target: 45,
      },
      {
        name: "范围遍历 (扩展)",
        note: "在叶子节点命中后，通过叶子间链表向后遍历。",
        data: [10, 20, 30, 40, 50, 60, 70, 80],
        target: 30,
      },
    ],
    generateSteps: generateBPlusTreeSteps,
  },
  {
    id: "rbtree",
    name: "红黑树查找",
    description: "自平衡二叉查找树。按二分大小向下查找，兼顾查找效率与平衡维护。",
    cases: [
      {
        name: "根节点命中",
        note: "最好情况：在黑色根节点 [40] 命中。",
        data: [10, 20, 30, 40, 50, 60, 70],
        target: 40,
      },
      {
        name: "左侧红色节点命中",
        note: "在左子树的红色节点 [20] 命中。",
        data: [10, 20, 30, 40, 50, 60, 70],
        target: 20,
      },
      {
        name: "右侧红色节点命中",
        note: "在右子树的红色节点 [50] 命中。",
        data: [10, 20, 30, 40, 50, 60, 70],
        target: 50,
      },
      {
        name: "查找失败",
        note: "直至查找空节点仍未命中，查找失败。",
        data: [10, 20, 30, 40, 50, 60, 70],
        target: 45,
      },
    ],
    generateSteps: generateRBTreeSteps,
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
  initTheme();
  renderAlgorithmTabs();
  bindControls();
  els.caseList.addEventListener("click", handleCaseClick);
  els.dataSetList.addEventListener("click", handleDataSetClick);
  if (els.themeToggle) {
    els.themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
  loadCase(0, 0);
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
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

  if (step.tree) {
    els.indexZone.innerHTML = "";
    els.pointerZone.innerHTML = "";
    renderTree(els, dataSet, step, state, algorithms);
  } else {
    renderIndexZone(els, step);
    renderArray(els, dataSet, step, state);
    renderPointers(els, step);
  }

  renderExplanation(step);
  updateButtons();
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

window.addEventListener("resize", () => {
  if (state.steps[state.stepIndex] && state.steps[state.stepIndex].tree) {
    drawTreeConnections(state, algorithms);
  }
});

init();
