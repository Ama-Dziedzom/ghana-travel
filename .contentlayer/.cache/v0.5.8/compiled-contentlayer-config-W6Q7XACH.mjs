// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc.slug || doc._raw.sourceFileName.replace(/\.mdx$/, "")
  }
};
var Article = defineDocumentType(() => ({
  name: "Article",
  filePathPattern: `articles/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    category: { type: "string", required: true },
    excerpt: { type: "string", required: false },
    coverImage: { type: "string", required: false },
    author: { type: "string", required: false },
    publishedAt: { type: "string", required: false },
    // Using string for flexibility with existing data
    readTime: { type: "number", required: false }
  },
  computedFields
}));
var Itinerary = defineDocumentType(() => ({
  name: "Itinerary",
  filePathPattern: `itineraries/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    duration: { type: "number", required: false },
    regions: { type: "list", of: { type: "string" }, required: false },
    vibeTags: { type: "list", of: { type: "string" }, required: false },
    bestSeason: { type: "string", required: false },
    coverImage: { type: "string", required: false },
    summary: { type: "string", required: false },
    mapEmbedUrl: { type: "string", required: false },
    days: { type: "json", required: false }
  },
  computedFields
}));
var Recipe = defineDocumentType(() => ({
  name: "Recipe",
  filePathPattern: `recipes/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    category: { type: "string", required: true },
    description: { type: "string", required: false },
    coverImage: { type: "string", required: false },
    prepTime: { type: "number", required: false },
    cookTime: { type: "number", required: false },
    servings: { type: "number", required: false },
    difficulty: { type: "string", required: false },
    ingredients: { type: "list", of: { type: "string" }, required: false },
    instructions: { type: "list", of: { type: "string" }, required: false },
    tips: { type: "string", required: false }
  },
  computedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Article, Itinerary, Recipe]
});
export {
  Article,
  Itinerary,
  Recipe,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-W6Q7XACH.mjs.map
