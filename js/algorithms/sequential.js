export function generateSequentialSteps(searchCase) {
  const steps = [
    {
      text: "准备从下标 0 开始顺序比较。",
      compareCount: 0,
      status: "ready",
      pointers: [{ label: "i", value: 0 }],
    },
  ];

  for (let i = 0; i < searchCase.data.length; i += 1) {
    const value = searchCase.data[i];
    const found = value === searchCase.target;
    steps.push({
      text: found
        ? `比较 a[${i}] = ${value}，与目标 ${searchCase.target} 相等，查找成功。`
        : `比较 a[${i}] = ${value}，与目标 ${searchCase.target} 不相等，继续向后。`,
      activeIndex: i,
      foundIndex: found ? i : null,
      missIndexes: found ? [] : [i],
      compareCount: i + 1,
      status: found ? "success" : "running",
      pointers: [{ label: "i", value: i }],
      done: found,
    });

    if (found) return steps;
  }

  steps.push({
    text: `已扫描完整个表，未找到目标值 ${searchCase.target}，查找失败。`,
    compareCount: searchCase.data.length,
    status: "failure",
    pointers: [{ label: "i", value: searchCase.data.length }],
    done: true,
  });

  return steps;
}
