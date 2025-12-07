import { type EntityPropertyMapper } from '../../entity-property-mapper.js';

/**
 * Reverses the mapping direction of an entity property mapper, swapping the "to" and "from" methods.
 *
 * @param {EntityPropertyMapper<GIn, GOut>} mapper The entity property mapper to be inverted.
 * @returns {EntityPropertyMapper<GOut, GIn>} A new entity property mapper with reversed "to" and "from" mappings.
 */
export function inverseEntityPropertyMapper<GIn, GOut>(
  mapper: EntityPropertyMapper<GIn, GOut>,
): EntityPropertyMapper<GOut, GIn> {
  return {
    to: mapper.from,
    from: mapper.to,
  };
}
