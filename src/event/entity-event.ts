import { type PushToPullOptions, type ReadableFlow } from '@xstd/flow';

/**
 * Represents an abstract `event`: a stream to _observe_ a value.
 *
 * This value cannot be written nor read, the stream just reports when a new one is available.
 *
 * @template GValue - The type of the value associated with the entity event.
 */
export type EntityEvent<GValue> = ReadableFlow<GValue, [options?: PushToPullOptions]>;

/**
 * Represents a _named_ collection of `EntityEvent`s.
 */
export type EntityEventMap = {
  readonly [key: string]: EntityEvent<any>;
};
