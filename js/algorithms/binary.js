export function generateBinarySteps(searchCase) {
  const steps = [
    {
      text: "准备开始折半查找。初始化 low 指向首元素，high 指向尾元素。",
      compareCount: 0,
      range: [0, searchCase.data.length - 1],
      status: "ready",
      pointers: [
        { label: "low", value: 0 },
        { label: "high", value: searchCase.data.length - 1 },
      ],
    },
  ];

  let low = 0;
  let high = searchCase.data.length - 1;
  let compareCount = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = searchCase.data[mid];
    compareCount += 1;

    if (value === searchCase.target) {
      steps.push({
        text: `mid = ${mid}，a[${mid}] = ${value}，与目标相等，查找成功。`,
        activeIndex: mid,
        foundIndex: mid,
        compareCount,
        range: [low, high],
        status: "success",
        pointers: [
          { label: "low", value: low },
          { label: "mid", value: mid },
          { label: "high", value: high },
        ],
        done: true,
      });
      return steps;
    }

    const goLeft = searchCase.target < value;
    steps.push({
      text: goLeft
        ? `mid = ${mid}，a[${mid}] = ${value}，目标 ${searchCase.target} 更小，high 移到 mid - 1。`
        : `mid = ${mid}，a[${mid}] = ${value}，目标 ${searchCase.target} 更大，low 移到 mid + 1。`,
      activeIndex: mid,
      missIndexes: [mid],
      compareCount,
      range: [low, high],
      status: "running",
      pointers: [
        { label: "low", value: low },
        { label: "mid", value: mid },
        { label: "high", value: high },
      ],
    });

    if (goLeft) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  steps.push({
    text: `low = ${low}，high = ${high}，查找范围为空，${searchCase.target} 不在表中。`,
    compareCount,
    range: null,
    status: "failure",
    pointers: [
      { label: "low", value: low },
      { label: "high", value: high },
    ],
    done: true,
  });

  return steps;
}
