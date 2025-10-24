import { type Abortable } from '@xstd/abortable';
import { type BidirectionalMapFunctions } from '@xstd/functional';
import { type EntityProperty } from '../../entity-property.js';

/**
 * Maps an `EntityProperty` from one type to another using the provided bidirectional mapping functions.
 *
 * @param {EntityProperty<GIn>} property - The original property to be mapped.
 * @param {{ inOut: (input: GIn) => GOut, outIn: (output: GOut) => GIn }} bidirectionalMapFunctions - The mapping functions used to map values in both directions.
 * @param {(input: GIn) => GOut} bidirectionalMapFunctions.inOut - Function to map input values from GIn to GOut.
 * @param {(output: GOut) => GIn} bidirectionalMapFunctions.outIn - Function to map output values from GOut to GIn.
 * @return {EntityProperty<GOut>} The transformed EntityProperty with the mapped type GOut.
 */
export function mapEntityProperty<GIn, GOut>(
  property: EntityProperty<GIn>,
  { inOut, outIn }: BidirectionalMapFunctions<GIn, GOut>,
): EntityProperty<GOut> {
  return {
    get: async (options?: Abortable): Promise<GOut> => {
      return inOut(await property.get(options));
    },
    set: async (value: GOut, options?: Abortable): Promise<void> => {
      return await property.set(outIn(value), options);
    },
    observer: property.observer.map(inOut),
  };
}
