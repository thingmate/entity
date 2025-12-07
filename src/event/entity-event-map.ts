import { type EntityEvent } from './entity-event.js';

/**
 * Represents a _named_ collection of `EntityEvent`s.
 */
export type EntityEventMap = {
  readonly [key: string]: EntityEvent<any>;
};
