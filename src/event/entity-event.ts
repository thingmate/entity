import { type Flow, type PushToPullOptions } from '@xstd/flow';

/**
 * Represents an abstract `event`: a flow of incoming values.
 *
 * @template GValue - The type of the value associated with the entity event.
 */
export type EntityEvent<GEvent> = Flow<GEvent, [options?: PushToPullOptions]>;
