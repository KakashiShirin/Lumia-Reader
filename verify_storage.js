import fetch from 'node-fetch';

const storeUrl = 'http://localhost:3005/store';
const testKey = 'test_key_' + Date.now();
const testData = { message: 'Hello World', timestamp: Date.now() };

async function verifyStorage() {
    try {
        console.log('Testing Storage...');

        // 1. Save
        console.log(`Saving to ${testKey}...`);
        const saveRes = await fetch(`${storeUrl}/${testKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        if (!saveRes.ok) throw new Error(`Save failed: ${saveRes.status}`);
        console.log('Save successful');

        // 2. Load
        console.log(`Loading from ${testKey}...`);
        const loadRes = await fetch(`${storeUrl}/${testKey}`);
        if (!loadRes.ok) throw new Error(`Load failed: ${loadRes.status}`);

        const loadedData = await loadRes.json();
        console.log('Loaded data:', loadedData);

        if (loadedData.message === testData.message) {
            console.log('SUCCESS: Data persistence verified!');
        } else {
            console.error('FAIL: Data mismatch');
            process.exit(1);
        }

    } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}

verifyStorage();
