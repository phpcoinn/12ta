# 12Ta Game Manual

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Resources](#resources)
4. [Resource Production & Upgrades](#resource-production--upgrades)
5. [Crafting](#crafting)
6. [Heroes](#heroes)
7. [Equipment](#equipment)
8. [Trading Marketplace](#trading-marketplace)
9. [World Map & Territories](#world-map--territories)
10. [Battle System](#battle-system)
11. [Hero Professions (Attacker)](#hero-professions-attacker)
12. [Hero Professions (Defender)](#hero-professions-defender)
13. [Hero Skills & Passive Abilities](#hero-skills--passive-abilities)
14. [PHPCoin Costs Reference](#phpcoin-costs-reference)
15. [Timing & Block Schedule](#timing--block-schedule)

---

## Overview

12Ta is a decentralized strategy game built on the PHPCoin blockchain. Every action you take in the game is a real blockchain transaction. The game server (called the "oracle") reads the blockchain and processes your transactions into game state.

The game combines resource management, hero collection, equipment crafting, player-to-player trading, and tower defense battles over territory control.

---

## Getting Started

### Step 1: Create a Key Pair

When you first open the game, you'll be on the login screen. Click "Create" to generate a new key pair:

- **Public Key** — your identity on the blockchain
- **Private Key** — used to sign your transactions (keep this secret!)
- **Wallet Address** — your in-game address (starts with "P")

**Save your keys immediately.** If you lose your private key, you lose access to your account permanently. There is no recovery mechanism.

### Step 2: Fund Your Wallet

You need PHPCoin in your wallet to play. You'll need at least **10 PHPCoin** to create an account, plus extra for gas fees and optional silver coin minting.

### Step 3: Create Your Account

Send a "CreatePeople" transaction to register. This costs **10 PHPCoin** and gives you:

- A registered account in the game
- A "monthly card" valid for **1,000 blocks** (~16 hours)
- Starting resources: all at 0
- Starting resource production rate: +1 per block for grain, wood, iron ore, and warrior
- Starting resource storage ceiling: 1,500 for each primary resource
- Starting resource levels: all at level 1

### Step 4: Renew Your Monthly Card

Your monthly card determines whether your resources grow. Once it expires, resource production stops. Renew it before it runs out.

- **Renewal cost**: 500 to 1,000 PHPCoin (decreases each year, minimum 500)
- **Duration**: adds **100,000 blocks** (~69 days) to your card
- **Cost formula**: `1000 - (floor((currentBlock - 1352500) / 525600) * 50)`, minimum 500

If your card is still active when you renew, the new blocks are added on top of the remaining time.

---

## Resources

### Primary Resources

These are generated automatically every block while your monthly card is active.

| Resource | Starting Rate | Starting Ceiling | Used For |
|----------|--------------|-----------------|----------|
| **Grain** | +1/block | 1,500 | Upgrades, crafting vodka, trading |
| **Wood** | +1/block | 1,500 | Upgrades, crafting, trading |
| **Iron Ore** | +1/block | 1,500 | Upgrades, crafting refined iron, trading |
| **Warrior** | +1/block | 1,500 | Upgrades, crafting, joining wars, trading |

Primary resources are **capped** by their ceiling. Once you hit the ceiling, production stops for that resource until you spend some or upgrade the ceiling.

### Crafted Resources

These are not generated automatically. You must convert primary resources into them.

| Resource | How to Obtain |
|----------|--------------|
| **Silver Coin** | Mint with PHPCoin (year 1 only), territory income, trading |
| **Refined Iron** | Craft from iron ore + wood + warrior |
| **Vodka** | Craft from grain + wood + warrior |

### Silver Coins

Silver coins are the most important resource in the game. They are required for:
- Creating heroes
- Creating equipment
- Resource upgrades
- Trading

---

## Resource Production & Upgrades

### How Production Works

Every block, the oracle runs this update for all players with an active monthly card:

```
grain   = min(grain + addGrain, grainCeiling)
wood    = min(wood + addWood, woodCeiling)
ironOre = min(ironOre + addIronOre, ironOreCeiling)
warrior = min(warrior + addWarrior, warriorCeiling)
```

Your `addGrain`, `addWood`, etc. start at 1. Equipment can increase these rates.

### Upgrading Resource Levels

You can upgrade each resource type independently. Upgrading increases the **storage ceiling** for the next level.

**Upgrade cost formula:**

```
baseCost = (ceil(level / 10)^3 / (ceil(level / 10) / 2)) * level * 450
```

Each resource type has different cost ratios:

| Upgrading | Grain Cost | Wood Cost | Iron Ore Cost | Silver Coin Cost |
|-----------|-----------|-----------|--------------|-----------------|
| **Grain** | baseCost / 5 | baseCost / 2 | baseCost / 5 | baseCost / 10 |
| **Wood** | baseCost / 2 | baseCost / 5 | baseCost / 5 | baseCost / 10 |
| **Iron Ore** | baseCost / 5 | baseCost / 5 | baseCost / 2 | baseCost / 10 |
| **Warrior** | baseCost / 5 | baseCost / 5 | baseCost / 5 | baseCost / 5 |

You must have **all four resources** in sufficient quantity for the upgrade to succeed. The new ceiling is calculated using the formula at (currentLevel + 2).

**Example costs for early levels:**

| Level | Base Cost | Grain (upgrading grain) | Wood | Iron Ore | Silver Coin |
|-------|-----------|------------------------|------|----------|-------------|
| 1→2 | 900 | 180 | 450 | 180 | 90 |
| 2→3 | 1,800 | 360 | 900 | 360 | 180 |
| 3→4 | 2,700 | 540 | 1,350 | 540 | 270 |
| 5→6 | 4,500 | 900 | 2,250 | 900 | 450 |
| 10→11 | 9,000 | 1,800 | 4,500 | 1,800 | 900 |

Each upgrade costs **0.01 PHPCoin** as a gas fee.

---

## Crafting

### Refined Iron

Convert primary resources into refined iron, which is needed for creating equipment.

| Input | Amount |
|-------|--------|
| Iron Ore | 50,000 |
| Wood | 20,000 |
| Warrior | 10,000 |
| **Output: Refined Iron** | **100** |
| PHPCoin gas fee | 0.01 |

### Vodka

Convert primary resources into vodka, which is needed for creating heroes.

| Input | Amount |
|-------|--------|
| Grain | 10,000 |
| Wood | 30,000 |
| Warrior | 40,000 |
| **Output: Vodka** | **100** |
| PHPCoin gas fee | 0.01 |

### Silver Coin Minting (Year 1 Only)

During the first year of the game (blocks 1,352,500 to 1,878,100), you can convert PHPCoin directly into silver coins.

| Input | Output |
|-------|--------|
| 1,000 PHPCoin | 50,000 Silver Coins |

There is **no limit** on how many times you can do this. This option is permanently removed after block 1,878,100.

**There is no way to convert silver coins back into PHPCoin.**

---

## Heroes

Heroes are the core combat units in the game. Each hero has unique stats determined by the blockchain.

### Creating a Hero

| Requirement | Amount |
|------------|--------|
| Silver Coins | 60,000 - 160,000 (increases yearly) |
| Vodka | 100 - 200 (increases yearly) |
| PHPCoin gas fee | 0.01 |

**Yearly cost scaling:**
- Silver coin cost: `60,000 + (yearsSinceStart * 10,000)`, max 160,000
- Vodka cost: `100 + (yearsSinceStart * 10)`, max 200
- Year = `floor((currentBlock - 1352500) / 525600)`

### Hero Stats

Hero stats are **deterministically generated** from the blockchain transaction hash. You cannot choose your hero's attributes — they are derived from the on-chain data. This means every hero is unique and cannot be duplicated.

Each hero has **14 attributes** encoded as a string like `2_3_7_11_5_4_8_6_2_9_142_156_148_130`:

| Index | Attribute | Range | Meaning |
|-------|-----------|-------|---------|
| 0 | Body type | 0-4 | Visual appearance |
| 1 | Hand type | 0-4 | Visual appearance |
| 2 | **Profession** | 0-11 | Combat class (see Battle System) |
| 3 | Eye type | 0-16 | Visual / skill slot 1 |
| 4 | Mouth type | 0-16 | Visual / skill slot 2 |
| 5 | Ear type | 0-11 | Visual appearance |
| 6-9 | Misc attributes | 0-11 | Additional visual/stat modifiers |
| 10 | Attack seed | 94-188 | Used in damage formula |
| 11 | Defense seed | 94-188 | Used in defense/range formula |
| 12 | Speed seed | 94-188 | Used in speed formula |
| 13 | HP seed | 94-188 | Used in health formula |

### Stat Formulas

The seed values (indices 10-13) are converted into actual combat stats:

- **Attack**: `trunc(sqrt(seed² / 1.5) + sqrt(seed² / 1.6) + sqrt(seed² / 1.7))`
- **Defense/Range**: `trunc(sqrt(seed) + sqrt(seed²))`
- **Speed**: `trunc((sqrt((seed * 0.025) / 60) + seed / 100) * 55)`
- **HP**: `trunc(seed * 6.72)`

### Hero Slots

You can assign up to **5 heroes** to your war team (warHeroes1 through warHeroes5). Your war team is used for both attacking and defending territories.

---

## Equipment

Equipment boosts your resource production rates. Each piece of equipment increases one of your `addGrain`, `addWood`, `addIronOre`, or `addWarrior` values.

### Creating Equipment

| Requirement | Amount |
|------------|--------|
| Silver Coins | 60,000 - 160,000 (same scaling as heroes) |
| Refined Iron | 100 - 200 (same scaling as heroes) |
| PHPCoin gas fee | 0.01 |

### Equipment Properties

Equipment has 3 properties derived from the transaction hash:

| Property | Range | Meaning |
|----------|-------|---------|
| **Equipment Type** | 0-7 | Which slot it goes in (8 slots total) |
| **Attribute Type** | 0-3 | Which resource it boosts (0=grain, 1=wood, 2=ironOre, 3=warrior) |
| **Attribute Value** | 1-20 | How much it increases production per block |

### Equipping Items

- You have **8 equipment slots** (equipment1 through equipment8)
- Each equipment type (0-7) corresponds to a specific slot
- When you equip a new item, it replaces the one in that slot
- The old item's bonus is removed and the new item's bonus is applied
- You can only equip items you own

---

## Trading Marketplace

The marketplace lets players trade resources, heroes, and equipment with each other.

### Trade Types

| Type Code | What You Trade |
|-----------|---------------|
| 1-199 | Resources for resources |
| 200 | Equipment for silver coins |
| 300 | Heroes for silver coins |

### Selling Resources (type 1-199)

1. Choose which resource to sell and the quantity
2. Choose which resource you want in return and the quantity
3. Pay **0.01 PHPCoin** gas fee
4. Your offered resource is deducted immediately and held in escrow
5. The listing appears on the marketplace

### Selling Equipment (type 200)

1. Choose the equipment to sell
2. Set a silver coin price
3. Pay **0.01 PHPCoin** gas fee
4. The equipment is locked (cannot be worn while listed)

### Selling Heroes (type 300)

1. Choose the hero to sell
2. Set a silver coin price
3. Pay **0.01 PHPCoin** gas fee
4. The hero is locked (cannot be assigned to war team while listed)
5. Heroes currently assigned to your war team cannot be listed

### Buying

1. Browse active listings on the marketplace
2. Send a "buy" transaction referencing the listing ID
3. Pay **0.01 PHPCoin** gas fee
4. Resources/items are transferred automatically
5. You **cannot buy your own listings**

### Cancelling a Listing

- Pay **1.00 PHPCoin** to cancel a listing
- For resource trades, your escrowed resources are returned
- For equipment/hero trades, the item is unlocked

---

## World Map & Territories

The world contains **64 territories**, each named after an asteroid (e.g., "1980 MW 123", "2001 LM 520").

### Territory Benefits

Players who occupy a territory receive **+4,000 silver coins every 100 blocks** (~2.8 hours). This is the primary ongoing source of silver coins after year 1.

### How Territory Wars Work

1. **Join a war**: Send a "joinWar" transaction specifying which territory to contest
   - Costs **80,000 warriors** (deducted from your resources)
   - Costs **0.01 PHPCoin** gas fee
   - Registration only accepted during the first 34 blocks of each 100-block cycle
2. **Battle resolution**: At blocks 35-98 of each 100-block cycle, the oracle automatically resolves battles for each territory
3. **Tournament format**: If multiple players challenge a territory, battles are run as a bracket tournament (up to 5 rounds)
4. **Winner takes the territory** and holds it until the next war cycle

### War Timing

Every 100 blocks:
- Blocks 0-34: Registration period (join wars)
- Blocks 35-98: Battles are resolved (one territory per block, territories 1-64)
- Block 99: Cycle resets, territory income distributed

---

## Battle System

Battles use a **tower defense** format. The defender places heroes as stationary "cannons" on a map. The attacker sends heroes as "formation" units that walk along a path.

### Setup

- **Defender**: 5 heroes placed at positions on the battle map
- **Attacker**: 25 formation units (5 hero types × 5 waves) sent along a path

### How Combat Plays Out

1. Attacker units spawn one at a time based on formation timing
2. Each unit walks along the path at its speed
3. Defender cannons target units within their range
4. Cannons fire based on their attack speed: `attackInterval = 75 / cannonSpeed`
5. Damage is calculated: `damage = cannonAttack - unitDefense` (minimum 1)
6. Elemental damage is added on top: `cannonAttack * (elementValue / 100)` for each element
7. Shields absorb damage before HP
8. When a unit's HP reaches 0, it dies

### Win Condition

- If the defender **kills more than 20** of the 25 attacker units → **Defender wins**
- If 5 or more attacker units survive → **Attacker wins**

### Tournament Bracket

When multiple players contest a territory:
- Round 1: Current occupant (defender) vs each challenger
- Round 2+: Winners face off in pairs until one champion remains
- The occupant has the advantage of defending in round 1
- Up to 5 rounds of elimination

---

## Hero Professions (Attacker)

When heroes are used as attacker formation units:

| ID | Profession | Role | Passive Ability |
|----|-----------|------|----------------|
| 0 | **Thief** | Debuffer | On spawn: reduces all enemy cannon stats by 3% per stack (max 10 stacks) |
| 2 | **Mercenary** | Self-sustain | When HP drops below thresholds, triggers self-buffs (shield, heal, speed, defense) |
| 3 | **Nurse** | Team buffer | On spawn: buffs all allied units' shield/HP/defense/speed by 3-6% |
| 4 | **Courier** | Debuffer | Every 5 hits taken: reduces the attacking cannon's stats by 5%. Every 3 hits: gains shield |
| 5 | **Doctor** | Healer | Every 5 hits taken: self-heals 10% max HP. At 15 hits: heals all allies 30% max HP |
| 6 | **Captain** | Death buffer | On death: buffs all surviving allies' stats by 5% (speed, HP, shield, defense) |
| 7 | **Programmer** | Amplifier | Doubles the buff ratios received from Nurse and Electrician |
| 8 | **Electrician** | Late-game buffer | At 30% path: buffs allies' defense/speed by 2-4%. At 70% path: self-heals 40% max HP |
| 9 | **Teacher** | Late-game buffer | At 50% path: buffs allies' HP/shield by 2-4%. At 80% path: self-buffs defense ×1.15 and speed ×1.1 |
| 10 | **Athletes** | Death debuffer | On death: reduces all enemy cannons' stats by 4% |
| 11 | **Driver** | Ally buffer | When any ally dies: self-buffs 6% (HP, defense, shield, or speed). After 15 stacks: +20% speed burst |

---

## Hero Professions (Defender)

When heroes are used as defender cannons:

| ID | Profession | Role | Passive Ability |
|----|-----------|------|----------------|
| 0 | **Thief** | Pre-debuffer | Before battle: reduces all enemy units' stats by 5% |
| 1 | **Engineer** | Kill scaler | On each kill: buffs all friendly cannons by 1% (range, attack, speed, or maxHP). After 9 kills: +10% speed to all |
| 2 | **Mercenary** | Self-buffer | At start: +15% to one stat (attack, range, speed, or HP). Can block enemy Thief debuffs |
| 3 | **Nurse** | Team buffer | At start: buffs all friendly cannons (except Mercenary): +20% speed, +15% attack, +15% HP, +10% range, or +5 elements |
| 4 | **Courier** | Kill scaler | Every 5 kills: self-buffs 2-4% (HP, maxHP, attack, range, or speed). Max 10 stacks |
| 5 | **Doctor** | Adjacent buffer | At start: buffs adjacent cannons (within 1 tile): +40% speed, +30% attack, +30% HP, +20% range, or +10 elements |
| 6 | **Captain** | Target debuffer | On hit: slows targeted enemy unit by 30% of cannon speed (targets specific professions based on skill) |
| 7 | **Programmer** | Periodic buffer | Every 5 attacks: buffs all friendly cannons by 1-2% (speed, range, attack, maxHP, or heals). Max 10 stacks |
| 8 | **Electrician** | HP-threshold debuffer | As enemy HP drops below thresholds (90%, 80%, 70%, 60%, 20%): reduces their stats by 10-20% |
| 9 | **Teacher** | Kill scaler | On each kill: self-buffs 3% (range, attack, speed, or HP). After 7 kills: +15% attack burst |
| 10 | **Athletes** | Elemental | At start: adds +15 to an elemental damage type (gold, wood, water, fire, soil) |
| 11 | **Driver** | Path debuffer | As enemy passes distance thresholds (10%, 20%, 30%, 40%, 80%): reduces their stats by 10-20% |

---

## Hero Skills & Passive Abilities

Each hero has **two skill slots** (determined by attributes at index 3 and 4 of their hero value). Skills modify base stats:

### Attacker (Formation) Skills

| Skill ID | Single Slot | Double Slot (both same) |
|----------|------------|------------------------|
| 0 | HP ×1.3 | HP ×1.6 |
| 1 | HP ×1.5 | HP ×2.0 |
| 2 | HP ×1.7 | HP ×2.4 |
| 3 | Speed ×1.05 | Speed ×1.1 |
| 4 | Speed ×1.1 | Speed ×1.2 |
| 5 | Speed ×1.15 | Speed ×1.3 |
| 6 | Defense ×1.05 | Defense ×1.1 |
| 7 | Defense ×1.1 | Defense ×1.2 |
| 8 | Defense ×1.15 | Defense ×1.3 |
| 9 | Attack ×1.1 | Attack ×1.2 |
| 10 | Attack ×1.2 | Attack ×1.4 |
| 11 | Attack ×1.3 | Attack ×1.6 |
| 12 | Shield +20% max HP | Shield +40% max HP |
| 13 | Shield +30% max HP | Shield +60% max HP |
| 14 | Shield +40% max HP | Shield +80% max HP |
| 15 | Anti-tempt (immune to certain debuffs) | Same |
| 16 | Anti-crit (immune to elemental damage) | Same |

If both skill slots have the **same skill**, the effect is doubled (the "Double Slot" column). Otherwise each applies independently at single strength.

### Defender (Cannon) Skills

| Skill ID | Single Slot | Double Slot |
|----------|------------|-------------|
| 0 | HP ×1.3 | HP ×1.6 |
| 1 | HP ×1.5 | HP ×2.0 |
| 2 | HP ×1.7 | HP ×2.4 |
| 3 | Speed ×1.05 | Speed ×1.1 |
| 4 | Speed ×1.1 | Speed ×1.2 |
| 5 | Speed ×1.15 | Speed ×1.3 |
| 6 | Range ×1.05 | Range ×1.1 |
| 7 | Range ×1.1 | Range ×1.2 |
| 8 | Range ×1.15 | Range ×1.3 |
| 9 | Attack ×1.1 | Attack ×1.2 |
| 10 | Attack ×1.2 | Attack ×1.4 |
| 11 | Attack ×1.3 | Attack ×1.6 |
| 12 | Gold element +15 | Gold element +30 |
| 13 | Wood element +15 | Wood element +30 |
| 14 | Water element +15 | Water element +30 |
| 15 | Fire element +15 | Fire element +30 |
| 16 | Soil element +15 | Soil element +30 |

Note: Professions 3 (Nurse) and 5 (Doctor) in defender role have their range set to 0, meaning they cannot attack directly but provide support buffs.

---

## PHPCoin Costs Reference

| Action | PHPCoin Cost | Notes |
|--------|-------------|-------|
| Create account | **10.00** | One-time |
| Renew monthly card | **500 - 1,000** | Decreases yearly, minimum 500 |
| Mint silver coins | **1,000** → 50,000 silver | Year 1 only, unlimited uses |
| Send resources | 0.01 | Per transaction |
| Craft refined iron | 0.01 | Per batch |
| Craft vodka | 0.01 | Per batch |
| Create hero | 0.01 | Plus silver coins + vodka |
| Assign hero to slot | 0.01 | |
| Create equipment | 0.01 | Plus silver coins + refined iron |
| Equip item | 0.01 | |
| Upgrade resource level | 0.01 | Plus resources |
| List item for sale | 0.01 | |
| Buy from marketplace | 0.01 | Plus the listed price |
| Cancel listing | **1.00** | |
| Set team formation | 0.01 | |
| Join territory war | 0.01 | Plus 80,000 warriors |

---

## Timing & Block Schedule

The game runs on **PHPCoin block time** (~1 minute per block).

| Interval | Blocks | Real Time (approx) | What Happens |
|----------|--------|-------------------|-------------|
| Every block | 1 | ~1 min | Resources generated for all active players |
| Every 100 blocks | 100 | ~1.7 hours | Territory wars resolved, +4,000 silver to territory holders, war resource update |
| Every 2,000 blocks | 2,000 | ~1.4 days | Old block data backed up and cleaned |
| Every 525,600 blocks | 525,600 | ~1 year | Hero/equipment costs increase, renewal costs decrease |

### Key Block Numbers

| Block | Significance |
|-------|-------------|
| 1,352,500 | Game launch (indexStartPay) |
| 1,878,100 | Silver coin minting ends (1 year after launch) |

### Monthly Card Duration

| Type | Duration | Blocks |
|------|----------|--------|
| Initial (CreatePeople) | ~16 hours | 1,000 |
| Renewal | ~69 days | 100,000 |

---

## Tips for New Players

1. **Renew your monthly card early** — if it expires, your resources stop growing and you lose production time.

2. **Upgrade warrior production first** — warriors are needed for crafting both vodka and refined iron, and for joining wars (80,000 per war). The warrior upgrade has equal cost ratios across all resources, making it balanced.

3. **Mint silver coins while you can** — the 1,000 PHPCoin → 50,000 silver coins exchange is only available in the first year. Silver coins are the bottleneck for heroes and equipment.

4. **Build resources before creating heroes** — heroes cost 60,000+ silver coins and 100+ vodka. Make sure you have enough before attempting to create one.

5. **Equipment boosts production** — each piece of equipment increases your resource generation per block. Equipping early means more resources over time.

6. **Territory income is significant** — holding even one territory gives you 4,000 silver coins every ~1.7 hours. That's ~56,000 silver coins per day, which adds up fast.

7. **Check hero professions carefully** — when creating or buying heroes, their profession (index 2 of hero value) determines their role in battle. Build a balanced team with complementary professions.

8. **Use the marketplace** — trading resources with other players can help you get what you need faster than producing everything yourself.
