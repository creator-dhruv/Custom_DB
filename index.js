import fs from 'fs/promises'

async function db(op, a, b, c) {
    db.s ||= Object.create(null)
    db.i ||= Object.create(null)
    db.q ||= Promise.resolve()
    return db.q = db.q.then(async () => ({
        set: async () => {
            let old = db.s[a]
            if (old && typeof old == 'object')
                for (let k in old) db.i[k]?.[old[k]]?.delete(a)
            db.s[a] = b
            if (b && typeof b == 'object')
                for (let k in b) {
                    db.i[k] ||= Object.create(null)
                    db.i[k][b[k]] ||= new Set()
                    db.i[k][b[k]].add(a)
                } return b
        },
        get: async () => {
            if (db.s[a]) {
                return db.s[a]
            } else {
                return "Not Found"
            }
        },
        del: async () => {
            let v = db.s[a]
            if (v && typeof v == 'object')
                for (let k in v) db.i[k]?.[v[k]]?.delete(a)
            return delete db.s[a]
        },
        has: async () => a in db.s,
        keys: async () => Object.keys(db.s),
        vals: async () => Object.values(db.s),
        all: async () => db.s,
        clr: async () => (db.s = Object.create(null),
            db.i = Object.create(null), true),
        inc: async () => (db.s[a] = (db.s[a] || 0) + (b || 1)),
        push: async () => (
            (db.s[a] ||= []).push(b),
            db.s[a]
        ),
        pop: async () => db.s[a]?.pop(),
        find: async () => {
            if (db.i[a]?.[b]) return [...db.i[a][b]].map(x => db.s[x])
            return Object.values(db.s).filter(x => x && x[a] === b)
        },
        where: async () => {
            let m = (a + '').match(/(.+?)(=|>|<)(.+)/)
            if (!m) return []
            let [, f, o, v] = m
            return Object.values(db.s).filter(x => {
                if (!x || !(f in x)) return false
                return o == '=' ? x[f] == v : o == '>' ? x[f] > v : x[f] < v
            })
        },
        save: async () => {
            await fs.writeFile(a, JSON.stringify(db.s, null, 2))
            return true
        },
        load: async () => {
            db.s = JSON.parse(await fs.readFile(a, 'utf8'))
            db.i = Object.create(null)
            for (let id in db.s) {
                let v = db.s[id]
                if (v && typeof v == 'object')
                    for (let k in v) {
                        db.i[k] ||= Object.create(null)
                        db.i[k][v[k]] ||= new Set()
                        db.i[k][v[k]].add(id)
                    }
            }
            return db.s
        }
    })[op]?.() || `${op} function is not supported`)
}



await db('set', 'user_1', { name: 'Hardeep', age: 22, city: 'Delhi' })  // Set key-value pair
await db('set', 'user_1', { name: 'Dhruv', age: 20, city: 'Delhi' })  // Reassign key-value pair
await db('set', 'user_2', { name: 'Harsh', age: 30, city: 'Mumbai' })
await db('set', 'user_3', { name: 'Aryan', age: 22, city: 'Delhi' })
console.log(await db('get', 'user_1'))  // Get value of user_1 
console.log(await db('find', 'age', 22))  // Find users whose age is 22
console.log(await db('where', 'age>20'))  // Find users whose age is greater than 20
console.log(await db('where', 'age=20'))  // Find users whose age is equal than 20
console.log(await db('where', 'age<25'))  // Find users whose age is lower than 25
await db('inc', 'visits', 1)  // Increment the value of visit by 1
await db('inc', 'visits', 1)  // Increment the value of visit by 1
console.log(await db('get', 'visits')) // Get value of visit
await db('push', 'Array', 'start')  // Push the value in Array
await db('push', 'Array', 'stop')  // Push the value in Array
console.log(await db('get', 'Array')) // Get the value of Array
await db('save', 'db.json') // Save data in JSON file
await db('save', 'db.pdf') // Save data in PDF file
console.log(await db('load', 'db.pdf')) // Load file data
console.log(await db('lod', 'db.pdf')) // Wrong function called