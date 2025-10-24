import { ReadableFlow, ReadableFlowIterator } from '@xstd/flow';
import { beforeEach, describe, expect, test } from 'vitest';
import type { EntityProperty } from '../../entity-property.js';
import { mapEntityProperty } from './map-entity-property.js';

describe('mapEntityProperty', () => {
  let value: number = 0;

  const property: EntityProperty<number> = {
    get: async (): Promise<number> => value,
    set: async (_value: number): Promise<void> => {
      value = _value;
    },
    observer: new ReadableFlow(async function* (): ReadableFlowIterator<number> {
      while (true) {
        yield value;
      }
    }),
  };

  const mapped = mapEntityProperty(property, {
    inOut: (value: number): number => value * 10,
    outIn: (value: number): number => value / 10,
  });

  beforeEach(() => {
    value = 0;
  });

  test('get should resolves with value * 10', async () => {
    value = 2;
    await expect(mapped.get()).resolves.toBe(20);
  });

  test('get should resolves with value / 10', async () => {
    await expect(mapped.set(20)).resolves.not.toThrow();
    expect(value).toBe(2);
  });

  test('observer should reject', async () => {
    value = 2;
    await expect(mapped.observer.open(new AbortController().signal).next()).resolves.toEqual({
      value: 20,
      done: false,
    });
  });
});
