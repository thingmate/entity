import { type EntityProperty } from './entity-property.js';

/**
 * Represents a _named_ collection of `EntityProperty`s.
 */
export type EntityPropertyMap = {
  readonly [key: string]: EntityProperty<any>;
};
