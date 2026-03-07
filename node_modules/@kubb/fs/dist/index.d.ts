declare function clean(path: string): Promise<void>;

declare function getRelativePath(rootDir?: string | null, filePath?: string | null, platform?: 'windows' | 'mac' | 'linux'): string;
declare function read(path: string): Promise<string>;
declare function readSync(path: string): string;

type Options = {
    sanity?: boolean;
};
declare function write(path: string, data: string, options?: Options): Promise<string | undefined>;

export { clean, getRelativePath, read, readSync, write };
