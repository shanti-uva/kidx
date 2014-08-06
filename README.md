kidx
====

This is the management code for the KMaps Index.   Currently it is comprised of three parts:

1. **a solr self-updating proxy**. Updates missing kmapid data when they are queried.

2. **connectors** to various asset managers (e.g. sharedshelf, mediabase, shanti-essays)

3. **populator**:  code which drives population of the index from the various asset managers


