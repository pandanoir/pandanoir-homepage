'use client';

import clsx from 'clsx';
import { ComponentProps, useState } from 'react';
import { FaCheck, FaRegCopy } from 'react-icons/fa6';
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

export const CopyButton = ({
  text,
  className,
  ...props
}: ComponentProps<'button'> & { text: string }) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <button
      type="button"
      className={clsx('cursor-pointer disabled:cursor-default', className)}
      onClick={async () => {
        await copyToClipboard(text);
        toast('クリップボードにコピーされました');
        setIsChecked(true);
        setTimeout(() => setIsChecked(false), 3000);
      }}
      onMouseLeave={() => {
        setIsChecked(false);
      }}
      {...props}
      disabled={isChecked}
    >
      {isChecked ? <FaCheck size="1.4rem" /> : <FaRegCopy size="1.4rem" />}
    </button>
  );
};
