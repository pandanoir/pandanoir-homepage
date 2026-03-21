import clsx from 'clsx';
import { ComponentProps } from 'react';

export const ExternalLink = (props: ComponentProps<'a'>) => (
  <a
    {...props}
    rel="noopener noreferrer"
    className={clsx(
      props.className,
      'text-sky-500 hover:text-sky-300 hover:underline',
    )}
  />
);
