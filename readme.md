# 🪐 PlutoDB

> **What it does:** A hyper-compact, async-safe JavaScript in-memory database built entirely within a single function.

Welcome to **PlutoDB**! This project was engineered for the **Code Olympics 2026 Challenge**. It packs a transactional, indexed document store with query evaluation, atomic math, and file persistence into a tiny, ultra-constrained footprint.

---

### 🏆 The Challenge Constraints

*   **Single-Function Master:** Core database logic exists in exactly *one* function (`db`).
*   **Standard Maker Line Budget:** Fits comfortably well under the 200-line restriction.
*   **No Heavy Dependencies:** Relies purely on modern Node.js and native JS prototypes.

---

### ✨ Features

*   ⚡ **Atomic Queue Execution:** All operations run sequentially through a built-in promise chain to prevent race conditions.
*   🔍 **Automated Secondary Indexing:** Dynamically indexes nested object fields for blazing fast lookup speeds.
*   🔮 **Flexible Queries:** Supports direct filtering (`find`) and operator evaluation (`where` queries like `age>20`).
*   💾 **Native Persistence:** Easily back up or seed your collection using native JSON storage.

---

### 🛠️ Quick Start

Get your database running in seconds.

1. **Setup your file structure:**
   Ensure your `package.json` contains `"type": "module"`. Save the source code into `index.js`.

2. **Install dependencies:**
   No external packages needed! Just native Node.js.
   ```bash
   npm install
   ```

3. **Fire it up:**
   ```bash
   node index.js
   ```

---

### 🎈 Usage Examples

PlutoDB uses a direct `(operation, argumentA, argumentB, argumentC)` API syntax.

```javascript
import { db } from './index.js';

// 1. Insert or update a document
await db('set', 'user_1', { name: 'Dhruv', age: 20, city: 'Delhi' });
await db('set', 'user_2', { name: 'Harsh', age: 30, city: 'Mumbai' });

// 2. Fetch data by unique ID
const user = await db('get', 'user_1'); 

// 3. Query records using indexes
const delhiFolks = await db('find', 'city', 'Delhi');

// 4. Evaluate conditional queries (=, >, <)
const olderThan20 = await db('where', 'age>20');

// 5. Run atomic math and array utilities
await db('inc', 'visits', 1);
await db('push', 'logs', 'server_started');

// 6. Save data locally
await db('save', 'db.json');
```

---

### 📦 Supported API Operations


| Operation | Arguments | Description |
| :--- | :--- | :--- |
| `set` | `key, value` | Inserts or overwrites data; builds object indexes. |
| `get` | `key` | Returns data or `"Not Found"`. |
| `del` | `key` | Permanently deletes a key and updates indexes. |
| `has` | `key` | Returns boolean check of key existence. |
| `keys` / `vals` | *None* | Flattens keys or records into an array. |
| `all` | *None* | Exposes the entire raw memory store object. |
| `clr` | *None* | Completely wipes the database state and indexes. |
| `inc` | `key, [amount]` | Atomic increment for counters (defaults to +1). |
| `push` / `pop` | `key, value` | Quick array storage operations on a key. |
| `find` | `field, value` | Utilizes indexed lookups to find exact matches. |
| `where` | `expression` | Evaluates criteria matches like `field>value`. |
| `save` / `load` | `filename` | Persists or loads the dataset to/from disk. |


