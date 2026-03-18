// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Article = defineDocumentType(() => ({
  name: "Article",
  filePathPattern: `articles/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    category: {
      type: "enum",
      options: ["culture", "history", "festivals", "neighbourhoods"],
      required: true
    },
    excerpt: { type: "string", required: true },
    coverImage: { type: "string", required: true },
    author: { type: "string", required: true },
    publishedAt: { type: "date", required: true },
    readTime: { type: "number", required: true }
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/explore/${doc.slug}` }
  }
}));
var Itinerary = defineDocumentType(() => ({
  name: "Itinerary",
  filePathPattern: `itineraries/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    duration: { type: "number", required: true },
    regions: { type: "list", of: { type: "string" }, required: true },
    vibeTags: { type: "list", of: { type: "string" }, required: true },
    bestSeason: { type: "string", required: true },
    coverImage: { type: "string", required: true },
    summary: { type: "string", required: true },
    mapEmbedUrl: { type: "string", required: true },
    days: {
      type: "list",
      of: {
        type: "json"
      },
      required: true
    }
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/itineraries/${doc.slug}` }
  }
}));
var Recipe = defineDocumentType(() => ({
  name: "Recipe",
  filePathPattern: `recipes/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    category: {
      type: "enum",
      options: ["soups", "rice-dishes", "street-food", "drinks", "snacks"],
      required: true
    },
    description: { type: "string", required: true },
    coverImage: { type: "string", required: true },
    prepTime: { type: "number", required: true },
    cookTime: { type: "number", required: true },
    servings: { type: "number", required: true },
    difficulty: {
      type: "enum",
      options: ["easy", "medium", "hard"],
      required: true
    },
    ingredients: { type: "list", of: { type: "string" }, required: true },
    instructions: { type: "list", of: { type: "string" }, required: true },
    tips: { type: "string", required: true }
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/taste/${doc.slug}` }
  }
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
//# sourceMappingURL=compiled-contentlayer-config-EQ3F2A6W.mjs.map
