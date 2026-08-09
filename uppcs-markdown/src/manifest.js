const path = require("path");
const fs = require("fs-extra");

const MANIFEST_VERSION = 1;
const MANIFEST_FILENAME = ".export-manifest.json";

class ExportManifest {
    constructor(exportDir) {
        this.exportDir = exportDir;
        this.filePath = path.join(exportDir, MANIFEST_FILENAME);
        this.data = {
            version: MANIFEST_VERSION,
            updatedAt: null,
            pages: {},
        };
    }

    async load() {
        if (!(await fs.pathExists(this.filePath))) {
            return this;
        }

        try {
            const loaded = await fs.readJson(this.filePath);

            if (loaded?.version !== MANIFEST_VERSION || !loaded.pages) {
                console.warn(
                    "Manifest missing or outdated — running a full export for safety."
                );
                return this;
            }

            this.data = loaded;
        } catch (error) {
            console.warn(
                `Could not read manifest (${error.message}) — running a full export for safety.`
            );
        }

        return this;
    }

    get(pageId) {
        return this.data.pages[pageId] || null;
    }

    entries() {
        return Object.entries(this.data.pages);
    }

    set(pageId, entry) {
        this.data.pages[pageId] = entry;
    }

    remove(pageId) {
        delete this.data.pages[pageId];
    }

    seedPathRegistry(pathRegistry) {
        for (const [pageId, entry] of this.entries()) {
            if (entry.folderPath) {
                pathRegistry.register(
                    path.join(this.exportDir, entry.folderPath),
                    pageId
                );
            }
        }
    }

    async save() {
        this.data.updatedAt = new Date().toISOString();
        await fs.writeJson(this.filePath, this.data, { spaces: 2 });
    }
}

function buildDatabaseSignature(fields) {
    return [fields.paper, fields.subject, fields.topic].join("|");
}

function buildSubpageSignature(parentFolder, title) {
    return `${parentFolder}|${title}`;
}

async function shouldExportPage({
    pageId,
    lastEditedTime,
    syncSignature,
    readmePath,
    manifest,
    force,
}) {
    if (force) {
        return { export: true, reason: "force" };
    }

    const entry = manifest.get(pageId);

    if (!entry) {
        return { export: true, reason: "new page" };
    }

    if (!(await fs.pathExists(readmePath))) {
        return { export: true, reason: "missing file on disk" };
    }

    if (entry.syncSignature !== syncSignature) {
        return { export: true, reason: "folder path changed" };
    }

    if (entry.lastEditedTime !== lastEditedTime) {
        return { export: true, reason: "edited in Notion" };
    }

    return { export: false, reason: "unchanged" };
}

module.exports = {
    ExportManifest,
    buildDatabaseSignature,
    buildSubpageSignature,
    shouldExportPage,
    MANIFEST_FILENAME,
};
