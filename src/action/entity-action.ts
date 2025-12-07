import { type Action } from '@xstd/action';

/**
 * Represents an _abstract_ `action`: a function that accepts a list of arguments and returns a result.
 *
 * @template GArguments The list of arguments to provide to the function.
 * @template GReturn The returned result.
 */
export type EntityAction<GArguments extends readonly unknown[], GReturn> = Action<
  GArguments,
  GReturn
>;
