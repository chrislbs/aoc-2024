
export function gcd(a: number, b: number): number {
    while(b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

export function lcm(a: number, b: number): number {
    return Math.abs(a * b) / gcd(a, b)
}