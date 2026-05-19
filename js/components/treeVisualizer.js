export function renderTree(els, dataSet, step, state, algorithms) {
  const tree = step.tree;
  const activeNodeId = step.activeNodeId;
  const activeKeyIndex = step.activeKeyIndex;
  const matchedKeyIndex = step.matchedKeyIndex;
  const rejectedKeyIndexes = step.rejectedKeyIndexes ?? [];
  const path = step.path ?? [];
  const levelKeys = Object.keys(tree).sort((a, b) => {
    const aNum = Number.parseInt(a.replace(/\D/g, ""), 10);
    const bNum = Number.parseInt(b.replace(/\D/g, ""), 10);
    return aNum - bNum;
  });

  let html = `<div class="tree-container">`;
  html += `<svg class="tree-connections-svg"></svg>`;

  for (const [levelIndex, levelKey] of levelKeys.entries()) {
    const levelNodes = tree[levelKey];
    const levelGap = levelIndex === 0 ? 0 : levelIndex === 1 ? 200 : levelIndex === 2 ? 24 : 28;
    html += `<div class="tree-level ${levelKey}" style="gap: ${levelGap}px">`;

    for (const node of levelNodes) {
      const isActive = node.id === activeNodeId;
      const isPath = path.includes(node.id);

      if (step.isRB) {
        const nodeClasses = ["rb-node", node.color];
        if (isActive) nodeClasses.push("active");
        if (isPath && !isActive) nodeClasses.push("in-path");
        if (node.id === activeNodeId && step.matched) {
          nodeClasses.push("found");
        }

        html += `
          <div class="${nodeClasses.join(" ")}" id="${node.id}" data-parent-ids="${node.children ? node.children.join(",") : ""}">
            <span class="rb-node-val">${node.key}</span>
          </div>
        `;
      } else if (step.isAVL) {
        const nodeClasses = ["tree-node", "avl-node"];
        if (isActive) nodeClasses.push("active");
        if (isPath && !isActive) nodeClasses.push("in-path");
        if (node.id === activeNodeId && matchedKeyIndex !== null && matchedKeyIndex !== undefined) {
          nodeClasses.push("found");
        }

        html += `
          <div class="${nodeClasses.join(" ")}" id="${node.id}" data-parent-ids="${node.children ? node.children.join(",") : ""}">
            <span class="avl-node-key">${node.key}</span>
            <span class="avl-node-bf">bf ${node.balanceFactor ?? 0}</span>
          </div>
        `;
      } else {
        const nodeClasses = ["tree-node"];
        if (isActive) nodeClasses.push("active");
        if (isPath && !isActive) nodeClasses.push("in-path");

        if (node.id === activeNodeId && matchedKeyIndex !== null && matchedKeyIndex !== undefined) {
          nodeClasses.push("found");
        }

        html += `
          <div class="${nodeClasses.join(" ")}" id="${node.id}" data-parent-ids="${node.children ? node.children.join(",") : ""}">
            <div class="node-keys">
        `;

        node.keys.forEach((key, idx) => {
          const cellClasses = ["node-key-cell"];
          if (isActive && idx === activeKeyIndex) {
            if (matchedKeyIndex === idx) {
              cellClasses.push("matched");
            } else if (rejectedKeyIndexes.includes(idx)) {
              cellClasses.push("rejected");
            } else {
              cellClasses.push("comparing");
            }
          } else if (isPath && node.id === activeNodeId && matchedKeyIndex === idx) {
            cellClasses.push("matched");
          }

          html += `<span class="${cellClasses.join(" ")}">${key}</span>`;
        });

        html += `
            </div>
          </div>
        `;
      }
    }

    html += `</div>`;
  }

  html += `</div>`;
  els.arrayZone.innerHTML = html;

  setTimeout(() => drawTreeConnections(state, algorithms), 50);
}

export function drawTreeConnections(state, algorithms) {
  const svg = document.querySelector(".tree-connections-svg");
  const container = document.querySelector(".tree-container");
  if (!svg || !container) return;

  svg.innerHTML = "";
  const containerRect = container.getBoundingClientRect();

  const nodes = document.querySelectorAll(".tree-node, .rb-node");
  nodes.forEach(parentNodeEl => {
    const parentId = parentNodeEl.id;
    const childrenAttr = parentNodeEl.getAttribute("data-parent-ids");
    if (!childrenAttr) return;
    const childIds = childrenAttr.split(",").filter(Boolean);

    childIds.forEach((childId) => {
      const childNodeEl = document.getElementById(childId);
      if (!childNodeEl) return;

      const parentRect = parentNodeEl.getBoundingClientRect();
      const childRect = childNodeEl.getBoundingClientRect();

      const x1 = parentRect.left + parentRect.width / 2 - containerRect.left;
      const y1 = parentRect.bottom - containerRect.top;
      const x2 = childRect.left + childRect.width / 2 - containerRect.left;
      const y2 = childRect.top - containerRect.top;

      const controlDist = Math.abs(y2 - y1) * 0.5;
      const d = `M ${x1} ${y1} C ${x1} ${y1 + controlDist}, ${x2} ${y2 - controlDist}, ${x2} ${y2}`;

      const activeStep = state.steps[state.stepIndex];
      const activePath = activeStep ? (activeStep.path ?? []) : [];
      const parentInPath = activePath.includes(parentId);
      const childInPath = activePath.includes(childId);

      const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("d", d);
      pathEl.setAttribute("fill", "none");

      if (parentInPath && childInPath) {
        pathEl.setAttribute("stroke", "var(--blue)");
        pathEl.setAttribute("stroke-width", "3");
        pathEl.setAttribute("class", "connection-line active");
      } else {
        pathEl.setAttribute("stroke", "var(--line)");
        pathEl.setAttribute("stroke-width", "1.5");
        pathEl.setAttribute("class", "connection-line");
      }

      svg.appendChild(pathEl);
    });
  });

  const algorithm = algorithms[state.algorithmIndex];
  if (algorithm && (algorithm.id === "bplustree")) {
    const leafNodes = ["node_leaf1", "node_leaf2", "node_leaf3", "node_leaf4"];
    for (let i = 0; i < leafNodes.length - 1; i++) {
      const currentLeafEl = document.getElementById(leafNodes[i]);
      const nextLeafEl = document.getElementById(leafNodes[i+1]);
      if (!currentLeafEl || !nextLeafEl) continue;

      const currentRect = currentLeafEl.getBoundingClientRect();
      const nextRect = nextLeafEl.getBoundingClientRect();

      const x1 = currentRect.right - containerRect.left;
      const y1 = currentRect.top + currentRect.height / 2 - containerRect.top;
      const x2 = nextRect.left - containerRect.left;
      const y2 = nextRect.top + nextRect.height / 2 - containerRect.top;

      const d = `M ${x1} ${y1} Q ${(x1+x2)/2} ${y1 - 12}, ${x2} ${y2}`;
      const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("d", d);
      pathEl.setAttribute("stroke", "var(--amber)");
      pathEl.setAttribute("stroke-width", "1.8");
      pathEl.setAttribute("fill", "none");
      pathEl.setAttribute("class", "leaf-connection");
      svg.appendChild(pathEl);
    }
  }
}
