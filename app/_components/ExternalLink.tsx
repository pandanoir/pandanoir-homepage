import clsx from 'clsx';
import { ComponentProps } from 'react';

export const ExternalLink = (props: ComponentProps<'a'>) => (
  <a
    {...props}
    rel="noopener noreferrer"
    className={clsx(
      props.className,
      'hover:underline hover:text-sky-300 text-sky-500',
    )}
  />
);
