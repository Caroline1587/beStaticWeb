let lastTimestamp = Math.floor(Date.now() / 1000) % 1000; // 保留时间戳的后三位
let sequence = 0;

/**
 * 生成一个唯一的任务编号（四位数）
 * @returns {string} 生成的任务编号
 */
export function generateTaskNumber() {
  let currentTimestamp = Math.floor(Date.now() / 1000) % 1000; // 保留时间戳的后三位

  if (currentTimestamp === lastTimestamp) {
    // 同一秒内递增序列号
    sequence += 1;
    // 如果序列号超过10，等待下一秒
    if (sequence >= 10) {
      while (currentTimestamp === lastTimestamp) {
        // 等待时间戳变化
        currentTimestamp = Math.floor(Date.now() / 1000) % 1000;
      }
      sequence = 0; // 重置序列号
    }
  } else {
    // 时间戳变化，重置序列号
    sequence = 0;
    lastTimestamp = currentTimestamp;
  }

  // 生成任务编号：时间戳的后三位 + 序列号（1位）
  return `${String(currentTimestamp).slice(-3)}${String(sequence).padStart(1, '0')}`;
}
