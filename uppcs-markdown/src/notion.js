const { Client } = require("@notionhq/client");

if (!process.env.NOTION_TOKEN) {
    throw new Error("NOTION_TOKEN is missing. Add it to uppcs-markdown/.env");
}

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

module.exports = notion;
