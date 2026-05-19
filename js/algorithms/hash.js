function getTableSize(searchCase) {
  return searchCase.tableSize ?? 7;
}

function hashKey(value, tableSize) {
  return value % tableSize;
}

function createEmptyBuckets(tableSize) {
  return Array.from({ length: tableSize }, (_, bucketIndex) => ({
    index: bucketIndex,
    items: [],
  }));
}

function cloneBuckets(buckets) {
  return buckets.map((bucket) => ({
    index: bucket.index,
    items: bucket.items.map((item) => ({ ...item })),
  }));
}

function makeTableSnapshot(buckets) {
  return {
    size: buckets.length,
    buckets: cloneBuckets(buckets),
  };
}

function appendStep(steps, buckets, overrides) {
  steps.push({
    compareCount: overrides.compareCount ?? 0,
    status: overrides.status ?? "running",
    hashTable: makeTableSnapshot(buckets),
    activeBucketIndex: overrides.activeBucketIndex ?? null,
    activeItemId: overrides.activeItemId ?? null,
    foundItemId: overrides.foundItemId ?? null,
    removedItemId: overrides.removedItemId ?? null,
    insertedItemId: overrides.insertedItemId ?? null,
    operation: overrides.operation,
    operationLabel: overrides.operationLabel,
    hashValue: overrides.hashValue ?? null,
    text: overrides.text,
    done: overrides.done ?? false,
  });
}

function pushReadyStep(steps, buckets, searchCase) {
  const operationLabel = operationLabelForCase(searchCase);
  const tableSize = buckets.length;
  steps.push({
    text: `${operationLabel}：当前哈希表采用链地址法，哈希函数为 h(k)=k % ${tableSize}。`,
    compareCount: 0,
    status: "ready",
    hashTable: makeTableSnapshot(buckets),
    activeBucketIndex: null,
    operation: searchCase.operation,
    operationLabel,
    hashValue: null,
  });
}

function operationLabelForCase(searchCase) {
  if (searchCase.operation === "build") return "构建散列表";
  if (searchCase.operation === "delete") return "删除关键字";
  return "插入关键字";
}

function formatBucket(bucket) {
  if (!bucket.items.length) return "空";
  return bucket.items.map((item) => item.value).join(" → ");
}

export function generateHashSteps(searchCase) {
  const steps = [];
  const operation = searchCase.operation ?? "insert";
  const operationLabel = operationLabelForCase(searchCase);
  const tableSize = getTableSize(searchCase);
  const buckets = createEmptyBuckets(tableSize);
  let compareCount = 0;
  const sourceValues =
    operation === "build" ? [...searchCase.data] : [...(searchCase.data ?? [])];
  const targetValue = Number(searchCase.target);

  if (operation === "insert" || operation === "delete") {
    for (const value of sourceValues) {
      const item = { id: `seed-${value}`, value };
      buckets[hashKey(value, tableSize)].items.push(item);
    }
  }

  pushReadyStep(steps, buckets, searchCase);

  if (operation === "build") {
    const buildValues = [...sourceValues];
    buildValues.forEach((value, sequenceIndex) => {
      const bucketIndex = hashKey(value, tableSize);
      const item = { id: `build-${sequenceIndex}-${value}`, value };

      compareCount += 1;
      appendStep(steps, buckets, {
        compareCount,
        status: "running",
        text: `插入关键字 ${value}，计算哈希值 h(${value}) = ${value} % ${tableSize} = ${bucketIndex}。`,
        operation,
        operationLabel,
        activeBucketIndex: bucketIndex,
        hashValue: bucketIndex,
      });

      buckets[bucketIndex].items.push(item);

      appendStep(steps, buckets, {
        compareCount,
        status: "running",
        text: `关键字 ${value} 已放入 ${bucketIndex} 号桶，当前桶链为：${formatBucket(buckets[bucketIndex])}。`,
        operation,
        operationLabel,
        activeBucketIndex: bucketIndex,
        hashValue: bucketIndex,
        insertedItemId: item.id,
      });
    });

    steps.push({
      text: `散列表构建完成，共插入 ${buildValues.length} 个关键字。`,
      compareCount,
      status: "success",
      hashTable: makeTableSnapshot(buckets),
      activeBucketIndex: null,
      operation,
      operationLabel,
      hashValue: null,
      done: true,
    });
    return steps;
  }

  const bucketIndex = hashKey(targetValue, tableSize);
  const bucket = buckets[bucketIndex];

  compareCount += 1;
  appendStep(steps, buckets, {
    compareCount,
    status: "running",
    text: `对关键字 ${targetValue} 计算哈希值：h(${targetValue}) = ${targetValue} % ${tableSize} = ${bucketIndex}，定位到 ${bucketIndex} 号桶。`,
    operation,
    operationLabel,
    activeBucketIndex: bucketIndex,
    hashValue: bucketIndex,
  });

  if (operation === "insert") {
    const newItem = { id: `insert-${targetValue}`, value: targetValue };
    if (!bucket.items.length) {
      buckets[bucketIndex].items.push(newItem);
      appendStep(steps, buckets, {
        compareCount,
        status: "success",
        text: `${bucketIndex} 号桶当前为空，直接插入关键字 ${targetValue}。`,
        operation,
        operationLabel,
        activeBucketIndex: bucketIndex,
        hashValue: bucketIndex,
        insertedItemId: newItem.id,
        done: true,
      });
      return steps;
    }

    for (let i = 0; i < bucket.items.length; i += 1) {
      const item = bucket.items[i];
      compareCount += 1;
      appendStep(steps, buckets, {
        compareCount,
        status: "running",
        text: `桶内发生冲突，比较链表节点 ${item.value}，准备在链尾插入。`,
        operation,
        operationLabel,
        activeBucketIndex: bucketIndex,
        activeItemId: item.id,
        hashValue: bucketIndex,
      });
    }

    buckets[bucketIndex].items.push(newItem);
    appendStep(steps, buckets, {
      compareCount,
      status: "success",
      text: `关键字 ${targetValue} 插入成功，${bucketIndex} 号桶当前链为：${formatBucket(buckets[bucketIndex])}。`,
      operation,
      operationLabel,
      activeBucketIndex: bucketIndex,
      insertedItemId: newItem.id,
      hashValue: bucketIndex,
      done: true,
    });
    return steps;
  }

  let foundIndex = -1;
  for (let i = 0; i < bucket.items.length; i += 1) {
    const item = bucket.items[i];
    compareCount += 1;
    appendStep(steps, buckets, {
      compareCount,
      status: "running",
      text: `在 ${bucketIndex} 号桶中比较节点 ${item.value}。`,
      operation,
      operationLabel,
      activeBucketIndex: bucketIndex,
      activeItemId: item.id,
      hashValue: bucketIndex,
    });

    if (item.value === targetValue) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex >= 0) {
    const [removed] = buckets[bucketIndex].items.splice(foundIndex, 1);
    appendStep(steps, buckets, {
      compareCount,
      status: "success",
      text: `找到关键字 ${targetValue}，已从 ${bucketIndex} 号桶删除。删除后链为：${formatBucket(buckets[bucketIndex])}。`,
      operation,
      operationLabel,
      activeBucketIndex: bucketIndex,
      removedItemId: removed.id,
      hashValue: bucketIndex,
      done: true,
    });
    return steps;
  }

  appendStep(steps, buckets, {
    compareCount,
    status: "failure",
    text: `在 ${bucketIndex} 号桶中未找到关键字 ${targetValue}，删除失败。`,
    operation,
    operationLabel,
    activeBucketIndex: bucketIndex,
    hashValue: bucketIndex,
    done: true,
  });
  return steps;
}
