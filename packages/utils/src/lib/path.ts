export class Path {
	static join(...paths: string[]): string {
		const nonEmptyPaths = paths.filter((x) => !!x);
		let joined = nonEmptyPaths.map((x) => x.replace(/^\/+|\/+$/g, '')).join('/');

		if (nonEmptyPaths.length > 0) {
			if (nonEmptyPaths[0].startsWith('/')) {
				joined = `/${joined}`;
			}
			if (nonEmptyPaths[nonEmptyPaths.length - 1].endsWith('/')) {
				joined += '/';
			}
		}

		return joined;
	}

	static query(obj: object): string {
		if (obj == null) return '';
		return Object.keys(obj)
			.map((k) => `${k}=${obj[k]}`)
			.join('&');
	}
}