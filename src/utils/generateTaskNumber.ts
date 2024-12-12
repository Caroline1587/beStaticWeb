let lastTimestamp = Math.floor(Date.now() / 1000);
let sequence = 0;

/**
 * 生成一个唯一的任务编号
 * 采用时间戳 + 序列号的方式
 * @returns {string} 生成的任务编号
 */
export function generateTaskNumber() {
  let currentTimestamp = Math.floor(Date.now() / 1000);

  if (currentTimestamp === lastTimestamp) {
    // 同一秒内递增序列号
    sequence += 1;
    // 如果序列号超过1000，等待下一秒
    if (sequence >= 1000) {
      while (currentTimestamp === lastTimestamp) {
        // 等待时间戳变化
        currentTimestamp = Math.floor(Date.now() / 1000);
      }
      sequence = 0; // 重置序列号
    }
  } else {
    // 时间戳变化，重置序列号
    sequence = 0;
    lastTimestamp = currentTimestamp;
  }

  // 生成任务编号：时间戳 + 序列号（3位）
  return `${currentTimestamp}${String(sequence).padStart(3, '0')}`;
}
