/**
 * Users seeder
 * Creates sample users for development/testing
 */

import { db } from 'basicben'
import { hashPassword } from 'basicben/auth'

export async function seed() {
  const password = await hashPassword('password123')

  // Create admin user
  await (await db.table('users'))
    .insert({
      name: 'Admin User',
      email: 'admin@example.com',
      password
    })

  // Create test user
  await (await db.table('users'))
    .insert({
      name: 'Test User',
      email: 'test@example.com',
      password
    })

  console.log('Seeded 2 users (password: password123)')
}
