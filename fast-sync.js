"use strict";

const { WsClient } = require("tsrpc");
const { serviceProto } = require("./shared/protocols/serviceProto");
const https = require("https");

const PHPCOIN_API = "https://main1.phpcoin.net/api.php";
const ORACLE_WS = "ws://localhost:3001";
const DUMMY_ADDRESS = "P00000000000000000000000000000000";
const BATCH_LOG_INTERVAL = 50;

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error(`JSON parse error: ${data.slice(0, 200)}`)); }
            });
        }).on("error", reject);
    });
}

async function getChainHeight() {
    const res = await fetchJSON(`${PHPCOIN_API}?q=currentBlock`);
    if (res.status !== "ok") throw new Error("Failed to get current block");
    return Number(res.data.height);
}

async function getBlock(height) {
    const res = await fetchJSON(`${PHPCOIN_API}?q=getBlock&height=${height}`);
    if (res.status !== "ok") return null;
    const block = res.data;
    const txArray = [];
    if (block.data) {
        for (const key in block.data) {
            txArray.push(block.data[key]);
        }
    }
    return { id: block.id, height: block.height, date: block.date, data: txArray };
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function main() {
    console.log("Connecting to oracle...");
    const client = new WsClient(serviceProto, {
        server: ORACLE_WS,
        json: true,
        heartbeat: { interval: 60000, timeout: 60000 },
        logMsg: false,
    });

    const connectResult = await client.connect();
    if (!connectResult.isSucc) {
        console.error("Failed to connect:", connectResult.errMsg);
        process.exit(1);
    }
    console.log("Connected to oracle.");

    let oracleHeight = null;

    client.listenMsg("Chat", (msg) => {
        if (msg.type === "20000") {
            oracleHeight = Number(msg.content);
        }
    });

    client.sendMsg("Chat", {
        type: "20000",
        other: "",
        content: "",
        time: new Date(),
    });

    await sleep(2000);

    if (oracleHeight === null) {
        console.error("Could not get oracle height. Is the oracle running?");
        process.exit(1);
    }

    const chainHeight = await getChainHeight();
    const blocksToSync = chainHeight - oracleHeight;

    console.log(`Oracle height:  ${oracleHeight}`);
    console.log(`Chain height:   ${chainHeight}`);
    console.log(`Blocks to sync: ${blocksToSync}`);

    if (blocksToSync <= 0) {
        console.log("Already synced!");
        process.exit(0);
    }

    const startTime = Date.now();
    let synced = 0;

    for (let h = oracleHeight + 1; h <= chainHeight; h++) {
        const block = await getBlock(h);
        if (!block) {
            console.error(`Failed to fetch block ${h}, retrying in 3s...`);
            await sleep(3000);
            h--;
            continue;
        }

        const content = JSON.stringify(block);
        client.sendMsg("Chat", {
            type: "10000",
            other: DUMMY_ADDRESS,
            content: content,
            time: new Date(),
        });

        synced++;

        if (synced % BATCH_LOG_INTERVAL === 0) {
            const elapsed = (Date.now() - startTime) / 1000;
            const rate = synced / elapsed;
            const remaining = chainHeight - h;
            const eta = Math.round(remaining / rate);
            const etaMin = Math.floor(eta / 60);
            const etaSec = eta % 60;
            console.log(`Block ${h}/${chainHeight} | ${synced} synced | ${rate.toFixed(1)} blocks/s | ETA: ${etaMin}m ${etaSec}s`);
        }

        await sleep(80);
    }

    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log(`\nDone! Synced ${synced} blocks in ${totalTime} minutes.`);

    await sleep(2000);
    process.exit(0);
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
