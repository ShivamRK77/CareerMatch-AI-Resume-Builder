const http = require('http');

const endpoints = [
    { path: '/auth/login', method: 'POST' },
    { path: '/auth/register', method: 'POST' },
    { path: '/applications', method: 'GET' },
    { path: '/api/interview/start', method: 'POST' },
    { path: '/chat', method: 'POST' },
    { path: '/scan-job', method: 'POST' }, // From jobRoutes
];

const testEndpoint = (endpoint) => {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: endpoint.path,
            method: endpoint.method,
            headers: {
                'Content-Type': 'application/json',
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // If it returns 200 or 400/401/404 (due to missing body/auth), it means the route exists.
                // If it returns 404 (Cannot POST), the route doesn't exist.
                resolve({ path: endpoint.path, status: res.statusCode, exists: res.statusCode !== 404 });
            });
        });

        req.on('error', (e) => {
            resolve({ path: endpoint.path, status: 'ERROR', exists: false, error: e.message });
        });
        
        req.write(JSON.stringify({}));
        req.end();
    });
};

const runTests = async () => {
    console.log("Starting Endpoint Verification...");
    let allPassed = true;
    for (const ep of endpoints) {
        const res = await testEndpoint(ep);
        if (!res.exists || res.status === 'ERROR') {
            console.log(`❌ FAILED: ${ep.method} ${ep.path} (Status: ${res.status})`);
            allPassed = false;
        } else {
            console.log(`✅ PASSED: ${ep.method} ${ep.path} (Status: ${res.status})`);
        }
    }
    
    if (allPassed) {
        console.log("\n✅ All routes are registered and responding.");
    } else {
        console.log("\n⚠️ Some routes failed.");
    }
};

runTests();
