require("dotenv").config();

const notion = require("./notion");

const DATA_SOURCE_ID =
    process.env.IMPORT_DATA_SOURCE_ID || "39bfb09a-d993-806e-8a13-000b865cf8d2";
const SUBJECT_NAME = "Environment & Ecology";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getAllPages() {
    const pages = [];
    let cursor;

    do {
        const response = await notion.dataSources.query({
            data_source_id: DATA_SOURCE_ID,
            start_cursor: cursor,
            result_type: "page",
        });

        pages.push(...response.results);
        cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);

    return pages;
}

async function main() {
    const pages = await getAllPages();
    let updated = 0;
    let alreadySet = 0;

    for (const page of pages) {
        const current = page.properties?.Subject?.select?.name;

        if (current === SUBJECT_NAME) {
            alreadySet += 1;
            continue;
        }

        await notion.pages.update({
            page_id: page.id,
            properties: {
                Subject: {
                    select: { name: SUBJECT_NAME },
                },
            },
        });

        const title = page.properties?.Name?.title?.[0]?.plain_text || page.id;
        console.log(`✓ tagged: ${title}`);
        updated += 1;
        await sleep(200);
    }

    console.log("\nSubject tagging complete");
    console.log(`Updated: ${updated}`);
    console.log(`Already set: ${alreadySet}`);
    console.log(`Total pages: ${pages.length}`);
}

main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
