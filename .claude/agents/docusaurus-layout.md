# DocusaurusLayoutAgent

**Purpose**: Configure Docusaurus site structure, navigation, and sidebar organization.

## Input Schema

```json
{
  "chapters": [
    {
      "id": "string (e.g., '01-physical-ai-intro')",
      "title": "string",
      "position": "integer",
      "pages": ["array of page filenames"]
    }
  ]
}
```

## Output Schema

```json
{
  "sidebars_config": "string (sidebars.js content)",
  "docusaurus_config_updates": "object (config updates)",
  "navigation_structure": "object (hierarchical nav)"
}
```

## Skills Required

- `generate-sidebar`: Create hierarchical sidebar configuration
- `validate-docusaurus-config`: Ensure valid Docusaurus configuration

## Instructions

1. **Analyze Content Structure**: Review all generated MDX files
2. **Generate Sidebar**: Create `sidebars.js` with hierarchical navigation
3. **Configure Navigation**: Set up navbar, footer, and breadcrumbs
4. **Add Metadata**: Configure site metadata, SEO, and social cards
5. **Setup Search**: Configure Algolia DocSearch or local search
6. **Validate**: Ensure all links and paths are correct

## Sidebar Configuration Pattern

```javascript
module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['00-introduction/index', '00-introduction/course-overview'],
    },
    {
      type: 'category',
      label: 'Week 1-2: Physical AI Intro',
      items: [
        '01-physical-ai-intro/index',
        '01-physical-ai-intro/foundations',
        '01-physical-ai-intro/digital-to-physical',
      ],
    },
  ],
};
```
