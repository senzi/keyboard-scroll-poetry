import LUT from './lut.js';

const output = document.getElementById('output');
const notice = document.getElementById('notice');
const btnGenerate = document.getElementById('generate');
const btnCopy = document.getElementById('copy');

function getRandomUnique(arr, count) {
  const result = [];
  const used = new Set();
  while (result.length < count) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
}

function generateSentence() {
  const [a, b, c, d] = getRandomUnique(LUT, 4);
  return `${a}${b}，${c}${d}。`;
}

function render() {
  const sentence = generateSentence();
  output.textContent = sentence;
  output.dataset.text = sentence;
  notice.textContent = '';
}

async function copyText() {
  const text = output.dataset.text;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      notice.textContent = '✅ 已复制到剪切板';
      setTimeout(() => (notice.textContent = ''), 2000);
      console.log('使用 navigator.clipboard 复制成功');
    } else if (document.execCommand) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // Avoid scrolling to bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        notice.textContent = '✅ 已复制到剪切板';
        setTimeout(() => (notice.textContent = ''), 2000);
        console.log('使用 document.execCommand 复制成功 (Fallback)');
      } catch (err) {
        console.error('复制失败: ', err);
        notice.textContent = '❌ 复制失败，请手动复制';
        setTimeout(() => (notice.textContent = ''), 3000);
      } finally {
        document.body.removeChild(textarea);
      }
      console.warn('navigator.clipboard 不可用，使用 document.execCommand 进行 Fallback');
    } else {
      notice.textContent = '❌ 浏览器不支持自动复制，请手动复制';
      setTimeout(() => (notice.textContent = ''), 3000);
      console.warn('navigator.clipboard 和 document.execCommand 均不可用');
    }
  } catch (err) {
    console.error('复制文本时发生错误: ', err);
    notice.textContent = '❌ 复制失败，请手动复制';
    setTimeout(() => (notice.textContent = ''), 3000);
  }
}

btnGenerate.onclick = render;
btnCopy.onclick = copyText;

render();
