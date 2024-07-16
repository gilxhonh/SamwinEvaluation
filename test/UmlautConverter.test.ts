import { UmlautConverter } from '../src/classes/UmlautConverter';

describe('UmlautConverter', () => {
    const converter = new UmlautConverter();

    afterAll(() => {
        converter.closeConnection();
    });

    test('replaceUmlauts should convert replacement letters to umlauts', () => {
        expect(converter.replaceUmlauts('KOESTNER')).toBe('KÖSTNER');
        expect(converter.replaceUmlauts('RUESSWURM')).toBe('RÜßWURM');
    });

    test('generateVariations should generate all possible variations', () => {
        expect(converter.generateVariations('KOESTNER')).toContain('KÖSTNER');
        expect(converter.generateVariations('RUESSWURM')).toContain('RÜßWURM');
        expect(converter.generateVariations('RUESSWURM')).toContain('RUEßWURM');
        expect(converter.generateVariations('RUESSWURM')).toContain('RUESSWURM');
        expect(converter.generateVariations('RUESSWURM')).toContain('RÜSSWURM');
    });

    test('generateSQL should generate correct SQL query', () => {
        const sqlQuery = converter.generateSQL('RUESSWURM');
        expect(sqlQuery).toContain("SELECT * FROM tbl_phonebook WHERE");
        expect(sqlQuery).toContain("last_name = 'RUESSWURM'");
        expect(sqlQuery).toContain("OR last_name = 'RÜßWURM'");
        expect(sqlQuery).toContain("OR last_name = 'RUEßWURM'");
        expect(sqlQuery).toContain("OR last_name = 'RÜSSWURM'");
    });
});
