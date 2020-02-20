declare module 'json-extra';

declare type RCSError = null | { message: string; error?: string };

declare type Callback = (
  err: null | { message: string; error?: string } | NodeJS.ErrnoException, successMessage?: string
) => void;
