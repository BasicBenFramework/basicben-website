import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@basicbenframework/core/client'
import { useTheme } from '../components/ThemeContext'
import { Card } from '../components/Card'
import { BackLink } from '../components/BackLink'
import { Loading } from '../components/Loading'
import { api } from '../../helpers/api'

export function FeedPost() {
  const navigate = useNavigate()
  const params = useParams()
  const postId = params.id
  const { t } = useTheme()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api(`/api/feed/${postId}`)
      .then(data => setPost(data.post))
      .catch(() => navigate('/feed'))
      .finally(() => setLoading(false))
  }, [postId])

  if (loading) return <Loading />
  if (!post) return null

  return (
    <div>
      <BackLink onClick={() => navigate('/feed')}>Back to feed</BackLink>
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className={`text-sm ${t.subtle} mb-6`}>By {post.author_name} &bull; {new Date(post.created_at).toLocaleDateString()}</p>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </Card>
    </div>
  )
}
