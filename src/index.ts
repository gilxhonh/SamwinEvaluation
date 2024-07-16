import { UmlautConverter } from './classes/UmlautConverter';

(async () => {
    const umlautConverter = new UmlautConverter();
    try {
        await umlautConverter.createTable();
    } catch (err) {
        console.error('Error:', err);
    }

    console.log("\nExample 1:")
    console.log(umlautConverter.replaceUmlauts('KOESTNER'));
    console.log(umlautConverter.replaceUmlauts('RUESSWURM'));

    console.log("\nExample 2:")
    console.log(umlautConverter.generateVariations('KOESTNER'));
    console.log(umlautConverter.generateVariations('RUESSWURM'));

    console.log("\nExample 3:")
    console.log(umlautConverter.generateSQL('KOESTNER'));

    console.log(umlautConverter.generateSQL('RUESSWURM'));

    console.log("\nExecute the queries generated 3:")
    await umlautConverter.executeQuery('KOESTNER');
    await umlautConverter.executeQuery('RUESSWURM');

    umlautConverter.closeConnection();
})();
