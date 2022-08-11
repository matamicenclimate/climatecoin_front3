import clsx from 'clsx';

const pagination = clsx('h-10 flex flex-row justify-start items-start gap-2 self-center p-0');

const button = clsx(
  'w-10 h-10 grow-0 flex flex-row justify-center items-center gap-3 py-3 px-4 rounded-[90px] border-solid border-2 border-neutral-6 text-sm text-bold text-neutral-2',
  'hover:bg-neutral-7',
  'disabled:bg-neutral-7 disabled:cursor-not-allowed disabled:text-neutral-5'
);

const active = clsx(
  'bg-primary border-primary text-neutral-8',
  'hover:bg-primary'
);

export default { pagination, button, active }
