const express = require('express');
const app = express();

// Middleware
app.use(express.json());

function extractTagsFromText(text) {
    const re = /(?:^|\s)(#[^\d\s]\S*)(?=\s)?/g;
    const facets = [];
    let match;

    while ((match = re.exec(text))) {
        let [tag] = match;
        const hasLeadingSpace = /^\s/.test(tag);

        // Trim and remove ending punctuation
        tag = tag.trim().replace(/\p{P}+$/gu, '');

        // Ensure the tag length is valid (inclusive of #, max of 64 chars)
        if (tag.length > 66) continue;

        // get the index of where is the tag
        //  'G  o     t  o     t  h  i  s     s  i  t  e'
        //   0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15

        facets.push({
            index: {
                byteStart: text.indexOf(tag),
                byteEnd: text.indexOf(tag)+tag.length, // inclusive of last char
            },
            features: [
                {
                    $type: 'app.bsky.richtext.facet#tag',
                    tag: tag.replace(/^#/, ''),
                },
            ],
        });
    }

    return facets;
}

// Define a simple JSON API
app.post('/bsky/features', (req, res) => {

    console.log(`${Date.now()} - POST /bsky/features`);
    // get json body
    const body = req.body;
    if (!body || !body.text) {
        return res.status(400).json({ message: "Invalid request" });
    }

    let features = extractTagsFromText(body.text);


    res.json({ features: features });
});

// Start the server
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});