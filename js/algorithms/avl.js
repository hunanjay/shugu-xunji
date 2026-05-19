export function generateAVLSteps(searchCase) {
  const target = searchCase.target;
  const steps = [];

  const tree = {
    level0: [
      { id: "node_root", key: 50, balanceFactor: 0, children: ["node_l1", "node_r1"] },
    ],
    level1: [
      { id: "node_l1", key: 30, balanceFactor: 0, children: ["node_ll2", "node_lr2"] },
      { id: "node_r1", key: 70, balanceFactor: 0, children: ["node_rl2", "node_rr2"] },
    ],
    level2: [
      { id: "node_ll2", key: 20, balanceFactor: 0, children: ["node_lll3", "node_llr3"] },
      { id: "node_lr2", key: 40, balanceFactor: 0, children: ["node_lrl3", "node_lrr3"] },
      { id: "node_rl2", key: 60, balanceFactor: 0, children: ["node_rll3", "node_rlr3"] },
      { id: "node_rr2", key: 80, balanceFactor: 0, children: ["node_rrl3", "node_rrr3"] },
    ],
    level3: [
      { id: "node_lll3", key: 10, balanceFactor: 0, children: [] },
      { id: "node_llr3", key: 25, balanceFactor: 0, children: [] },
      { id: "node_lrl3", key: 35, balanceFactor: 0, children: [] },
      { id: "node_lrr3", key: 45, balanceFactor: 0, children: [] },
      { id: "node_rll3", key: 55, balanceFactor: 0, children: [] },
      { id: "node_rlr3", key: 65, balanceFactor: 0, children: [] },
      { id: "node_rrl3", key: 75, balanceFactor: 0, children: [] },
      { id: "node_rrr3", key: 90, balanceFactor: 0, children: [] },
    ],
  };

  const getNode = (id) => {
    for (const lvl of Object.values(tree)) {
      const found = lvl.find((node) => node.id === id);
      if (found) return found;
    }
    return null;
  };

  steps.push({
    text: `准备在平衡二叉树中查找目标值 ${target}。从根节点 [50] 开始。`,
    compareCount: 0,
    status: "ready",
    tree,
    isAVL: true,
    activeNodeId: "node_root",
    path: ["node_root"],
  });

  let currentNodeId = "node_root";
  let compareCount = 0;
  const path = ["node_root"];

  while (currentNodeId) {
    const node = getNode(currentNodeId);
    if (!node) break;

    compareCount += 1;
    const bf = node.balanceFactor ?? 0;

    if (node.key === target) {
      steps.push({
        text: `当前节点 [${node.key}]，平衡因子 bf=${bf}。键值与目标值 ${target} 相等，命中！`,
        compareCount,
        status: "running",
        tree,
        isAVL: true,
        activeNodeId: currentNodeId,
        matched: true,
        path: [...path],
      });

      steps.push({
        text: `成功在平衡二叉树中找到目标值 ${target}，查找成功！`,
        compareCount,
        status: "success",
        tree,
        isAVL: true,
        activeNodeId: currentNodeId,
        matched: true,
        path: [...path],
        done: true,
      });
      return steps;
    }

    const goLeft = target < node.key;
    steps.push({
      text: `当前节点 [${node.key}]，平衡因子 bf=${bf}。目标值 ${target} ${goLeft ? "<" : ">"} ${node.key}，进入${goLeft ? "左" : "右"}子树。`,
      compareCount,
      status: "running",
      tree,
      isAVL: true,
      activeNodeId: currentNodeId,
      path: [...path],
    });

    const nextNodeId = goLeft ? node.children[0] : node.children[1];

    if (nextNodeId) {
      currentNodeId = nextNodeId;
      path.push(currentNodeId);
      const nextNode = getNode(currentNodeId);
      steps.push({
        text: `访问下一层节点 [${nextNode.key}]，继续比较。`,
        compareCount,
        status: "running",
        tree,
        isAVL: true,
        activeNodeId: currentNodeId,
        path: [...path],
      });
    } else {
      steps.push({
        text: `已到达空子树，未在平衡二叉树中找到目标值 ${target}。查找失败。`,
        compareCount,
        status: "failure",
        tree,
        isAVL: true,
        activeNodeId: currentNodeId,
        path: [...path],
        done: true,
      });
      return steps;
    }
  }

  return steps;
}
