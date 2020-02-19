declare module 'json-extra';

declare type Callback = (
  err: null | { message: string; error?: string } | NodeJS.ErrnoException, successMessage?: string
) => void;
