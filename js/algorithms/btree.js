export function generateBTreeSteps(searchCase) {
  const target = searchCase.target;
  const steps = [];

  const tree = {
    level0: [{ id: "node_root", keys: [40], children: ["node_l1", "node_r1"] }],
    level1: [
      { id: "node_l1", keys: [15, 30], children: ["node_leaf1", "node_leaf2", "node_leaf3"] },
      { id: "node_r1", keys: [60, 75], children: ["node_leaf4", "node_leaf5", "node_leaf6"] }
    ],
    level2: [
      { id: "node_leaf1", keys: [5, 10], children: [] },
      { id: "node_leaf2", keys: [20, 25], children: [] },
      { id: "node_leaf3", keys: [35], children: [] },
      { id: "node_leaf4", keys: [45, 50], children: [] },
      { id: "node_leaf5", keys: [65, 70], children: [] },
      { id: "node_leaf6", keys: [80, 85], children: [] }
    ]
  };

  steps.push({
    text: `准备在 B 树中查找目标值 ${target}。从根节点开始比较。`,
    compareCount: 0,
    status: "ready",
    tree,
    activeNodeId: "node_root",
    activeKeyIndex: null,
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

    let nextNodeId = null;
    let foundInNode = false;

    for (let i = 0; i < node.keys.length; i++) {
      const key = node.keys[i];
      compareCount++;

      if (key === target) {
        steps.push({
          text: `在当前节点中进行比较：a[${i}] = ${key} 等于目标值 ${target}。`,
          compareCount,
          status: "running",
          tree,
          activeNodeId: currentNodeId,
          activeKeyIndex: i,
          matchedKeyIndex: i,
          path: [...path]
        });

        steps.push({
          text: `成功在节点内命中目标值 ${target}，查找成功！`,
          compareCount,
          status: "success",
          tree,
          activeNodeId: currentNodeId,
          activeKeyIndex: i,
          matchedKeyIndex: i,
          path: [...path],
          done: true
        });
        foundInNode = true;
        break;
      }

      if (target < key) {
        steps.push({
          text: `在当前节点中比较：目标值 ${target} < 键值 ${key}。选择左侧子树指针向下。`,
          compareCount,
          status: "running",
          tree,
          activeNodeId: currentNodeId,
          activeKeyIndex: i,
          rejectedKeyIndexes: [i],
          path: [...path]
        });
        nextNodeId = node.children[i];
        break;
      } else {
        if (i === node.keys.length - 1) {
          steps.push({
            text: `在当前节点中比较：目标值 ${target} > 键值 ${key}。由于是该节点中最后一个键，选择最右侧指针向下。`,
            compareCount,
            status: "running",
            tree,
            activeNodeId: currentNodeId,
            activeKeyIndex: i,
            rejectedKeyIndexes: [i],
            path: [...path]
          });
          nextNodeId = node.children[i + 1];
        } else {
          steps.push({
            text: `在当前节点中比较：目标值 ${target} > 键值 ${key}。继续在节点内部后移查找。`,
            compareCount,
            status: "running",
            tree,
            activeNodeId: currentNodeId,
            activeKeyIndex: i,
            rejectedKeyIndexes: [i],
            path: [...path]
          });
        }
      }
    }

    if (foundInNode) return steps;

    if (nextNodeId && nextNodeId.length > 0) {
      currentNodeId = nextNodeId;
      path.push(currentNodeId);
      const nextNode = getNode(currentNodeId);
      steps.push({
        text: `访问下一层子树节点 [${nextNode ? nextNode.keys.join(", ") : ""}]。`,
        compareCount,
        status: "running",
        tree,
        activeNodeId: currentNodeId,
        activeKeyIndex: null,
        path: [...path]
      });
    } else {
      steps.push({
        text: `已搜索到叶子节点，未找到目标值 ${target}，查找失败。`,
        compareCount,
        status: "failure",
        tree,
        activeNodeId: currentNodeId,
        activeKeyIndex: null,
        path: [...path],
        done: true
      });
      return steps;
    }
  }
  return steps;
}
