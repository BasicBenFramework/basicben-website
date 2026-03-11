import { AuthController } from '../../controllers/AuthController.js'

export default (router) => {
  router.post('/api/auth/register', AuthController.register)
  router.post('/api/auth/login', AuthController.login)
  router.get('/api/user', AuthController.user)
}
