'use client';

import { FaRegCopy } from 'react-icons/fa6';
import { toast } from 'sonner';

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    // モダンブラウザ: HTTPS か localhost 環境で動作
    return navigator.clipboard.writeText(text);
  } else {
    // フォールバック: 非対応 or HTTP 環境
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // 見えないように設定
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    return new Promise((resolve, reject) => {
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        successful ? resolve() : reject(new Error('コピーに失敗しました'));
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
  }
}

export const CodeBlock = (props: { children: string }) => (
  <div className="bg-gray-300 w-min max-w-full text-gray-900 px-4 py-2 rounded-sm relative group">
    <pre className="overflow-x-scroll">
      <code>{props.children}</code>
    </pre>
    <button
      type="button"
      className="group-hover:block hidden absolute top-1.5 right-1.5 border border-black rounded p-1.5 cursor-pointer"
      onClick={async () => {
        await copyToClipboard(props.children);
        toast('クリップボードにコピーされました');
      }}
    >
      <FaRegCopy size="1.4rem" />
    </button>
  </div>
);
