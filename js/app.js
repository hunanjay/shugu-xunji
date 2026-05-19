import { generateSequentialSteps } from "./algorithms/sequential.js?v=5";
import { generateBinarySteps } from "./algorithms/binary.js?v=5";
import { generateBlockSteps } from "./algorithms/block.js?v=5";
import { generateBTreeSteps } from "./algorithms/btree.js?v=5";
import { generateBPlusTreeSteps } from "./algorithms/bplustree.js?v=5";
import { generateAVLSteps } from "./algorithms/avl.js?v=5";
import { generateHashSteps } from "./algorithms/hash.js?v=5";
import { generateRBTreeSteps } from "./algorithms/rbtree.js?v=5";

import { renderIndexZone, renderArray, renderPointers } from "./components/arrayVisualizer.js?v=5";
import { renderHashTable } from "./components/hashVisualizer.js?v=5";
import { renderTree, drawTreeConnections } from "./components/treeVisualizer.js?v=5";

const state = {
  algorithmIndex: 0,
  caseIndex: 0,
  dataSetIndex: 0,
  stepIndex: 0,
  steps: [],
  autoTimer: null,
  sceneMarks: [],
  seenSceneKeys: new Set(),
  customTarget: null,
};

const els = {
  algorithmTabs: document.querySelector("#algorithmTabs"),
  caseList: document.querySelector("#caseList"),
  caseCount: document.querySelector("#caseCount"),
  dataSetList: document.querySelector("#dataSetList"),
  dataSetCount: document.querySelector("#dataSetCount"),
  algorithmDescription: document.querySelector("#algorithmDescription"),
  caseTitle: document.querySelector("#caseTitle"),
  targetLabel: document.querySelector("#targetLabel"),
  targetValue: document.querySelector("#targetValue"),
  indexZone: document.querySelector("#indexZone"),
  arrayZone: document.querySelector("#arrayZone"),
  pointerZone: document.querySelector("#pointerZone"),
  sceneFloatLayer: document.querySelector("#sceneFloatLayer"),
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
  customTargetInput: document.querySelector("#customTargetInput"),
  applyCustomTargetBtn: document.querySelector("#applyCustomTargetBtn"),
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
        data: [11, 19, 23, 31, 35, 41, 47, 53, 59, 67, 71, 83],
        target: 11,
      },
      {
        name: "中间元素成功",
        note: "目标位于表中部，需要连续推进。",
        data: [11, 19, 23, 31, 35, 41, 47, 53, 59, 67, 71, 83],
        target: 47,
      },
      {
        name: "最后元素成功",
        note: "成功查找中的最坏情况。",
        data: [11, 19, 23, 31, 35, 41, 47, 53, 59, 67, 71, 83],
        target: 83,
      },
      {
        name: "查找失败",
        note: "扫描完整张表后仍未找到。",
        data: [11, 19, 23, 31, 35, 41, 47, 53, 59, 67, 71, 83],
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
        data: [5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61],
        target: 29,
      },
      {
        name: "向左查找命中",
        note: "目标小于 mid，范围向左收缩。",
        data: [5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61],
        target: 9,
      },
      {
        name: "向右查找命中",
        note: "目标大于 mid，范围向右收缩。",
        data: [5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61],
        target: 57,
      },
      {
        name: "查找失败",
        note: "范围最终为空，目标不存在。",
        data: [5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61],
        target: 52,
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
        note: "索引定位到第二块，块内顺序找到目标 26。",
        data: [9, 22, 12, 14, 35, 42, 26, 30, 64, 55, 48, 60],
        target: 26,
        blockSize: 4,
        label: "经典数据组",
      },
      {
        name: "块内查找失败",
        note: "索引定位到第二块，但在该块内没有找到目标 28。",
        data: [9, 22, 12, 14, 35, 42, 26, 30, 64, 55, 48, 60],
        target: 28,
        blockSize: 4,
        label: "经典数据组",
      },
      {
        name: "目标小于所有块",
        note: "目标小于第一块最大值，进入第一块后失败。",
        data: [9, 22, 12, 14, 35, 42, 26, 30, 64, 55, 48, 60],
        target: 5,
        blockSize: 4,
        label: "经典数据组",
      },
      {
        name: "目标大于所有块",
        note: "扫描完整个索引表，目标 85 大于所有最大值，直接失败。",
        data: [9, 22, 12, 14, 35, 42, 26, 30, 64, 55, 48, 60],
        target: 85,
        blockSize: 4,
        label: "经典数据组",
      },
    ],
    generateSteps: generateBlockSteps,
  },
  {
    id: "btree",
    name: "B树查找",
    description: "多路平衡查找树。每个节点可含有多个关键字（多路分支），并在节点内进行有序键查找，若命中则成功，否则选择对应子树指针向下查找。",
    cases: [
      {
        name: "根节点命中",
        note: "最好情况：根节点即命中目标 40。",
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 85],
        target: 40,
      },
      {
        name: "第一层子节点命中",
        note: "进入左子树节点 [15, 30]，并在节点内部匹配到键值 30。",
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 85],
        target: 30,
      },
      {
        name: "第二层叶节点命中",
        note: "向下导航直达叶子节点 [20, 25]，并在叶节点内命中目标 25。",
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 85],
        target: 25,
      },
      {
        name: "查找失败",
        note: "向下查找到叶子节点 [20, 25] 仍未匹配到目标值 22，查找失败。",
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 85],
        target: 22,
      },
    ],
    generateSteps: generateBTreeSteps,
  },
  {
    id: "bplustree",
    name: "B+树查找",
    description: "非叶节点仅作索引，数据全部存在叶子节点。查找必须直达叶子节点，叶节点间用链表相连，适合范围查询。",
    cases: [
      {
        name: "叶子节点命中",
        note: "经索引节点 [40] 和 [20, 30] 路由，在叶子节点 [20, 25] 中查找到目标 25。",
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80],
        target: 25,
      },
      {
        name: "右边界叶节点命中",
        note: "定位到最右侧的叶子数据节点 [70, 75, 80] 并查找到最大值 80。",
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80],
        target: 80,
      },
      {
        name: "查找失败",
        note: "定位到叶子节点 [40, 45, 50]，遍历后发现不存在目标值 48，失败。",
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80],
        target: 48,
      },
      {
        name: "范围遍历 (扩展)",
        note: "在叶子节点 [30, 35] 命中 30 后，顺着叶子节点链表横向直接跨节点遍历后续元素。",
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80],
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
        note: "最好情况：在黑色根节点 [26] 命中。",
        data: [7, 14, 18, 26, 39, 45, 50],
        target: 26,
        label: "经典插入数据组",
      },
      {
        name: "左侧红色节点命中",
        note: "在左子树的红色节点 [14] 命中。",
        data: [7, 14, 18, 26, 39, 45, 50],
        target: 14,
        label: "经典插入数据组",
      },
      {
        name: "右侧红色节点命中",
        note: "在右子树的红色节点 [50] 命中。",
        data: [7, 14, 18, 26, 39, 45, 50],
        target: 50,
        label: "经典插入数据组",
      },
      {
        name: "查找失败",
        note: "直至查找空节点仍未命中，查找失败。",
        data: [7, 14, 18, 26, 39, 45, 50],
        target: 20,
        label: "经典插入数据组",
      },
    ],
    generateSteps: generateRBTreeSteps,
  },
  {
    id: "avl",
    name: "平衡二叉树",
    description: "AVL 平衡二叉查找树。按 BST 规则比较关键字，并保持左右子树高度差不超过 1。",
    cases: [
      {
        name: "根节点命中",
        note: "从根节点直接找到目标值。",
        data: [10, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90],
        target: 50,
      },
      {
        name: "左子树命中",
        note: "目标值位于左侧平衡子树中。",
        data: [10, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90],
        target: 25,
      },
      {
        name: "右下层命中",
        note: "继续下探到叶子节点后命中。",
        data: [10, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90],
        target: 90,
      },
      {
        name: "查找失败",
        note: "在空子树处结束查找。",
        data: [10, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90],
        target: 68,
      },
    ],
    generateSteps: generateAVLSteps,
  },
  {
    id: "hash",
    name: "散列表",
    description: "采用链地址法的散列表，演示插入、构建和删除时如何定位桶并处理冲突链。",
    cases: [
      {
        name: "插入关键字",
        note: "先定位桶，再在冲突链尾追加新元素。",
        data: [8, 17, 26, 35, 44, 53],
        target: 62,
        targetLabel: "插入值",
        operation: "insert",
        tableSize: 9,
      },
      {
        name: "构建散列表",
        note: "从空表开始，按序列逐个插入形成哈希表。",
        data: [1, 10, 19, 2, 11, 20, 3, 12, 21],
        target: "逐个插入",
        targetLabel: "构建序列",
        operation: "build",
        tableSize: 9,
      },
      {
        name: "删除关键字",
        note: "定位桶并从冲突链中移除目标节点。",
        data: [4, 13, 22, 5, 14, 23, 6, 15, 24],
        target: 23,
        targetLabel: "删除值",
        operation: "delete",
        tableSize: 9,
      },
    ],
    generateSteps: generateHashSteps,
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
    label: searchCase.label ?? "数据组 A · 奇数",
    data: searchCase.data,
    target: state.customTarget !== null ? state.customTarget : searchCase.target,
    blockSize: searchCase.blockSize,
    tableSize: searchCase.tableSize,
    operation: searchCase.operation,
  };
  const sets = [baseDataSet, ...(extraDataSets[algorithm.id]?.[caseIndex] ?? [])];
  if (state.customTarget !== null && sets[state.dataSetIndex]) {
    sets[state.dataSetIndex] = {
      ...sets[state.dataSetIndex],
      target: state.customTarget,
    };
  }
  return sets;
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
        `<button type="button" data-algorithm="${index}">
          <span class="algorithm-tab-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="6" cy="6" r="2.2"></circle>
              <circle cx="18" cy="6" r="2.2"></circle>
              <circle cx="12" cy="18" r="2.2"></circle>
              <path d="M7.6 7.6 10.5 15"></path>
              <path d="M16.4 7.6 13.5 15"></path>
              <path d="M8.1 6h7.8"></path>
            </svg>
          </span>
          <span class="algorithm-tab-label">${algorithm.name}</span>
        </button>`,
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
  const tableText = dataSet.tableSize ? ` · ${dataSet.tableSize} 桶` : "";
  return `${dataSet.data.length} 个元素 · ${first} 至 ${last}${blockText}${tableText}`;
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

  if (els.applyCustomTargetBtn && els.customTargetInput) {
    els.applyCustomTargetBtn.addEventListener("click", () => {
      applyCustomTarget();
    });

    els.customTargetInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        applyCustomTarget();
      }
    });
  }
}

function applyCustomTarget() {
  const valueStr = els.customTargetInput.value.trim();
  if (!valueStr) return;

  const num = Number(valueStr);
  if (isNaN(num)) {
    alert("请输入有效的数字！");
    return;
  }

  state.customTarget = num;

  stopAuto();
  state.stepIndex = 0;
  state.sceneMarks = [];
  state.seenSceneKeys = new Set();
  state.steps = currentAlgorithm().generateSteps(currentDataSet());
  els.customTargetInput.value = "";
  renderWithTransition();
}

function loadCase(algorithmIndex, caseIndex) {
  stopAuto();
  state.algorithmIndex = algorithmIndex;
  state.caseIndex = caseIndex;
  state.dataSetIndex = defaultDataSetIndex(algorithmIndex, caseIndex);
  state.stepIndex = 0;
  state.sceneMarks = [];
  state.seenSceneKeys = new Set();
  state.customTarget = null;
  state.steps = currentAlgorithm().generateSteps(currentDataSet());
  renderCaseList();
  renderDataSetList();
  renderWithTransition();
}

function loadDataSet(dataSetIndex) {
  stopAuto();
  state.dataSetIndex = dataSetIndex;
  state.stepIndex = 0;
  state.sceneMarks = [];
  state.seenSceneKeys = new Set();
  state.customTarget = null;
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
  els.targetLabel.textContent = searchCase.targetLabel ?? "目标值";
  els.targetValue.textContent = dataSet.target;

  const isHashBuild = algorithm.id === "hash" && searchCase.operation === "build";
  const customTargetWrapper = document.querySelector(".custom-target-input-wrapper");
  if (customTargetWrapper) {
    customTargetWrapper.style.display = isHashBuild ? "none" : "flex";
  }

  if (step.tree) {
    els.indexZone.innerHTML = "";
    els.pointerZone.innerHTML = "";
    renderTree(els, dataSet, step, state, algorithms);
  } else if (step.hashTable) {
    renderHashTable(els, dataSet, step, state);
  } else {
    renderIndexZone(els, step);
    renderArray(els, dataSet, step, state);
    renderPointers(els, step);
  }

  renderExplanation(step);
  updateButtons();
}

function renderExplanation(step) {
  const isHashTable = Boolean(step.hashTable);
  const statusText = isHashTable
    ? {
        ready: "准备开始",
        running: "处理中",
        success: "操作成功",
        failure: "操作失败",
      }
    : {
        ready: "准备开始",
        running: "查找中",
        success: "查找成功",
        failure: "查找失败",
      };
  const scene = selectScene(step, currentAlgorithm(), currentCase());
  maybeAddSceneMark(scene, step);

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

function maybeAddSceneMark(scene, step) {
  if (!scene) {
    state.sceneMarks = [];
    renderSceneMarks();
    return;
  }

  const sceneKey = `${state.algorithmIndex}-${state.caseIndex}-${state.dataSetIndex}-${state.stepIndex}-${scene.key}`;
  const alreadyHasMark = state.sceneMarks.some((mark) => mark.sceneKey === sceneKey);
  if (alreadyHasMark) return;

  state.sceneMarks = [];

  const mark = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sceneKey,
    scene,
    stepIndex: state.stepIndex,
    left: 86,
    top: 14,
    size: 110,
    rotate: -4 + Math.random() * 8,
    delay: step.status === "running" ? 0 : 0.05,
  };
  state.sceneMarks.push(mark);
  renderSceneMarks();
}

function renderSceneMarks() {
  if (!els.sceneFloatLayer) return;
  els.sceneFloatLayer.innerHTML = state.sceneMarks
    .map(
      (mark) => `
        <figure
          class="scene-mark scene-${mark.scene.key}"
          style="left: ${mark.left}%; top: ${mark.top}%; width: ${mark.size}px; --scene-rotate: ${mark.rotate}deg; animation-delay: ${mark.delay}s;"
        >
          <img src="${mark.scene.src}" alt="${mark.scene.title}" />
        </figure>
      `,
    )
    .join("");
}

function selectScene(step, algorithm, searchCase) {
  if (step.status === "failure") {
    return {
      key: "failure",
      src: "./assets/scenes/耄耋被雷劈.gif",
      title: "晴天霹雳！",
    };
  }

  if (step.status === "success") {
    return {
      key: "touch",
      src: "./assets/scenes/摸头.gif",
      title: "摸头",
    };
  }

  if (step.status === "ready") {
    return {
      key: "surprise",
      src: "./assets/scenes/难道说.jpg",
      title: "难道说？",
    };
  }

  return null;
}

window.addEventListener("resize", () => {
  if (state.steps[state.stepIndex] && state.steps[state.stepIndex].tree) {
    drawTreeConnections(state, algorithms);
  }
});

init();
