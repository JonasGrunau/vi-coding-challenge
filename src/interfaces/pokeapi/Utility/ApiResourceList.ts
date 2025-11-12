export type Base = { id: number; };

export type NamedBase = Base & { name: string; };

export type ApiResource = {
	endpoint?: any;
	url: string;
};

export type ApiResourceList<T extends Base> = {
	count: number;
	next: string;
	previous: string;
	results: T[];
};
