export function generateRBTreeSteps(searchCase) {
  const target = searchCase.target;
  const steps = [];

  const tree = {
    level0: [{ id: "node_root", key: 40, color: "black", children: ["node_l1", "node_r1"] }],
    level1: [
      { id: "node_l1", key: 20, color: "red", children: ["node_ll2", "node_lr2"] },
      { id: "node_r1", key: 60, color: "black", children: ["node_rl2", "node_rr2"] }
    ],
    level2: [
      { id: "node_ll2", key: 10, color: "black", children: [] },
      { id: "node_lr2", key: 30, color: "black", children: [] },
      { id: "node_rl2", key: 50, color: "red", children: [] },
      { id: "node_rr2", key: 70, color: "red", children: [] }
    ]
  };

  steps.push({
    text: `准备在红黑树中查找目标值 ${target}。从根节点 [40] 开始。`,
    compareCount: 0,
    status: "ready",
    tree,
    isRB: true,
    activeNodeId: "node_root",
    path: ["node_root"]
  });

  let currentNodeId = "node_root";
  let compareCount = 0;
  const path = ["node_root"];

  const getNode = (id) => {
    for (const lvl of Object.values(tree)) {
      const found = lvl.find(n => n.id === id);
      if (found) return found;
    }
    return null;
  };

  while (currentNodeId) {
    const node = getNode(currentNodeId);
    if (!node) break;

    compareCount++;
    const key = node.key;
    const colorCN = node.color === "red" ? "红色" : "黑色";

    if (key === target) {
      steps.push({
        text: `当前节点：${colorCN}节点 [${key}]。键值与目标值 ${target} 相等，命中！`,
        compareCount,
        status: "running",
        tree,
        isRB: true,
        activeNodeId: currentNodeId,
        matched: true,
        path: [...path]
      });

      steps.push({
        text: `成功在红黑树的${colorCN}节点中找到目标值 ${target}，查找成功！`,
        compareCount,
        status: "success",
        tree,
        isRB: true,
        activeNodeId: currentNodeId,
        matched: true,
        path: [...path],
        done: true
      });
      return steps;
    }

    const goLeft = target < key;
    steps.push({
      text: `当前节点：${colorCN}节点 [${key}]。目标值 ${target} ${goLeft ? "<" : ">"} 键值 ${key}，进入${goLeft ? "左" : "右"}子树。`,
      compareCount,
      status: "running",
      tree,
      isRB: true,
      activeNodeId: currentNodeId,
      path: [...path]
    });

    const nextNodeId = goLeft ? node.children[0] : node.children[1];

    if (nextNodeId) {
      currentNodeId = nextNodeId;
      path.push(currentNodeId);
      const nextNode = getNode(currentNodeId);
      const nextColorCN = nextNode.color === "red" ? "红色" : "黑色";
      steps.push({
        text: `访问下一层${nextColorCN}节点 [${nextNode.key}]。`,
        compareCount,
        status: "running",
        tree,
        isRB: true,
        activeNodeId: currentNodeId,
        path: [...path]
      });
    } else {
      steps.push({
        text: `已搜索到叶子空节点(NIL)，未在红黑树中找到目标值 ${target}。查找失败。`,
        compareCount,
        status: "failure",
        tree,
        isRB: true,
        activeNodeId: currentNodeId,
        path: [...path],
        done: true
      });
      return steps;
    }
  }
  return steps;
}
