import { ProfileController } from '../../controllers/ProfileController.js'
import { auth } from '../../middleware/auth.js'

export default (router) => {
  router.get('/api/profile', auth, ProfileController.show)
  router.put('/api/profile', auth, ProfileController.update)
  router.put('/api/profile/password', auth, ProfileController.changePassword)
}
