export function generateBlockSteps(searchCase) {
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

export function makeBlocks(data, blockSize) {
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
