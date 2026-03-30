import { allArticles } from './.contentlayer/generated/index.mjs'
console.log('Count:', allArticles.length)
if (allArticles.length > 0) {
  console.log('First article slug:', allArticles[0].slug)
}
