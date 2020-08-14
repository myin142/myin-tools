export function generateAlphanumeric(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function generateUniqueAlphanumeric(length: number, values: string[]): string {
    let id = generateAlphanumeric(length);
    while (values.includes(id)) {
        id = generateAlphanumeric(length);
    }

    return id;
}