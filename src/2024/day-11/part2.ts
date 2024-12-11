import fs from "fs";

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8").trim();

function getInitialPebbles(): number[] {
  return input.split(" ").map(Number);
}

// A simple cache decorator in TypeScript
function cache<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  const cachedFunction = (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };

  return cachedFunction as T;
}

const cachedProcessor = cache(countPebbles);

function countPebbles(pebble: number, remainedIterations: number): number {
  if (remainedIterations == 0) {
    return 1;
  }

  if (pebble === 0) {
    return cachedProcessor(1, remainedIterations - 1);
  }

  const str = pebble.toString();
  const len = str.length;

  if (len % 2 === 0) {
    const left = str.slice(0, len / 2);
    const right = str.slice(len / 2);
    return (
      cachedProcessor(parseInt(left), remainedIterations - 1) +
      cachedProcessor(parseInt(right), remainedIterations - 1)
    );
  }

  return cachedProcessor(2024 * pebble, remainedIterations - 1);
}

function main() {
  console.time("day 11 part 2");
  const pebbles = getInitialPebbles();

  let sum = 0;
  pebbles.forEach((pebble) => {
    sum += cachedProcessor(pebble, 75);
  });

  console.log(sum);
  console.timeEnd("day 11 part 2");
}

main();
