import { type Abortable } from '@xstd/abortable';
import { type PushToPullOptions, ReadableFlow, ReadableFlowContext } from '@xstd/flow';
import { type EntityProperty } from '../entity-property.js';

/**
 * An object implementing the methods of a _default_ `EntityProperty`.
 *
 * By default, all the methods reject with a "Property is not readable/writable/observable" Error.
 *
 * @example
 *
 * ```ts
 * const temperature = {
 *   ...DEFAULT_ENTITY_PROPERTY,
 *   get: async ({ signal }: Abortable = {}): Promise<number> => {
 *     return (await (await fetch('https://weather.org/api/temperature', { signal })).json())
 *       .temperature;
 *   },
 * };
 * ```
 */
export const DEFAULT_ENTITY_PROPERTY: EntityProperty<any> = Object.freeze({
  get: async ({ signal }: Abortable = {}): Promise<unknown> => {
    signal?.throwIfAborted();
    throw new Error('Property is not readable.');
  },
  set: async (_value: unknown, { signal }: Abortable = {}): Promise<void> => {
    signal?.throwIfAborted();
    throw new Error('Property is not writable.');
  },
  observer: new ReadableFlow<unknown, [options?: PushToPullOptions]>(async function* ({
    signal,
  }: ReadableFlowContext): AsyncGenerator<unknown, void, unknown> {
    signal.throwIfAborted();
    throw new Error('Property is not observable.');
  }),
});
