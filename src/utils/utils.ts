export function isString(name: string, value: any) {
    if (typeof value !== 'string') {
        return `${name} must be a string`;
    }
    return null;
}


export function isNumber(name: string, value: any) {
    if (typeof value !== 'number') {
        return `${name} must be a number`;
    }
    return null;
}
