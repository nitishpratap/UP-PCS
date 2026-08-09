const path = require("path");
const fs = require("fs-extra");

const notion = require("./notion");
const { pageToMarkdown } = require("./markdown");
const {
    sanitize,
    shortPageId,
    extractPageFields,
    PathRegistry,
} = require("./utils");
const {
    buildDatabaseSignature,
    buildSubpageSignature,
    shouldExportPage,
} = require("./manifest");

function toRelativeExportPath(exportDir, absolutePath) {
    return path.relative(exportDir, absolutePath).split(path.sep).join("/");
}

function resolveSubpageTitle(child) {
    const title = sanitize(child.child_page?.title);

    if (title) {
        return title;
    }

    return `_untitled__${shortPageId(child.id)}`;
}

function resolveDatabaseFolder(fields, pathRegistry) {
    const baseFolder = path.join(
        process.env.EXPORT_DIR,
        fields.paper,
        fields.subject,
        fields.topic
    );

    return pathRegistry.resolve(baseFolder, fields.pageId);
}

function resolveSubpageFolder(pageTitle, parentFolder, pageId, pathRegistry) {
    const baseFolder = path.join(parentFolder, pageTitle);
    return pathRegistry.resolve(baseFolder, pageId);
}

async function getChildren(blockId) {
    let results = [];
    let cursor = undefined;

    while (true) {
        const response = await notion.blocks.children.list({
            block_id: blockId,
            start_cursor: cursor,
        });

        results.push(...response.results);

        if (!response.has_more) break;

        cursor = response.next_cursor;
    }

    return results;
}

async function writePageMarkdown(pageId, folderPath, manifest, entryMeta) {
    await fs.ensureDir(folderPath);

    const md = await pageToMarkdown(pageId);
    const readmePath = path.join(folderPath, "README.md");

    await fs.writeFile(readmePath, md || "");

    manifest.set(pageId, {
        ...entryMeta,
        lastEditedTime: entryMeta.lastEditedTime,
        folderPath: toRelativeExportPath(process.env.EXPORT_DIR, folderPath),
        readmePath: toRelativeExportPath(process.env.EXPORT_DIR, readmePath),
        exportedAt: new Date().toISOString(),
    });

    return readmePath;
}

async function syncSubPages(parentId, parentFolder, pathRegistry, manifest, options) {
    const children = await getChildren(parentId);
    let exported = 0;
    let skipped = 0;

    for (const child of children) {
        if (child.type !== "child_page") continue;

        const pageTitle = resolveSubpageTitle(child);
        const { folderPath: pageFolder, deduplicated } = resolveSubpageFolder(
            pageTitle,
            parentFolder,
            child.id,
            pathRegistry
        );
        const readmePath = path.join(pageFolder, "README.md");
        const syncSignature = buildSubpageSignature(parentFolder, pageTitle);
        const existing = manifest.get(child.id);

        if (
            existing &&
            existing.folderPath &&
            toRelativeExportPath(process.env.EXPORT_DIR, pageFolder) !==
                existing.folderPath
        ) {
            console.log(
                `  ↳ subpage moved: ${pageTitle} (old: ${existing.folderPath})`
            );
        }

        const decision = await shouldExportPage({
            pageId: child.id,
            lastEditedTime: child.last_edited_time,
            syncSignature,
            readmePath:
                existing?.readmePath && existing.syncSignature === syncSignature
                    ? path.join(process.env.EXPORT_DIR, existing.readmePath)
                    : readmePath,
            manifest,
            force: options.force,
        });

        if (decision.export) {
            await writePageMarkdown(child.id, pageFolder, manifest, {
                kind: "subpage",
                parentPageId: parentId,
                title: pageTitle,
                syncSignature,
                lastEditedTime: child.last_edited_time,
            });

            exported++;

            if (deduplicated) {
                console.log(
                    `  ↳ exported subpage: ${pageTitle} [${shortPageId(child.id)}] (${decision.reason})`
                );
            } else {
                console.log(`  ↳ exported subpage: ${pageTitle} (${decision.reason})`);
            }
        } else {
            skipped++;

            if (existing?.folderPath) {
                pathRegistry.register(
                    path.join(process.env.EXPORT_DIR, existing.folderPath),
                    child.id
                );
            }
        }

        const childFolder =
            manifest.get(child.id)?.folderPath
                ? path.join(process.env.EXPORT_DIR, manifest.get(child.id).folderPath)
                : pageFolder;

        const nested = await syncSubPages(
            child.id,
            childFolder,
            pathRegistry,
            manifest,
            options
        );

        exported += nested.exported;
        skipped += nested.skipped;
    }

    return { exported, skipped };
}

async function exportDatabasePage(page, pathRegistry, manifest, options = {}) {
    const fields = extractPageFields(page);
    const syncSignature = buildDatabaseSignature(fields);
    const { folderPath: folder, deduplicated } = resolveDatabaseFolder(
        fields,
        pathRegistry
    );
    const readmePath = path.join(folder, "README.md");
    const existing = manifest.get(page.id);

    if (
        existing &&
        existing.folderPath &&
        toRelativeExportPath(process.env.EXPORT_DIR, folder) !== existing.folderPath
    ) {
        console.log(
            `  ↳ topic folder changed: ${existing.folderPath} → ${toRelativeExportPath(process.env.EXPORT_DIR, folder)}`
        );
    }

    const decision = await shouldExportPage({
        pageId: page.id,
        lastEditedTime: page.last_edited_time,
        syncSignature,
        readmePath:
            existing?.readmePath && existing.syncSignature === syncSignature
                ? path.join(process.env.EXPORT_DIR, existing.readmePath)
                : readmePath,
        manifest,
        force: options.force,
    });

    const label = fields.topicRaw || fields.topic;
    let pageExported = false;

    if (decision.export) {
        await writePageMarkdown(page.id, folder, manifest, {
            kind: "database",
            title: label,
            syncSignature,
            lastEditedTime: page.last_edited_time,
            paper: fields.paper,
            subject: fields.subject,
        });

        pageExported = true;

        const warnings = [];
        if (fields.missing.paper) warnings.push("Paper missing");
        if (fields.missing.subject) warnings.push("Subject missing");
        if (fields.missing.topic) warnings.push("Topic missing");
        if (deduplicated) warnings.push("duplicate folder name");

        const warningText = warnings.length ? ` (${warnings.join(", ")})` : "";
        console.log(`✓ exported: ${label}${warningText} — ${decision.reason}`);
    } else {
        console.log(`○ skipped: ${label} — ${decision.reason}`);

        if (existing?.folderPath) {
            pathRegistry.register(
                path.join(process.env.EXPORT_DIR, existing.folderPath),
                page.id
            );
        }
    }

    const activeFolder =
        manifest.get(page.id)?.folderPath
            ? path.join(process.env.EXPORT_DIR, manifest.get(page.id).folderPath)
            : folder;

    const subpageStats = await syncSubPages(
        page.id,
        activeFolder,
        pathRegistry,
        manifest,
        options
    );

    return {
        folder: activeFolder,
        pageExported,
        subpagesExported: subpageStats.exported,
        subpagesSkipped: subpageStats.skipped,
        skipped: !pageExported,
    };
}

module.exports = {
    exportDatabasePage,
    PathRegistry,
};
