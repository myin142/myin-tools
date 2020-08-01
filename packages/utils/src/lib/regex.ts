// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
export function escapeRegex(str: string): string {
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// https://stackoverflow.com/questions/1247772/is-there-an-equivalent-of-java-util-regex-for-glob-type-patterns
function createRegexFromGlob(glob: string) {
    let out = '^';
    for (let i = 0; i < glob.length; ++i) {
        const c = glob.charAt(i);
        switch (c) {
            case '*':
                out += '.*';
                break;
            case '?':
                out += '.';
                break;
            case '.':
                out += '\\.';
                break;
            case '\\':
                out += '\\\\';
                break;
            default:
                out += c;
        }
    }
    out += '$';
    return out;
}

export function globMatch(path: string, glob: string): boolean {
    const regex = createRegexFromGlob(glob);
    return new RegExp(regex).test(path);
}
