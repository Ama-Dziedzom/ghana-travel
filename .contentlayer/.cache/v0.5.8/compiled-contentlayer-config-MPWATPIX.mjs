// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
var commonFields = {
  title: { type: "string", required: true },
  date: { type: "date", required: true },
  description: { type: "string", required: false },
  image: { type: "string", required: false }
};
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, "")
  }
};
var Article = defineDocumentType(() => ({
  name: "Article",
  filePathPattern: `articles/*.mdx`,
  contentType: "mdx",
  fields: commonFields,
  computedFields
}));
var Itinerary = defineDocumentType(() => ({
  name: "Itinerary",
  filePathPattern: `itineraries/*.mdx`,
  contentType: "mdx",
  fields: commonFields,
  computedFields
}));
var Recipe = defineDocumentType(() => ({
  name: "Recipe",
  filePathPattern: `recipes/*.mdx`,
  contentType: "mdx",
  fields: commonFields,
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
//# sourceMappingURL=compiled-contentlayer-config-MPWATPIX.mjs.map
