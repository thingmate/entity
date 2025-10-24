import { type EntityActionMap } from './action/entity-action.js';
import { type EntityEventMap } from './event/entity-event.js';
import { type EntityPropertyMap } from './property/entity-property.js';

/**
 * Represents a group of properties, actions and events.
 */
export interface Entity {
  readonly properties: EntityPropertyMap;
  readonly actions: EntityActionMap;
  readonly events: EntityEventMap;
}
