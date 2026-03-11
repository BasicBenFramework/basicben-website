import { PostController } from '../../controllers/PostController.js'
import { auth } from '../../middleware/auth.js'

export default (router) => {
  // Public feed routes
  router.get('/api/feed', PostController.feed)
  router.get('/api/feed/:id', PostController.feedShow)

  // Authenticated post routes
  router.get('/api/posts', auth, PostController.index)
  router.post('/api/posts', auth, PostController.store)
  router.get('/api/posts/:id', auth, PostController.show)
  router.put('/api/posts/:id', auth, PostController.update)
  router.delete('/api/posts/:id', auth, PostController.destroy)
}
