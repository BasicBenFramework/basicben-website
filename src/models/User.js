import { getDb } from '@basicbenframework/core/db'

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
    const db = await getDb()
    const result = await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [data.name, data.email, data.password]
    )
    return { id: result.lastInsertRowid, ...data }
  },

  async update(id, data) {
    const db = await getDb()
    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ')
    await db.run(
      `UPDATE users SET ${fields} WHERE id = ?`,
      [...Object.values(data), id]
    )
    return this.find(id)
  },

  async delete(id) {
    const db = await getDb()
    return db.run('DELETE FROM users WHERE id = ?', [id])
  }
}
