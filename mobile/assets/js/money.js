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

export const convertChunk = (numberStr) => {
  const number = parseInt(numberStr);
  return readableNumber(number) + ' đồng';
};
const readableNumber = (number) => {
  const digits = [
    '', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'
  ];

  const groupDigits = (number) => {
    const digitArray = [];
    while (number > 0) {
      digitArray.push(number % 1000);
      number = Math.floor(number / 1000);
    }
    return digitArray;
  };

  const digitArray = groupDigits(number);
  const readableArray = digitArray.map((group, index) => {
    if (group === 0) {
      return '';
    }
    return `${readable3Digits(group)} ${digits[index]}`;
  });

  return readableArray.reverse().join(' ').trim();
};
const readable3Digits = (number) => {
  const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const teens = ['mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];
  const hundreds = ['', 'một trăm', 'hai trăm', 'ba trăm', 'bốn trăm', 'năm trăm', 'sáu trăm', 'bảy trăm', 'tám trăm', 'chín trăm'];

  const singleDigit = (digit) => {
    return ones[digit];
  };

  const twoDigits = (digit1, digit2) => {
    if (digit1 === 0) {
      return singleDigit(digit2);
    } else if (digit1 === 1) {
      return teens[digit2];
    } else {
      return `${ones[digit1]} mươi ${singleDigit(digit2)}`;
    }
  };

  if (number >= 100) {
    const hundredDigit = Math.floor(number / 100);
    const remainder = number % 100;
    return `${hundreds[hundredDigit]} ${twoDigits(Math.floor(remainder / 10), remainder % 10)}`;
  } else {
    return twoDigits(Math.floor(number / 10), number % 10);
  }
}
