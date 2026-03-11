import { getDb } from '@basicbenframework/core/db'

export const Post = {
  async all() {
    const db = await getDb()
    return db.all('SELECT * FROM posts ORDER BY created_at DESC')
  },

  async find(id) {
    const db = await getDb()
    return db.get('SELECT * FROM posts WHERE id = ?', [id])
  },

  async findByUser(userId) {
    const db = await getDb()
    return db.all('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC', [userId])
  },

  async findPublished() {
    const db = await getDb()
    return db.all(`
      SELECT posts.*, users.name as author_name
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.published = 1
      ORDER BY posts.created_at DESC
    `)
  },

  async findPublishedById(id) {
    const db = await getDb()
    return db.get(`
      SELECT posts.*, users.name as author_name
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = ? AND posts.published = 1
    `, [id])
  },

  async create(data) {
    const db = await getDb()
    const result = await db.run(
      'INSERT INTO posts (user_id, title, content, published) VALUES (?, ?, ?, ?)',
      [data.user_id, data.title, data.content, data.published ? 1 : 0]
    )
    return { id: result.lastInsertRowid, ...data }
  },

  async update(id, data) {
    const db = await getDb()
    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ')
    await db.run(
      `UPDATE posts SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...Object.values(data), id]
    )
    return this.find(id)
  },

  async delete(id) {
    const db = await getDb()
    return db.run('DELETE FROM posts WHERE id = ?', [id])
  }
}
