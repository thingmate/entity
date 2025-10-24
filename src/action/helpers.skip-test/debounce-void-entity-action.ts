import { type Abortable, abortify } from '@xstd/abortable';
import { type EntityAction } from '../entity-action.js';

export function debounceVoidEntityAction(
  send: EntityAction<[], void>,
  debounce: number,
): EntityAction<[], void> {
  if (debounce <= 0) {
    return send;
  }

  let consumers: number = 0;
  let promise: PromiseWithResolvers<void> | undefined = undefined;
  let controller: AbortController | undefined = undefined;
  let timer: any | undefined = undefined;

  return async ({ signal }: Abortable = {}): Promise<void> => {
    signal?.throwIfAborted();

    consumers++;

    if (consumers === 1) {
      promise = Promise.withResolvers<void>();
      timer = setTimeout((): void => {
        timer = undefined;
        controller = new AbortController();
        Promise.try(send, {
          signal: controller.signal,
        }).then(promise!.resolve, promise!.reject);
      }, debounce);
    }

    try {
      return await abortify(promise!.promise, { signal });
    } finally {
      consumers--;

      if (consumers === 0) {
        promise = undefined;

        if (timer !== undefined) {
          clearTimeout(timer);
          timer = undefined;
        }

        if (controller !== undefined) {
          controller.abort();
          controller = undefined;
        }
      }
    }
  };
}
