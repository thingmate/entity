import { type Abortable } from '@xstd/abortable';
import { type PushToPullOptions, type ReadableFlow } from '@xstd/flow';

/**
 * Represents an _abstract_ `property`: a **value** we can _read_, _write_, and _observe_.
 *
 * @template GValue The type of the property value.
 */
export interface EntityProperty<GValue> {
  readonly get: EntityPropertyGet<GValue>;
  readonly set: EntityPropertySet<GValue>;
  readonly observer: EntityPropertyObserver<GValue>;
}

/**
 * Represents a function to _read_ a value.
 *
 * @template GValue - The type of the value being read.
 * @param {Abortable} [options] - An optional argument to abort the operation.
 * @returns {Promise<GValue>} A promise that resolves with the read value.
 */
export interface EntityPropertyGet<GValue> {
  (options?: Abortable): Promise<GValue>;
}

/**
 * Represents a function to _write_ a value.
 *
 * @template GValue - The type of the value being written.
 * @param {GValue} value - The value to write.
 * @param {Abortable} [options] - An optional argument to abort the operation.
 * @returns {Promise<void>} A promise that resolves once the value has been successfully written
 * or rejects in case of errors.
 */
export interface EntityPropertySet<GValue> {
  (value: GValue, options?: Abortable): Promise<void>;
}

/**
 * Represents a stream to _observe_ a value.
 *
 * @template GValue - The type of the value being observed.
 * @property {[options?: PushToPullOptions]} arguments - Optional parameters affecting how the data flow
 * is managed between the producer (push mechanism) and the consumer (pull mechanism).
 */
export type EntityPropertyObserver<GValue> = ReadableFlow<GValue, [options?: PushToPullOptions]>;

/**
 * Represents a _named_ collection of `EntityProperty`s.
 */
export type EntityPropertyMap = {
  readonly [key: string]: EntityProperty<any>;
};
