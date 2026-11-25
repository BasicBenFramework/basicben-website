import { useEffect } from 'react'
import { usePath } from '@basicbenframework/core/client'
import { metaFor } from './seo'

/**
 * Keep <head> in step with the route as the visitor navigates.
 *
 * The prerendered HTML already carries the right tags for the page it was
 * loaded on (scripts/prerender.js); this updates the same tags after a
 * client-side navigation, so the tab title, a bookmark and anything that reads
 * the live document see the page they are on.
 */
export function useDocumentMeta() {
  const path = usePath()

  useEffect(() => {
    const meta = metaFor(path)
    document.title = meta.title
    setTag('meta[name="description"]', 'content', meta.description)
    setTag('meta[name="robots"]', 'content', meta.noindex ? 'noindex' : null)
    setTag('link[rel="canonical"]', 'href', meta.canonical)
    setTag('meta[property="og:title"]', 'content', meta.title)
    setTag('meta[property="og:description"]', 'content', meta.description)
    setTag('meta[property="og:url"]', 'content', meta.canonical)
  }, [path])
}

/** Set an attribute on the tag the selector names, creating or removing it as needed. */
function setTag(selector, attribute, value) {
  let el = document.head.querySelector(selector)
  if (!value) {
    el?.remove()
    return
  }
  if (!el) {
    const [, tag, key, name] = selector.match(/^(\w+)\[(\w+)="([^"]+)"\]$/)
    el = document.createElement(tag)
    el.setAttribute(key, name)
    document.head.appendChild(el)
  }
  el.setAttribute(attribute, value)
}
