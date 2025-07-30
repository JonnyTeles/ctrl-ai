import { preprocessBase64Image } from './canvas';
import { chatIa } from './gpt';
import { getWorker } from './worker';
const output = document.getElementById('output');
const question = document.getElementById('question');
const clean = document.getElementById('clean')

let animationId: ReturnType<typeof setInterval> | null = null;

window.addEventListener('mousedown', async (e: MouseEvent) => {
  if (e.button !== 1) return;
  if (!document.hasFocus()) return;
  return await callIa()
});

window.addEventListener('keydown', async (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'v') {
    if (!document.hasFocus()) return;
    await callIa();
  }
});

window.electronAPI.shortcut(async () => {
  window.focus()
  return await callIa();
});

async function callIa() {
  const output = document.getElementById('output');
  const question = document.getElementById('question');

  if (!output || !question) {
    console.warn('Elementos output ou question não encontrados');
    return;
  }

  animationId = startAnalyzingAnimation(output);

  try {
    const dataUrl = await window.electronAPI.getClipboardContent();

    if (!dataUrl || !dataUrl.content) {
      if (animationId !== null) clearInterval(animationId);
      output.textContent = 'Nada na área de transferência';
      return;
    }

    let textoPergunta: string;

    if (dataUrl.type === 'image') {

      const preprocessedBase64 = await preprocessBase64Image(dataUrl.content);

      const worker = await getWorker();
      const { data: { text } } = await worker.recognize(preprocessedBase64);
      textoPergunta = text.trim();
    } else {
      textoPergunta = dataUrl.content;
    }

    question.textContent = textoPergunta;

    const resposta: string = await chatIa(textoPergunta);

    if (animationId !== null) clearInterval(animationId);
    output.textContent = resposta;

    showCleanButton();

    return { texto: textoPergunta, resposta };
  } catch (err) {
    console.error('Erro ao consultar IA:', err);
    if (animationId !== null) clearInterval(animationId);
    output.textContent = 'Erro ao gerar resposta.';
    showCleanButton();
  }

  return;
}

document.getElementById('minimize')?.addEventListener('click', () => {
  window.electronAPI.minimize();
});

document.getElementById('maximize')?.addEventListener('click', () => {
  window.electronAPI.maximize();
});

document.getElementById('close')?.addEventListener('click', () => {
  window.electronAPI.close();
});

output?.addEventListener('click', async () => {
  if (output.innerText === 'Resposta') return;
  await navigator.clipboard.writeText(output.innerText);
  showToast("Resposta copiada!");
});

question?.addEventListener('click', async () => {
  if (question.innerText === 'Pergunta') return;
  await navigator.clipboard.writeText(question.innerText);
  showToast("Pergunta copiada!");
});

clean?.addEventListener('click', () => {
  if (question?.innerText === 'Pergunta' && output?.innerText === 'Resposta') return;
  question!.textContent = 'Pergunta'
  output!.textContent = 'Resposta'
  hideCleanButton();
})

function showToast(mensagem: string) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = mensagem;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

function showCleanButton() {
  if (!clean) return;
  clean.style.display = 'flex';
}

function hideCleanButton() {
  if (!clean) return;
  clean.style.display = 'none';
}

function startAnalyzingAnimation(outputElement: HTMLElement) {
  let dots = 0;
  const maxDots = 3;

  const intervalId = setInterval(() => {
    dots = (dots + 1) % (maxDots + 1);
    outputElement.textContent = 'Analisando' + '.'.repeat(dots);
  }, 500);

  return intervalId;
}
