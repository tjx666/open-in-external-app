export function isAsciiString(str: string): boolean {
    return [...str].every((char) => char.codePointAt(0)! <= 255);
}
