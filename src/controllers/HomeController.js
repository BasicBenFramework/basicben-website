/**
 * Home Controller
 *
 * Handles basic application endpoints.
 */

export const HomeController = {
  /**
   * Hello endpoint
   */
  hello: async (req, res) => {
    res.json({
      message: 'Welcome to BasicBen!',
      timestamp: new Date().toISOString()
    })
  }
}
