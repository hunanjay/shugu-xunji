export function generateBPlusTreeSteps(searchCase) {
  const target = searchCase.target;
  const steps = [];

  const tree = {
    level0: [{ id: "node_root", keys: [40], children: ["node_l1", "node_r1"], isIndex: true }],
    level1: [
      { id: "node_l1", keys: [20, 30], children: ["node_leaf1", "node_leaf2", "node_leaf3"], isIndex: true },
      { id: "node_r1", keys: [60, 70], children: ["node_leaf4", "node_leaf5", "node_leaf6"], isIndex: true }
    ],
    level2: [
      { id: "node_leaf1", keys: [5, 10, 15], children: [], nextLeafId: "node_leaf2" },
      { id: "node_leaf2", keys: [20, 25], children: [], nextLeafId: "node_leaf3" },
      { id: "node_leaf3", keys: [30, 35], children: [], nextLeafId: "node_leaf4" },
      { id: "node_leaf4", keys: [40, 45, 50], children: [], nextLeafId: "node_leaf5" },
      { id: "node_leaf5", keys: [60, 65], children: [], nextLeafId: "node_leaf6" },
      { id: "node_leaf6", keys: [70, 75, 80], children: [], nextLeafId: null }
    ]
  };

  steps.push({
    text: `准备在 B+ 树中查找目标值 ${target}。在 B+ 树中，索引节点仅作路由，所有真实数据必须在叶子节点完成匹配。`,
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

    const isIndex = node.isIndex;

    if (isIndex) {
      let nextNodeId = null;
      for (let i = 0; i < node.keys.length; i++) {
        const key = node.keys[i];
        compareCount++;

        if (target < key) {
          steps.push({
            text: `索引项比较：目标值 ${target} < 索引值 ${key}。进入左侧子树分支。`,
            compareCount,
            status: "running",
            tree,
            activeNodeId: currentNodeId,
            activeKeyIndex: i,
            path: [...path]
          });
          nextNodeId = node.children[i];
          break;
        } else {
          if (i === node.keys.length - 1) {
            steps.push({
              text: `索引项比较：目标值 ${target} >= 索引值 ${key}。进入最右侧子树分支。`,
              compareCount,
              status: "running",
              tree,
              activeNodeId: currentNodeId,
              activeKeyIndex: i,
              path: [...path]
            });
            nextNodeId = node.children[i + 1];
          } else {
            steps.push({
              text: `索引项比较：目标值 ${target} >= 索引值 ${key}。继续在索引节点内往后匹配。`,
              compareCount,
              status: "running",
              tree,
              activeNodeId: currentNodeId,
              activeKeyIndex: i,
              path: [...path]
            });
          }
        }
      }

      currentNodeId = nextNodeId;
      path.push(currentNodeId);
      const nextNode = getNode(currentNodeId);
      steps.push({
        text: `访问下一层分支：${nextNode.isIndex ? "索引节点" : "数据叶节点"} [${nextNode.keys.join(", ")}]。`,
        compareCount,
        status: "running",
        tree,
        activeNodeId: currentNodeId,
        activeKeyIndex: null,
        path: [...path]
      });

    } else {
      let foundIndex = null;
      for (let i = 0; i < node.keys.length; i++) {
        const key = node.keys[i];
        compareCount++;

        if (key === target) {
          foundIndex = i;
          steps.push({
            text: `叶子节点内匹配：比较 a[${i}] = ${key} 等于目标值 ${target}，成功命中！`,
            compareCount,
            status: "running",
            tree,
            activeNodeId: currentNodeId,
            activeKeyIndex: i,
            matchedKeyIndex: i,
            path: [...path]
          });
          break;
        } else {
          steps.push({
            text: `叶子节点内匹配：比较 a[${i}] = ${key} 不等于目标值 ${target}。`,
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

      if (foundIndex !== null) {
        if (searchCase.name === "范围遍历 (扩展)") {
          steps.push({
            text: `由于找到了起始遍历值 ${target}，且 B+ 树的叶子节点全部通过链表指针横向连接，现在可以直接启动顺序遍历。`,
            compareCount,
            status: "running",
            tree,
            activeNodeId: currentNodeId,
            activeKeyIndex: foundIndex,
            matchedKeyIndex: foundIndex,
            path: [...path]
          });

          const nextLeafId = node.nextLeafId;
          if (nextLeafId) {
            const nextNode = getNode(nextLeafId);
            path.push(nextLeafId);
            steps.push({
              text: `沿着叶子链表指针直接跨节点访问兄弟叶子节点 [${nextNode.keys.join(", ")}] 完成范围查找！`,
              compareCount,
              status: "success",
              tree,
              activeNodeId: nextLeafId,
              activeKeyIndex: 0,
              matchedKeyIndex: null,
              path: [...path],
              done: true
            });
          }
          return steps;
        }

        steps.push({
          text: `成功在叶子节点中查找到目标值 ${target}，查找成功！`,
          compareCount,
          status: "success",
          tree,
          activeNodeId: currentNodeId,
          activeKeyIndex: foundIndex,
          matchedKeyIndex: foundIndex,
          path: [...path],
          done: true
        });
        return steps;
      }

      steps.push({
        text: `已检索完所有包含目标区间的叶子节点，未找到目标值 ${target}。查找失败。`,
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
