import { type Abortable } from '@xstd/abortable';

/**
 * Represents an _abstract_ `action`: a function that accepts a list of arguments and returns a result.
 *
 * @template GArguments The list of arguments to provide to the function.
 * @template GReturn The returned result.
 * @template GAbortable Optionally, the definition of the `Abortable` options.
 */
export interface EntityAction<
  GArguments extends readonly any[],
  GReturn,
  GAbortable extends Abortable = Abortable,
> {
  (...args: [...GArguments, options?: GAbortable]): Promise<GReturn>;
}

/**
 * Represents a _named_ collection of `EntityAction`s.
 */
export type EntityActionMap = {
  readonly [key: string]: EntityAction<any, any>;
};
