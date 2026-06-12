const { spawn } = require('child_process');

function runSync() {
    console.log(`[${new Date().toISOString()}] Starting fast-sync...`);
    const proc = spawn('node', ['fast-sync.js'], { stdio: 'inherit' });

    proc.on('close', (code) => {
        console.log(`[${new Date().toISOString()}] fast-sync exited with code ${code}. Waiting 60s...`);
        setTimeout(runSync, 60000);
    });
}

runSync();
