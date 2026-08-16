import { getDb, query } from '@basicbenframework/core/db'

// Columns update() may write.
const UPDATABLE = ['title', 'content', 'published']

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
    // Query builder rather than raw SQL so Postgres gets RETURNING id.
    const posts = await query('posts')
    const result = await posts.insert({
      user_id: data.user_id,
      title: data.title,
      content: data.content,
      published: data.published ? 1 : 0
    })
    return { id: result.lastInsertRowid, ...data }
  },

  async update(id, data) {
    const db = await getDb()
    const entries = Object.entries(data)
      .filter(([k]) => UPDATABLE.includes(k))
      .map(([k, v]) => (k === 'published' ? [k, v ? 1 : 0] : [k, v]))

    if (entries.length === 0) {
      return this.find(id)
    }

    const fields = entries.map(([k]) => `${k} = ?`).join(', ')
    await db.run(
      `UPDATE posts SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...entries.map(([, v]) => v), id]
    )
    return this.find(id)
  },

  async delete(id) {
    const db = await getDb()
    return db.run('DELETE FROM posts WHERE id = ?', [id])
  }
}
