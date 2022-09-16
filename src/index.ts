// TypeScript Playground for fun ----------------------------------

type Status = "idle" | "pending" | "success" | "error";

type ErrorResponse = { status: "error"; error: string };
type OtherResponse = { status: Omit<Status, "error">; value: string };

type ErrOrOther<S extends Status> = S extends "error"
  ? ErrorResponse
  : OtherResponse;

function createResponse<T extends Status>(eoo: T): ErrOrOther<T> {
  throw "unimplemented";
}

let a = createResponse("error");
let b = createResponse("idle");

// Conditional Types

// Constraints ----------------------------------

type Data = { message: string };
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

type DataMessageContent = MessageOf<{}>;

type FlattenBasic<T> = T extends any[] ? T[number] : T;
type A = FlattenBasic<Data[]>;
type B = FlattenBasic<string>;

type Flatten<T> = T extends Array<infer I> ? I : T;
type C = Flatten<ErrorResponse[]>;

// Infering -----------------------------------

type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : T;

type FunReturnType = GetReturnType<() => string>;
type CreateResponseReturnType = GetReturnType<typeof createResponse>;

// Distributive -----------------------------------

type ToArray<T> = T extends any ? Array<T> : never;
type StrArrOrNumArr = ToArray<string | number>;

type ToArrayNonDistributive<T> = [T] extends [any] ? Array<T> : never;
type StrArrOrNumArrNonDistributive = ToArrayNonDistributive<string | number>;

// Mapped Types

// Mapping -----------------------------------

type OptionFlags<T> = {
  [P in keyof T]: boolean;
};

type FetaureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionFlags<FetaureFlags>;

// Modifiers -----------------------------------

type MakeMutableAndRemoveOptionality<T> = {
  -readonly [P in keyof T]-?: T[P];
};

type LockedAccount = {
  readonly id: string;
  readonly name?: string;
};

type UnlockedAccount = MakeMutableAndRemoveOptionality<LockedAccount>;

// Remaping via as ---------------------------------

type MakeGetter<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type Instruments = {
  violin: number;
  cello: boolean;
};

type InstrumentSelector = MakeGetter<Instruments>;

type KindRemapper<T extends { kind: string }> = {
  [O in T as `get${Capitalize<O["kind"]>}`]: (t: T) => T;
};

type EventKind = { kind: "event"; x: number; y: number };
type PersonKind = { kind: "person"; name: string };

type RemappedEvent = KindRemapper<EventKind>;
type ReamppedPerson = KindRemapper<PersonKind>;

// ------------------------------------------

const input = [{ divide: "move", conquer: "arrived" }];
const output = input.reduce(
  (acc, { divide, conquer }) => ({ ...acc, [divide]: conquer }),
  {}
);

console.log(output);

// Conditions ------------------------------------------

type Coin = "heads" | "tails";

class Position {
  constructor(
    public coordinates: {
      x: number;
      y: number;
      z: number;
    }
  ) {}
}

type MyError = ["error", Error];
type MyInfo = ["info", Position];

function flipCoin(): Coin {
  return Math.random() > 0.5 ? "heads" : "tails";
}

function mayBeGetPosition(): MyError | MyInfo {
  return flipCoin() === "heads"
    ? ["error", new Error("heads, you lose")]
    : ["info", new Position({ x: 12, y: 24, z: -6 })];
}

const [message, data] = mayBeGetPosition();
const getXCoordinate = data instanceof Position ? data.coordinates.x : null;

const position = mayBeGetPosition();
const dataType =
  position[0] === "error" ? position[1].message : position[1].coordinates;

// Some stuff -----------------------------------------

type SpecialDate = Date & { getReason(): string };
const yearsLastDay: SpecialDate = {
  ...new Date(),
  getReason: () => "Last day of the year",
};
yearsLastDay.getReason();

type CanBark = {
  bark(): string;
  eat(food: string): void;
};

class Dog implements CanBark {
  bark = () => "woof";
  eat = (food: string) => console.log(food);
}

// Type a JSON Value ----------------------------------------
// A JSON value MUST be an
// - object
// - array
// - number
// - string,
// or one of the following three literal names:
// - false
// - true
// - null

type JSONPrimitive = number | string | boolean | null;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = Array<JSONPrimitive | JSONObject>;
type JSONValue = JSONPrimitive | JSONObject | JSONArray;

////// DO NOT EDIT ANY CODE BELOW THIS LINE //////
function isJSON(arg: JSONValue) {}

// POSITIVE test cases (must pass)
isJSON("hello");
isJSON([4, 8, 15, 16, 23, 42]);
isJSON({ greeting: "hello" });
isJSON(false);
isJSON(true);
isJSON(null);
isJSON({ a: { b: [2, 3, "foo"] } });

// NEGATIVE test cases (must fail)

// @ts-expect-error
isJSON(() => "");
// @ts-expect-error
isJSON(class {});
// @ts-expect-error
isJSON(undefined);
// @ts-expect-error
isJSON(new BigInt(143));
// @ts-expect-error
isJSON(isJSON);

// COMPLEX ----------------------------------------

// Get keys of type T whose values are assignable to type U
type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T] &
  keyof T;

/**
 * get a subset of Document, consisting only of methods
 * returning an Element (e.g., querySelector) or an
 * Element[] (e.g., querySelectorAll)
 */
type ValueFilteredDoc = Pick<
  Document,
  FilteredKeys<Document, (...args: any[]) => Element | Element[]>
>;

// Custom Application of the Filter
type SomeObjectType = {
  key_a: "pending";
  key_b: "some_value";
  key_c: "error";
  key_d: "something_else";
};

type KeysOfStatusTypeValues = FilteredKeys<SomeObjectType, Status>;
type FilteredSomeObjectType = Pick<SomeObjectType, KeysOfStatusTypeValues>;

// Custom Pick -------------------------

type Cars = {
  accord: "honda";
  clio: "renault";
  fiesta: "ford";
  punto: "fiat";
};

type CustomPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type LatinCars = CustomPick<Cars, "clio" | "punto">;

// Narrowing with in -------------------------

type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    return animal; // Fish | Human
  } else {
    return animal; // Bird | Human
  }
}

// Type Predicates -------------------------

class PetFish implements Fish {
  swim() {}
}
class PetBird implements Bird {
  fly() {}
}
const fisho = new PetFish();
const birdo = new PetBird();

// pet is Fish allows TS to know the return type is Fish[]
const isFish = (pet: Fish | Bird): pet is Fish => "swim" in pet;
const onlyFishes = [fisho, birdo].filter(isFish);

// Default Never --------------------------

type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Triangle = { kind: "triangle"; side: number }; // equilateral

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "triangle":
      return (Math.sqrt(3) / 4) * shape.side;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}

// Function Overload ----------------------

interface Colorful {
  color: string;
}

interface ColorfulCircle extends Colorful, Circle {}
// type ColorfulCircle = Colorful & Circle

const cc: ColorfulCircle = {
  kind: "circle",
  color: "red",
  radius: 42,
};

type Maybe<Type> = Type | null | undefined;
type OneOrMany<Type> = Type | Type[];
type MaybeOneOrMany<T> = Maybe<OneOrMany<T>>;

type Either2Dor3D = [number, number, number?];

// Generics --------------------------------

type Identity<T> = (arg: T) => T;

const indentityString: Identity<string> = (arg) => arg;

type GetValue<T, K extends keyof T> = (obj: T, key: K) => T[K];

const colorfulCircleSelector: GetValue<ColorfulCircle, keyof ColorfulCircle> = (
  obj,
  key
) => obj[key];

const circleKind = colorfulCircleSelector(cc, "kind");

// Class as Generics -------------------------

class BeeKeeper {
  hasMask: boolean = true;
}
class ZooKeeper {
  nametag: string = "Mike";
}
class Animal {
  numLegs: number = 4;
}

class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper();
}
class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}

function createAnimal<T extends Animal>(c: new () => T): T {
  return new c();
}

createAnimal(Lion).keeper.nametag;
createAnimal(Bee).keeper.hasMask;

// --------------------------------------

type Maybe<T> = T | null

type Opened<Type> = Type extends Object ? Partial<Type> & {
  [k in string]: string | number
} : never

interface Traits {
  age: Maybe<number>
  name: Maybe<string>
}

class Person implements Traits {
  age = null
  name = null

  constructor(traits: Partial<Traits>) {
    Object.assign(this, traits)
  }
}

const p: Opened<Traits> = {
  age: 26,
  name: "Mary",
  occupation: "developer"
}

const mary = new Person(p)
const noone = new Person({})

const logger = (c: any) => console.log(c, '\nInstance of Person:', c instanceof Person)

logger(mary)
logger(noone)
