[![npm (scoped)](https://img.shields.io/npm/v/@thingmate/entity.svg)](https://www.npmjs.com/package/@thingmate/entity)
![npm](https://img.shields.io/npm/dm/@thingmate/entity.svg)
![NPM](https://img.shields.io/npm/l/@thingmate/entity.svg)
![npm type definitions](https://img.shields.io/npm/types/@thingmate/entity.svg)

## @thingmate/entity

Universal API around property/action/event.

## 📦 Installation

```shell
yarn add @thingmate/entity
# or
npm install @thingmate/entity --save
```

## 📜 Documentation

### Entity

```ts
interface Entity {
  readonly properties: EntityPropertyMap;
  readonly actions: EntityActionMap;
  readonly events: EntityEventMap;
}
```


An `Entity` is a collection of properties, actions and events: whose goal is to create a universal representation of a _thing_.

**Example:** define a smart light bulb

```ts
interface SmartLightBulb extends Entity {
  readonly properties: {
    readonly onoff: EntityProperty<boolean>;
    readonly color: EntityProperty<{ r: number, g: number, b: number }>;
  };
  readonly actions: {
    readonly toggle: EntityAction<[], void>;
  };
  readonly events: {
    readonly overheat: EntityEvent<void>;
  };
}
```

Every _async_ API may be expressed using this universal API.

### EntityProperty

```ts
interface EntityProperty<GValue> {
  readonly get: EntityPropertyGet<GValue>;
  readonly set: EntityPropertySet<GValue>;
  readonly observer: EntityPropertyObserver<GValue>;
}
```

This represents a _property_ of an entity: a value that can be read, written and/or observed.

#### EntityPropertyGet

```ts
interface EntityPropertyGet<GValue> {
  (options?: Abortable): Promise<GValue>;
}
```

Fetches and returns the current value of a property.

**Example:** read the current color of a light bulb

```ts
console.log('color', await lightBulb.properties.color.get());
```

#### EntityPropertySet

```ts
interface EntityPropertySet<GValue> {
  (value: GValue, options?: Abortable): Promise<void>;
}
```

Sets the current value of a property.

**Example:** set the color of a light bulb to red

```ts
await lightBulb.properties.color.set({ r: 255, g: 0, b: 0 });
```

#### EntityPropertyObserver

```ts
type EntityPropertyObserver<GValue> = ReadableFlow<GValue, [options?: PushToPullOptions]>;
```

A _readable_ flow that observes the value of a property.

**Example:** observe the color of a light bulb

```ts
const controller = new AbortController();

for await (const color of lightBulb.properties.color.observer.open(controller.signal)) {
  console.log('color', color);
}
```

### EntityAction

```ts
interface EntityAction<
  GArguments extends readonly any[],
  GReturn,
  GAbortable extends Abortable = Abortable,
> {
  (...args: [...GArguments, options?: GAbortable]): Promise<GReturn>;
}
```

This represents an _action_ of an entity: something that can be invoked to perform some action and produce a result.

**Example:** toggle on/off a light bulb when clicking on a button

```ts
document.getElementById('toggle-button').addEventListener('click', async () => {
  await lightBulb.actions.toggle();
});
```

### EntityEvent

```ts
type EntityEvent<GValue> = ReadableFlow<GValue, [options?: PushToPullOptions]>
```

This represents an _event_ emitted by an entity: something that may happen any time and can be observed.

**Example:** toggle off a light bulb when it overheats

```ts
const controller = new AbortController();

for await (const _ of lightBulb.events.overheat.open(controller.signal)) {
  await lightBulb.properties.onoff.set(false);
}
```

---

### Helpers


#### DEFAULT_ENTITY_PROPERTY

```ts
declare const DEFAULT_ENTITY_PROPERTY: EntityProperty<any>;
```

A default implementation of an `EntityProperty` that can be used to implement only a subset of the API.

> **NOTE**: all members of an `EntityProperty` are always defined, **but**, by default, calling these members will throw a "Not implemented" error.


**Example:** implement only the `get` method of a property

```ts
const lightBulb: SmartLightBulb = {
  properties: {
    onoff: {
      ...DEFAULT_ENTITY_PROPERTY,
      get: (options?: Abortable) => fetch('http://localhost:3000/onoff', options).then(res => res.json()),
    },
    // ...
  },
  // ...
};

await lightBulb.properties.onoff.get(); // => true/false
await lightBulb.properties.onoff.set(false); // => throws an error, because `set` is not implemented
```

#### mapEntityProperty

```ts
declare function mapEntityProperty<GIn, GOut>(
  property: EntityProperty<GIn>,
  { inOut, outIn }: BidirectionalMapFunctions<GIn, GOut>,
): EntityProperty<GOut>;
```

Transforms the input and output values of an `EntityProperty`.

**Example:** converts a temperature from celcius to fahrenheit

```ts
const temperatureSensor = {
  properties: {
    // converts the temperature from celcius to fahrenheit
    temperature: mapEntityProperty(
      temperatureProperty, // assumes this is a property of a temperature sensor in celcius
      {
        inOut: (value: number) => value * 9 / 5 + 32,
        outIn: (value: number) => (value - 32) * 5 / 9,
      },
    ),
  },
  // ...
};

await temperatureSensor.properties.temperature.get(); // => 32°F if the sensor reported 0°C
```

