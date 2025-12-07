import { type EntityPropertyMapper } from '../../entity-property-mapper.js';

/**
 * Maps between a number and its associated string (represented by an enum).
 *
 * @template GEnum The type of the enum.
 * @param {Record<GEnum, number>} record A record representing the mapping of enum keys to numeric values.
 * @returns {EntityPropertyMapper<number, GEnum>} An object with methods `to` for converting a numeric value to its string representation in the enum,
 * and `from` for converting a string representation back to its numeric value in the enum.
 */
export function numberEnumEntityPropertyMapper<GEnum extends string>(
  record: Record<GEnum, number>,
): EntityPropertyMapper<number, GEnum> {
  const inverseRecord: Record<number, GEnum> = Object.fromEntries(
    Object.entries(record).map(([key, value]: [string, unknown]): [unknown, string] => [
      value,
      key,
    ]),
  );

  return {
    to: (input: number): GEnum => {
      if (Reflect.has(inverseRecord, input)) {
        return Reflect.get(inverseRecord, input) as GEnum;
      } else {
        throw new Error(`No enum key found for value ${input}`);
      }
    },
    from: (input: GEnum): number => {
      if (Reflect.has(record, input)) {
        return Reflect.get(record, input) as number;
      } else {
        throw new Error(`No enum value found for key ${input}`);
      }
    },
    // to: (input: number): GEnum => inverseRecord[input] as GEnum,
    // from: (input: GEnum): number => record[input] as number,
  };
}
