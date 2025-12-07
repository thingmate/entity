import { Flow } from '@xstd/flow';
import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { EntityProperty } from './entity-property.js';
import { inverseEntityPropertyMapper } from './types/methods/map/built-in/inverse/inverse-entity-property-mapper.js';
import { numberEnumEntityPropertyMapper } from './types/methods/map/built-in/number-enum/number-enum-bidirectional-map-function.js';
import { numberMultiplierEntityPropertyMapper } from './types/methods/map/built-in/number-multiplier/number-multiplier-entity-property-mapper.js';
import { numberValidateEntityPropertyMapper } from './types/methods/map/built-in/number-validate/number-validate-entity-property-mapper.js';

describe('EntityProperty', () => {
  const NEVER_ABORTED = new AbortController().signal;

  describe('static-methods', () => {
    describe('notReadable', () => {
      it('should reject', async () => {
        await expect(EntityProperty.notReadable.invoke(NEVER_ABORTED)).rejects.toThrow();
      });
    });

    describe('notWritable', () => {
      it('should reject', async () => {
        await expect(EntityProperty.notWritable.invoke(NEVER_ABORTED, 1)).rejects.toThrow();
      });
    });

    describe('notObservable', () => {
      it('should reject', async () => {
        await expect(EntityProperty.notObservable.open(NEVER_ABORTED).next()).rejects.toThrow();
      });
    });
  });

  describe('properties', () => {
    describe('read', () => {
      it('should be readable', async () => {
        const read = vi.fn(async (): Promise<number> => 1);

        const prop = new EntityProperty({
          read,
        });

        await expect(prop.read!.invoke(NEVER_ABORTED)).resolves.toBe(1);
        expect(read).toHaveBeenCalledTimes(1);
      });

      it('should reject if not readable', async () => {
        const prop = new EntityProperty();

        expect(prop.read).toBeUndefined();
        await expect(prop.read$.invoke(NEVER_ABORTED)).rejects.toThrow();
      });
    });

    describe('write', () => {
      it('should be writable', async () => {
        const write = vi.fn(async (_signal: AbortSignal, _value: number): Promise<void> => {});

        const prop = new EntityProperty<number>({
          write,
        });

        await expect(prop.write!.invoke(NEVER_ABORTED, 1)).resolves.toBe(undefined);
        expect(write).toHaveBeenCalledTimes(1);
        expect(write.mock.calls[0][0]).instanceOf(AbortSignal);
        expect(write.mock.calls[0][1]).toBe(1);
      });

      it('should reject if not writable', async () => {
        const prop = new EntityProperty();

        expect(prop.write).toBeUndefined();
        await expect(prop.write$.invoke(NEVER_ABORTED, 1)).rejects.toThrow();
      });
    });

    describe('observe', () => {
      it('should be observable', async () => {
        const prop = new EntityProperty<number>({
          observe: new Flow<number>(async function* () {
            yield 1;
            yield 2;
          }),
        });

        await expect(Array.fromAsync<number>(prop.observe!.open(NEVER_ABORTED))).resolves.toEqual([
          1, 2,
        ]);
      });

      it('should reject if not observable', async () => {
        const prop = new EntityProperty();

        expect(prop.observe).toBeUndefined();
        await expect(prop.observe$.open(NEVER_ABORTED).next()).rejects.toThrow();
      });
    });
  });

  describe('methods', () => {
    describe('map', () => {
      it('should map values', async () => {
        const read = vi.fn(async (): Promise<number> => 1);
        const write = vi.fn(async (_signal: AbortSignal, _value: number): Promise<void> => {});

        const prop = new EntityProperty({
          read,
          write,
          observe: new Flow<number>(async function* () {
            yield 1;
            yield 2;
          }),
        }).map({
          to: String,
          from: Number,
        });

        await expect(prop.read$.invoke(NEVER_ABORTED)).resolves.toBe('1');
        expect(read).toHaveBeenCalledTimes(1);

        await expect(prop.write$.invoke(NEVER_ABORTED, '1')).resolves.toBe(undefined);
        expect(write).toHaveBeenCalledTimes(1);
        expect(write.mock.calls[0][0]).instanceOf(AbortSignal);
        expect(write.mock.calls[0][1]).toBe(1);

        await expect(Array.fromAsync<string>(prop.observe$.open(NEVER_ABORTED))).resolves.toEqual([
          '1',
          '2',
        ]);
      });

      it('should support partial entity', async () => {
        const prop = new EntityProperty<number>().map({
          to: String,
          from: Number,
        });

        await expect(prop.read$.invoke(NEVER_ABORTED)).rejects.toThrow();
        await expect(prop.write$.invoke(NEVER_ABORTED, '1')).rejects.toThrow();
        await expect(prop.observe$.open(NEVER_ABORTED).next()).rejects.toThrow();
      });

      describe('numberMultiplierEntityPropertyMapper', () => {
        it('should map values', async () => {
          const read = vi.fn(async (): Promise<number> => 1);
          const write = vi.fn(async (_signal: AbortSignal, _value: number): Promise<void> => {});

          const prop = new EntityProperty({
            read,
            write,
          }).map(numberMultiplierEntityPropertyMapper(10));

          await expect(prop.read$.invoke(NEVER_ABORTED)).resolves.toBe(10);
          expect(read).toHaveBeenCalledTimes(1);

          await expect(prop.write$.invoke(NEVER_ABORTED, 10)).resolves.toBe(undefined);
          expect(write).toHaveBeenCalledTimes(1);
          expect(write.mock.calls[0][0]).instanceOf(AbortSignal);
          expect(write.mock.calls[0][1]).toBe(1);
        });
      });

      describe('numberEnumEntityPropertyMapper', () => {
        it('should map values', async () => {
          const read = vi.fn(async (): Promise<number> => 1);
          const write = vi.fn(async (_signal: AbortSignal, _value: number): Promise<void> => {});

          const prop = new EntityProperty({
            read,
            write,
          }).map(
            numberEnumEntityPropertyMapper({
              a: 1,
              b: 2,
            }),
          );

          await expect(prop.read$.invoke(NEVER_ABORTED)).resolves.toBe('a');
          expect(read).toHaveBeenCalledTimes(1);

          await expect(prop.write$.invoke(NEVER_ABORTED, 'b')).resolves.toBe(undefined);
          expect(write).toHaveBeenCalledTimes(1);
          expect(write.mock.calls[0][0]).instanceOf(AbortSignal);
          expect(write.mock.calls[0][1]).toBe(2);
        });

        it('should throw if key/value not in the enum', async () => {
          const read = vi.fn(async (): Promise<number> => 4);
          const write = vi.fn(async (_signal: AbortSignal, _value: number): Promise<void> => {});

          const prop = new EntityProperty({
            read,
            write,
          }).map(
            numberEnumEntityPropertyMapper({
              a: 1,
              b: 2,
            }),
          );

          await expect(prop.read$.invoke(NEVER_ABORTED)).rejects.toThrow();
          expect(read).toHaveBeenCalledTimes(1);

          await expect(prop.write$.invoke(NEVER_ABORTED, 'c' as any)).rejects.toThrow();
          expect(write).toHaveBeenCalledTimes(0);
        });
      });

      describe('inverseEntityPropertyMapper', () => {
        it('should map-inverse values', async () => {
          const read = vi.fn(async (): Promise<number> => 1);
          const write = vi.fn(async (_signal: AbortSignal, _value: number): Promise<void> => {});

          const prop = new EntityProperty({
            read,
            write,
          }).map(inverseEntityPropertyMapper(numberMultiplierEntityPropertyMapper(10)));

          await expect(prop.read$.invoke(NEVER_ABORTED)).resolves.toBe(0.1);
          expect(read).toHaveBeenCalledTimes(1);

          await expect(prop.write$.invoke(NEVER_ABORTED, 0.1)).resolves.toBe(undefined);
          expect(write).toHaveBeenCalledTimes(1);
          expect(write.mock.calls[0][0]).instanceOf(AbortSignal);
          expect(write.mock.calls[0][1]).toBe(1);
        });
      });

      describe('numberValidateEntityPropertyMapper', () => {
        it('should throw if min is NaN', () => {
          expect(() =>
            numberValidateEntityPropertyMapper({
              min: Number.NaN,
            }),
          ).toThrow();
        });

        it('should throw if max is NaN', () => {
          expect(() =>
            numberValidateEntityPropertyMapper({
              max: Number.NaN,
            }),
          ).toThrow();
        });

        it('should throw if step is NaN', () => {
          expect(() =>
            numberValidateEntityPropertyMapper({
              step: Number.NaN,
            }),
          ).toThrow();
        });

        it('should throw if step is negative', () => {
          expect(() =>
            numberValidateEntityPropertyMapper({
              step: -1,
            }),
          ).toThrow();
        });

        describe('applied to EntityProperty.map', () => {
          describe('{ min:0, max:10, step:1 }', () => {
            let prop: EntityProperty<number>;

            beforeEach(() => {
              prop = new EntityProperty({
                write: async (_signal: AbortSignal, _value: number): Promise<void> => {},
              }).map(
                numberValidateEntityPropertyMapper({
                  min: 0,
                  max: 10,
                  step: 1,
                }),
              );
            });

            test('0 => OK', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, 0)).resolves.toBe(undefined);
            });

            test('10 => OK', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, 10)).resolves.toBe(undefined);
            });

            test('5 => OK', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, 5)).resolves.toBe(undefined);
            });

            test('-1 => ERROR', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, -1)).rejects.toThrow();
            });

            test('11 => ERROR', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, 11)).rejects.toThrow();
            });

            test('0.1 => ERROR', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, 0.1)).rejects.toThrow();
            });

            test('NaN => ERROR', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, Number.NaN)).rejects.toThrow();
            });
          });

          describe('{ nan: true }', () => {
            let prop: EntityProperty<number>;

            beforeEach(() => {
              prop = new EntityProperty({
                write: async (_signal: AbortSignal, _value: number): Promise<void> => {},
              }).map(
                numberValidateEntityPropertyMapper({
                  nan: true,
                }),
              );
            });

            test('0 => OK', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, 0)).resolves.toBe(undefined);
            });

            test('NaN => OK', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, Number.NaN)).resolves.toBe(undefined);
            });
          });

          describe('{ step: 1 }', () => {
            let prop: EntityProperty<number>;

            beforeEach(() => {
              prop = new EntityProperty({
                write: async (_signal: AbortSignal, _value: number): Promise<void> => {},
              }).map(
                numberValidateEntityPropertyMapper({
                  step: 1,
                }),
              );
            });

            test('0 => OK', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, 0)).resolves.toBe(undefined);
            });

            test('2 => OK', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, 2)).resolves.toBe(undefined);
            });

            test('0.1 => ERROR', async () => {
              await expect(prop.write$.invoke(NEVER_ABORTED, 0.1)).rejects.toThrow();
            });
          });
        });
      });
    });
  });
});
