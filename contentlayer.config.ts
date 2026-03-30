import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

const commonFields = {
  title: { type: 'string', required: true },
  date: { type: 'date', required: true },
  description: { type: 'string', required: false },
  image: { type: 'string', required: false },
} as const

const computedFields = {
  slug: {
    type: 'string' as const,
    resolve: (doc: any) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
  },
}

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: `articles/*.mdx`,
  contentType: 'mdx',
  fields: commonFields,
  computedFields,
}))

export const Itinerary = defineDocumentType(() => ({
  name: 'Itinerary',
  filePathPattern: `itineraries/*.mdx`,
  contentType: 'mdx',
  fields: commonFields,
  computedFields,
}))

export const Recipe = defineDocumentType(() => ({
  name: 'Recipe',
  filePathPattern: `recipes/*.mdx`,
  contentType: 'mdx',
  fields: commonFields,
  computedFields,
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Article, Itinerary, Recipe],
})