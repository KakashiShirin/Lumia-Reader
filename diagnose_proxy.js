import fetch from 'node-fetch';

const proxyBase = 'http://localhost:3005';

async function diagnose() {
    try {
        console.log('Checking GET /store/test...');
        const getRes = await fetch(`${proxyBase}/store/test`);
        console.log(`GET Status: ${getRes.status}`);
        const getText = await getRes.text();
        console.log(`GET Body: ${getText}`);

        console.log('Checking POST /store/test...');
        const postRes = await fetch(`${proxyBase}/store/test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foo: 'bar' })
        });
        console.log(`POST Status: ${postRes.status}`);
        const postText = await postRes.text();
        console.log(`POST Body: ${postText}`);

    } catch (e) {
        console.error('Connection failed:', e.message);
    }
}

diagnose();
