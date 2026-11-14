import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display-28',
        'text-heading-20',
        'text-body-16',
        'text-body-14-semibold',
        'text-body-14',
        'text-caption-12',
        'text-caption-12-bold',
        'text-caption-10',
        'text-caption-10-bold',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
