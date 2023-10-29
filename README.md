# Eleventy Plugin Relate Collections

Easily establish and maintain content relationships between Eleventy collections. Simplify content organization and create interconnected pages.

## Installation

```sh
npm install eleventy-plugin-relate-collections
```

## Usage

In your Eleventy config file (typically .eleventy.js), add the plugin to your configuration:

```js
const relateCollections = require("eleventy-plugin-relate-collections");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(relateCollections, {
    // Configuration options
  });

  // Other Eleventy configuration settings...
};

```

## Configuration

You can customize the plugin behavior by providing configuration options:

```js
eleventyConfig.addPlugin(relateCollections, {
  collectionName: "", // The collection you want to relate
  relatedCollectionName: "", // The related collection(s)
  relatedCollectionKey: "", // The key(s) to establish the relationship
  backRelate: true, // Enable back-relations (optional)
});
```

## Example

Assuming you have a collection of blog posts and a collection of authors, you can easily relate each blog post to its author using this plugin:

```js
eleventyConfig.addPlugin(relateCollections, {
  collectionName: "authors",
  relatedCollectionName: "posts",
  relatedCollectionKey: "author", // Assuming "author" is a key in the "posts" collection
});
```

Now, you can create relationships between the "authors" and "posts" collections. In your "authors" collection data files, an empty related field will be created to store the related content from the "posts" collection:

```json5
related: {
  name: 'posts',
  items: [] // Related pages from "posts"
}
```

When you render your Eleventy site, for example, to show related posts for each author, you can use the following code:

```html
<!-- View the "authors" collection -->
<ul>
  {% for author in collections.authors %}
    <li>
      <h2>{{ author.data.title }}</h2>
      <h3>Related Posts:</h3>
      <ul>
        {% for related in author.data.related %}
          {% if related.name == 'posts' %}
            {% for post in related.items %}
              <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
            {% endfor %}
          {% endif %}
        {% endfor %}
      </ul>
    </li>
  {% endfor %}
</ul>
```
This example demonstrates how to use Liquid or Nunjucks to display related data in your Eleventy templates.

## About the Developer

This Eleventy Plugin Relate Collections is conceived and designed by Oleg Fedak, who is the brain behind the concept and the designer responsible for its development. The implementation, including code and development, is carried out with the assistance of Chat GPT, an AI language model.

## License

This project is licensed under the [MIT License](LICENSE).