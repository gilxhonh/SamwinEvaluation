export interface DBConfig {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
}

export type Replacements = {
    [key: string]: string;
};
