module.exports = function (eleventyConfig, options = {}) {
    // Default configuration options
    const defaultOptions = {
        collectionName: "", // The name of the collection you want to modify
        relatedCollectionName: "", // An array of collections to search for relationships
        relatedCollectionKey: "", // A key or array of keys used to find relationships
        backRelate: false, // Enable the back-relation feature
    };

    const config = Object.assign({}, defaultOptions, options);

    // Add a custom Eleventy collection
    eleventyConfig.addCollection(config.collectionName, async (collection) => {
        // Get the target collection based on tags
        const targetCollection = collection.getFilteredByTag(config.collectionName);

        // Initialize an array to store related objects
        const modifiedCollection = await Promise.all(targetCollection.map(async (page) => {
            const relatedObjects = [];

            // Ensure relatedCollectionName and relatedCollectionKey are arrays
            if (!Array.isArray(config.relatedCollectionName)) {
                config.relatedCollectionName = [config.relatedCollectionName];
            }

            if (!Array.isArray(config.relatedCollectionKey)) {
                config.relatedCollectionKey = [config.relatedCollectionKey];
            }

            for (const relatedName of config.relatedCollectionName) {
                // Get the related collection
                const relatedCollection = collection.getFilteredByTag(relatedName);
                const relatedPages = [];

                // Iterate through items in the related collection
                for (const item of relatedCollection) {
                    for (const key of config.relatedCollectionKey) {
                        const relatedData = item.data[key];

                        // Check if the relatedData is an array and if it contains the page title
                        if (Array.isArray(relatedData)) {
                            if (relatedData.some(value => value && value.toLowerCase() === page.data.title.toLowerCase())) {
                                relatedPages.push(item);
                            }
                        } else {
                            // Check if the relatedData matches the page title
                            if (relatedData && relatedData.toLowerCase() === page.data.title.toLowerCase()) {
                                relatedPages.push(item);
                            }
                        }
                    }
                }

                // Create a related object with the related collection name and items
                const relatedObject = {
                    name: relatedName,
                    items: relatedPages,
                };

                relatedObjects.push(relatedObject);
            }

            // If backRelate is enabled, create back relations
            if (config.backRelate) {
                for (const relatedObject of relatedObjects) {
                    for (const relatedPage of relatedObject.items) {
                        if (!relatedPage.data.related) {
                            relatedPage.data.related = [];
                        }

                        // Find related data for the current collection
                        const relatedData = relatedPage.data.related.find(item => item.name === config.collectionName);

                        if (!relatedData) {
                            // If no related data exists, create a new entry
                            relatedPage.data.related.push({
                                name: config.collectionName,
                                items: [page],
                            });
                        } else {
                            // Check for uniqueness using an identifier (page.title in this example)
                            const isUnique = !relatedData.items.some(item => item.data.title === page.data.title);
                            if (isUnique) {
                                relatedData.items.push(page);
                            }
                        }
                    }
                }
            }

            // Set the related data for the current page
            page.data.related = relatedObjects;
            return page;
        }));

        return modifiedCollection;
    });
};
