import { validate, rules } from '@basicbenframework/core/validation'
import { Post } from '../models/Post.js'

export const PostController = {
  async index(req, res) {
    const posts = await Post.findByUser(req.userId)
    res.json({ posts })
  },

  async show(req, res) {
    const post = await Post.find(req.params.id)
    if (!post || post.user_id !== req.userId) {
      return res.json({ error: 'Post not found' }, 404)
    }
    res.json({ post })
  },

  async store(req, res) {
    const result = await validate(req.body, {
      title: [rules.required, rules.string, rules.min(3), rules.max(200)],
      content: [rules.required, rules.string, rules.min(10)]
    })

    if (result.fails()) {
      return res.json({ errors: result.errors }, 422)
    }

    const { title, content, published } = req.body
    const post = await Post.create({
      user_id: req.userId,
      title,
      content,
      published: published || false
    })

    res.json({ post }, 201)
  },

  async update(req, res) {
    const post = await Post.find(req.params.id)
    if (!post || post.user_id !== req.userId) {
      return res.json({ error: 'Post not found' }, 404)
    }

    const result = await validate(req.body, {
      title: [rules.required, rules.string, rules.min(3), rules.max(200)],
      content: [rules.required, rules.string, rules.min(10)]
    })

    if (result.fails()) {
      return res.json({ errors: result.errors }, 422)
    }

    const { title, content, published } = req.body
    const updated = await Post.update(req.params.id, {
      title,
      content,
      published: published ? 1 : 0
    })

    res.json({ post: updated })
  },

  async destroy(req, res) {
    const post = await Post.find(req.params.id)
    if (!post || post.user_id !== req.userId) {
      return res.json({ error: 'Post not found' }, 404)
    }

    await Post.delete(req.params.id)
    res.json({ message: 'Post deleted' })
  },

  async feed(req, res) {
    const posts = await Post.findPublished()
    res.json({ posts })
  },

  async feedShow(req, res) {
    const post = await Post.findPublishedById(req.params.id)
    if (!post) {
      return res.json({ error: 'Post not found' }, 404)
    }
    res.json({ post })
  }
}
