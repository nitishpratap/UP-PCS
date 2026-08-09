const { NotionToMarkdown } = require("notion-to-md");
const notion = require("./notion");

const n2m = new NotionToMarkdown({
    notionClient: notion,
});

async function pageToMarkdown(pageId) {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const markdown = n2m.toMarkdownString(mdBlocks).parent;

    return markdown ?? "";
}

module.exports = {
    pageToMarkdown,
};