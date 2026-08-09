require("dotenv").config();

const path = require("path");
const fs = require("fs-extra");
const notion = require("./notion");
const { exportDatabasePage, PathRegistry } = require("./exporter");
const { ExportManifest } = require("./manifest");

async function getDataSourceId() {
    console.log("Hello ::::::::DatabaseId :::::",process.env.DATABASE_ID)
    const database = await notion.databases.retrieve({
        database_id: process.env.DATABASE_ID,
    });

    const dataSourceId = database.data_sources?.[0]?.id;

    if (!dataSourceId) {
        throw new Error(
            "No data source found for DATABASE_ID. Check your .env value."
        );
    }

    return dataSourceId;
}

async function getAllPages() {
    const dataSourceId = await getDataSourceId();
    let results = [];
    let cursor = undefined;
    console.log("hello :::::::::::",process.env)

    while (true) {
        const response = await notion.dataSources.query({
            data_source_id: dataSourceId,
            start_cursor: cursor,
            result_type: "page",
        });

        results.push(...response.results);

        if (!response.has_more) break;

        cursor = response.next_cursor;
    }

    return results;
}

function parseArgs(argv) {
    return {
        force: argv.includes("--full") || argv.includes("--force"),
    };
}

async function main() {
    console.log("Hello ::::::::::::",process.env.NOTION_TOKEN);
    process.env.NOTION_TOKEN="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"
    process.env.DATABASE_ID="302fb09ad99380a08a31c4c4e6079ff2"
    const options = parseArgs(process.argv.slice(2));

    process.env.EXPORT_DIR = path.resolve(
        __dirname,
        "..",
        process.env.EXPORT_DIR || "../exports"
    );

    await fs.ensureDir(process.env.EXPORT_DIR);

    const manifest = await new ExportManifest(process.env.EXPORT_DIR).load();
    const pathRegistry = new PathRegistry();
    manifest.seedPathRegistry(pathRegistry);

    const pages = await getAllPages();
    const failures = [];
    const stats = {
        topicsExported: 0,
        topicsSkipped: 0,
        subpagesExported: 0,
        subpagesSkipped: 0,
    };

    console.log(`Found ${pages.length} pages`);
    console.log(`Export directory: ${process.env.EXPORT_DIR}`);
    console.log(
        options.force
            ? "Mode: FULL export (all pages will be rewritten)\n"
            : "Mode: INCREMENTAL sync (only changed pages are rewritten)\n"
    );

    const seenPageIds = new Set();

    for (let index = 0; index < pages.length; index++) {
        const page = pages[index];
        seenPageIds.add(page.id);

        const topic =
            page.properties?.Topic?.title?.[0]?.plain_text || page.id;

        try {
            console.log(`[${index + 1}/${pages.length}] ${topic}`);

            const result = await exportDatabasePage(
                page,
                pathRegistry,
                manifest,
                options
            );

            if (result.pageExported) stats.topicsExported++;
            else stats.topicsSkipped++;

            stats.subpagesExported += result.subpagesExported;
            stats.subpagesSkipped += result.subpagesSkipped;
        } catch (error) {
            failures.push({ topic, pageId: page.id, error: error.message });
            console.error(`✗ Failed: ${topic} — ${error.message}`);
        }
    }

    const missingInNotion = [];

    for (const [pageId, entry] of manifest.entries()) {
        if (entry.kind === "database" && !seenPageIds.has(pageId)) {
            missingInNotion.push({ pageId, title: entry.title, path: entry.folderPath });
        }
    }

    await manifest.save();

    console.log("\nSync Complete");
    console.log(`Topics exported: ${stats.topicsExported}`);
    console.log(`Topics skipped:  ${stats.topicsSkipped}`);
    console.log(`Subpages exported: ${stats.subpagesExported}`);
    console.log(`Subpages skipped:  ${stats.subpagesSkipped}`);

    if (missingInNotion.length) {
        console.log(
            `\n${missingInNotion.length} topic(s) exist locally but were not found in Notion (files kept):`
        );
        for (const item of missingInNotion) {
            console.log(`- ${item.title || item.pageId} (${item.path})`);
        }
    }

    if (failures.length) {
        console.log(`\n${failures.length} page(s) failed:`);
        for (const failure of failures) {
            console.log(`- ${failure.topic} (${failure.pageId}): ${failure.error}`);
        }
    }

    if (!options.force) {
        console.log(
            "\nTip: run `node src/index.js --full` once if you ever want to rewrite everything."
        );
    }
}

main().catch(console.error);
