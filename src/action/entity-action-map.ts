import { type EntityAction } from './entity-action.js';

/**
 * Represents a _named_ collection of `EntityAction`s.
 */
export type EntityActionMap = {
  readonly [key: string]: EntityAction<any, any>;
};
