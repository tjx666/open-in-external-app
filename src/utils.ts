export function isRepeat<T>(arr: T[], isEqual?: (a: T, b: T) => boolean): boolean {
    const { length } = arr;
    if (length <= 1) return false;

    for (let i = 0; i <= length - 2; i++) {
        for (let j = i + 1; j <= length - 1; j++) {
            if (isEqual) {
                if (isEqual(arr[i], arr[j])) {
                    return true;
                }
            } else if (arr[i] === arr[j]) {
                return true;
            }
        }
    }

    return false;
}

export function isAsciiString(str: string): boolean {
    return [...str].every((char) => char.codePointAt(0)! <= 255);
}
