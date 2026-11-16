import docsVersions from '../../../docs-versions.config.js';

const v1Facet = `docusaurus_tag:${docsVersions.versions.v1.searchTag}`;
const currentFacet = `docusaurus_tag:${docsVersions.versions.current.searchTag}`;

/** Preserve Algolia's AND/OR nesting and every unrelated filter. */
export function versionFacetFilters(filters) {
  if (Array.isArray(filters)) return filters.map(versionFacetFilters);
  return filters === v1Facet ? currentFacet : filters;
}
