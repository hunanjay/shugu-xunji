export function renderHashTable(els, _searchCase, step) {
  const table = step.hashTable;
  const activeBucketIndex = step.activeBucketIndex;
  const activeItemId = step.activeItemId;
  const foundItemId = step.foundItemId;
  const removedItemId = step.removedItemId;
  const insertedItemId = step.insertedItemId;
  const operationLabel = step.operationLabel ?? "散列表";

  els.indexZone.innerHTML = `
    <div class="hash-summary">
      <span class="hash-chip">h(k) = k % ${table.size}</span>
      <span class="hash-chip">${operationLabel}</span>
      <span class="hash-chip">当前桶 ${activeBucketIndex !== null ? activeBucketIndex : "无"}</span>
    </div>
  `;

  els.arrayZone.innerHTML = `
    <div class="hash-table">
      ${table.buckets
        .map((bucket) => {
          const rowClasses = ["hash-row"];
          if (bucket.index === activeBucketIndex) rowClasses.push("active");

          return `
            <div class="${rowClasses.join(" ")}">
              <div class="hash-index">
                <strong>${bucket.index}</strong>
                <span>桶</span>
              </div>
              <div class="hash-chain">
                ${
                  bucket.items.length
                    ? bucket.items
                        .map((item, itemIndex) => {
                          const nodeClasses = ["hash-node"];
                          if (item.id === activeItemId) nodeClasses.push("active");
                          if (item.id === foundItemId) nodeClasses.push("found");
                          if (item.id === removedItemId) nodeClasses.push("removed");
                          if (item.id === insertedItemId) nodeClasses.push("inserted");

                          const arrow = itemIndex < bucket.items.length - 1 ? `<span class="hash-arrow">→</span>` : "";
                          return `
                            <div class="hash-chain-item">
                              <div class="${nodeClasses.join(" ")}">${item.value}</div>
                              ${arrow}
                            </div>
                          `;
                        })
                        .join("")
                    : `<div class="hash-empty">空桶</div>`
                }
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  els.pointerZone.innerHTML = `
    <div class="hash-status-card">
      <span>操作</span>
      <strong>${operationLabel}</strong>
      <small>${step.text}</small>
    </div>
  `;
}
