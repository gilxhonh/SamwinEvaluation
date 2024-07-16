import { Client } from 'pg';
import { dbConfig } from '../config/dbConfig';
import { Replacements } from '../types';

export class UmlautConverter {
    private replacements: Replacements = {
        'AE': 'Ä',
        'OE': 'Ö',
        'UE': 'Ü',
        'SS': 'ß'
    };

    private client: Client;

    constructor() {
        this.client = new Client(dbConfig);
        this.client.connect();
    }

    // Step 1: Convert replacement letters into their umlaut counterparts
    public replaceUmlauts(name: string): string {
        let result = name;
        for (const [replacement, umlaut] of Object.entries(this.replacements)) {
            result = result.replace(new RegExp(replacement, 'g'), umlaut);
        }
        return result;
    }

    // Step 2: Generate all possible variations of a given name
    public generateVariations(name: string): string[] {
        const variations: Set<string> = new Set([name]);

        const generate = (name: string, start: number): void => {
            for (const [replacement, umlaut] of Object.entries(this.replacements)) {
                const index = name.indexOf(replacement, start);
                if (index !== -1) {
                    const newName = name.substring(0, index) + umlaut + name.substring(index + replacement.length);
                    variations.add(newName);
                    generate(newName, index + 1);
                }
            }
        };

        generate(name, 0);
        return Array.from(variations);
    }

    // Step 3: Generate SQL statement to search for all variations of a given name

    public generateSQL(name: string): string {
        const variations = this.generateVariations(name);
        const conditions = variations.map(variation => `last_name = '${variation}'`).join(' OR ');
        return `SELECT * FROM tbl_phonebook WHERE ${conditions};`;
    }

    public async executeQuery(name: string): Promise<void> {
        const query = this.generateSQL(name);
        try {
            const res = await this.client.query(query);
            console.log(res.rows);
        } catch (err) {
            console.error(err);
        }
    }

    public async createTable(): Promise<void> {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tbl_phonebook (
            id SERIAL PRIMARY KEY,
            last_name VARCHAR(100) NOT NULL
        );
    `;

        const insertNamesQuery = `
        INSERT INTO tbl_phonebook (last_name) VALUES
        ('KÖSTNER'),
        ('RÜßWURM'),
        ('DUERMUELLER'),
        ('JAEAESKELAEINEN'),
        ('GROSSSCHAEDL');
    `;

        try {
            await this.client.query(createTableQuery);
            console.log('Table tbl_phonebook created or already exists.');

            await this.client.query(insertNamesQuery);
            console.log('Names inserted successfully!');
        } catch (err) {
            console.error('Error creating table or inserting names:', err);
        }
    }



    public closeConnection(): void {
        this.client.end();
    }
}
