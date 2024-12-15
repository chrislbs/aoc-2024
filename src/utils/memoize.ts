export function memoize<T extends unknown[], U>(fn: (...args: T) => U): (...args: T) => U {
    const cache = new Map<string, U>();

    return (...args: T): U => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key)!;
        }

        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}