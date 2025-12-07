import { type EntityPropertyMapper } from '../../entity-property-mapper.js';

/**
 * Creates an EntityPropertyMapper that transforms numbers by multiplying
 * or dividing them with a specified multiplier.
 *
 * @param {number} multiplier The value used to multiply or divide the numbers.
 * @returns {EntityPropertyMapper<number, number>} An object with `to` and `from` methods for transforming numbers using the provided multiplier.
 */
export function numberMultiplierEntityPropertyMapper(
  multiplier: number,
): EntityPropertyMapper<number, number> {
  return {
    to: (input: number): number => input * multiplier,
    from: (input: number): number => input / multiplier,
  };
}
