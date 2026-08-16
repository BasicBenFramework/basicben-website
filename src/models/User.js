import { getDb, query } from '@basicbenframework/core/db'

// Columns update() may write. Without this, passing req.body straight through
// would let a caller set any column at all.
const UPDATABLE = ['name', 'email', 'password']

export const User = {
  async all() {
    const db = await getDb()
    return db.all('SELECT * FROM users')
  },

  async find(id) {
    const db = await getDb()
    return db.get('SELECT * FROM users WHERE id = ?', [id])
  },

  async findByEmail(email) {
    const db = await getDb()
    return db.get('SELECT * FROM users WHERE email = ?', [email])
  },

  async create(data) {
    // Goes through the query builder so Postgres gets a RETURNING clause and
    // the new id comes back — a raw INSERT yields a null id there, which would
    // mint a token for a nonexistent user.
    const users = await query('users')
    const result = await users.insert(data)
    return { id: result.lastInsertRowid, ...data }
  },

  async update(id, data) {
    const db = await getDb()
    const entries = Object.entries(data).filter(([k]) => UPDATABLE.includes(k))

    if (entries.length === 0) {
      return this.find(id)
    }

    const fields = entries.map(([k]) => `${k} = ?`).join(', ')
    await db.run(
      `UPDATE users SET ${fields} WHERE id = ?`,
      [...entries.map(([, v]) => v), id]
    )
    return this.find(id)
  },

  async delete(id) {
    const db = await getDb()
    return db.run('DELETE FROM users WHERE id = ?', [id])
  }
}
