import { type EntityActionMap } from './action/entity-action-map.js';
import { type EntityEventMap } from './event/entity-event-map.js';
import { type EntityPropertyMap } from './property/entity-property-map.js';

/**
 * Represents a group of properties, actions and events.
 */
export interface Entity {
  readonly properties: EntityPropertyMap;
  readonly actions: EntityActionMap;
  readonly events: EntityEventMap;
}
