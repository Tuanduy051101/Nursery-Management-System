export const formatCurrencyVND = (money) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND', // Đơn vị tiền tệ của Việt Nam
        minimumFractionDigits: 0,
    });
    return formatter.format(money);
}

const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
const units = ['', 'nghìn', 'triệu', 'tỷ'];

export const convertToWords = (number) => {
  if (number === 0) return 'không';
  const numStr = number.toString();
  const numChunks = [];
  for (let i = numStr.length; i > 0; i -= 3) {
    numChunks.unshift(numStr.slice(Math.max(0, i - 3), i));
  }
  let result = '';
  numChunks.forEach((chunk, index) => {
    const chunkNum = parseInt(chunk);
    if (chunkNum > 0) {
      result += `${convertChunk(chunkNum)} ${units[numChunks.length - index - 1]} `;
    }
  });
  return result.trim();
}

const convertChunk = (chunk) => {
  const digits = chunk.toString().split('').map(digit => parseInt(digit));
  let result = '';
  if (digits.length === 3) {
    result += `${ones[digits[0]]} trăm `;
    digits.shift();
  }
  if (digits.length === 2) {
    result += `${tens[digits[0]]} `;
    digits.shift();
  }
  if (digits.length === 1) {
    result += `${ones[digits[0]]}`;
  }
  return result;
}