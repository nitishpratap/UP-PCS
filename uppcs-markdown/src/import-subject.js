require("dotenv").config();

const path = require("path");
const fs = require("fs-extra");
const notion = require("./notion");
const { markdownToBlocks } = require("./markdown-to-blocks");
const { SUBJECT_OPTIONS, SUBJECT_PRESETS } = require("./subject-config");

const DATABASE_ID =
    process.env.IMPORT_DATABASE_ID || "39bfb09ad9938064b39fc47815640f41";
const DATA_SOURCE_ID =
    process.env.IMPORT_DATA_SOURCE_ID || "39bfb09a-d993-806e-8a13-000b865cf8d2";

const BATCH_SIZE = 100;
const REQUEST_DELAY_MS = 350;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getArgValue(argv, name) {
    const prefix = `${name}=`;
    const match = argv.find((arg) => arg.startsWith(prefix));
    return match ? match.slice(prefix.length) : undefined;
}

function parseArgs(argv) {
    const presetKey = getArgValue(argv, "--preset")?.toLowerCase();
    const preset = presetKey ? SUBJECT_PRESETS[presetKey] : null;

    const replace =
        !argv.includes("--no-replace") &&
        (argv.includes("--replace") || !argv.includes("--append"));

    return {
        preset: presetKey,
        subject:
            getArgValue(argv, "--subject") ||
            preset?.subject ||
            process.env.IMPORT_SUBJECT_NAME,
        dir:
            getArgValue(argv, "--dir") ||
            preset?.dir ||
            process.env.IMPORT_NOTES_DIR,
        replace,
        dryRun: argv.includes("--dry-run"),
        setupOnly: argv.includes("--setup-only"),
        file: getArgValue(argv, "--file"),
    };
}

function cleanPageTitle(rawTitle, filename, topicNo, subjectName) {
    if (topicNo === 0 || filename.startsWith("00_")) {
        return "Syllabus";
    }

    let title = (rawTitle || "").trim().replace(/^\uFEFF/, "");
    if (subjectName) {
        const subjectPattern = new RegExp(
            `^${subjectName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[—–-]\\s*`,
            "i"
        );
        title = title.replace(subjectPattern, "");
    }
    title = title.replace(/^Topic\s+\d+\s*[—–-]\s*/i, "");

    if (!title) {
        title = filename
            .replace(/\.md$/, "")
            .replace(/^\d+_/, "")
            .replace(/_/g, " ");
    }

    if (topicNo !== null && topicNo > 0) {
        return `${topicNo}. ${title}`;
    }

    return title;
}

async function ensureDatabaseSchema(subjectName) {
    const subjectOptions = [...SUBJECT_OPTIONS];
    if (
        subjectName &&
        !subjectOptions.some(
            (option) => option.name.toLowerCase() === subjectName.toLowerCase()
        )
    ) {
        subjectOptions.push({ name: subjectName, color: "default" });
    }

    await notion.dataSources.update({
        data_source_id: DATA_SOURCE_ID,
        properties: {
            Paper: {
                multi_select: {
                    options: [
                        { name: "Prelims -1", color: "default" },
                        { name: "Prelims - 2", color: "yellow" },
                        { name: "GS 1", color: "blue" },
                        { name: "GS-2", color: "green" },
                        { name: "GS-3", color: "brown" },
                        { name: "GS-4", color: "purple" },
                        { name: "Essay", color: "orange" },
                        { name: "Mains", color: "pink" },
                    ],
                },
            },
            Subject: {
                select: {
                    options: subjectOptions,
                },
            },
            "Topic No": { number: { format: "number" } },
            Status: {
                select: {
                    options: [
                        { name: "Not Started", color: "gray" },
                        { name: "Inprogress", color: "yellow" },
                        { name: "Done", color: "green" },
                        { name: "Revision Pending", color: "orange" },
                        { name: "Fully Prepared", color: "pink" },
                    ],
                },
            },
            Tags: {
                multi_select: {
                    options: [
                        { name: "UPPCS", color: "blue" },
                        { name: "Prelims", color: "purple" },
                        { name: "UP-specific", color: "orange" },
                        { name: "PYQ", color: "red" },
                        { name: "MCQ", color: "pink" },
                        { name: "Syllabus", color: "brown" },
                        { name: "Revision", color: "yellow" },
                    ],
                },
            },
            "Source File": { rich_text: {} },
            "Exam Relevance": {
                select: {
                    options: [
                        { name: "Very High", color: "red" },
                        { name: "High", color: "orange" },
                        { name: "Moderate", color: "yellow" },
                        { name: "Low", color: "gray" },
                    ],
                },
            },
            "Estimated Minutes": { number: { format: "number" } },
        },
    });

    console.log("Database schema ready.");
}

function parseTopicFile(filePath, subjectName) {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
    const lines = content.split(/\r?\n/);

    const numberMatch = filename.match(/^(\d+)_/);
    const topicNo = numberMatch ? Number(numberMatch[1]) : null;

    const titleLine = lines.find((line) =>
        line.replace(/^\uFEFF/, "").trimStart().startsWith("# ")
    );
    const rawTitle =
        titleLine?.replace(/^\uFEFF/, "").replace(/^#\s+/, "").trim() ||
        filename.replace(/\.md$/, "").replace(/^\d+_/, "").replace(/_/g, " ");
    const title = cleanPageTitle(rawTitle, filename, topicNo, subjectName);

    const examLine = lines.find((line) => /exam relevance|exam weight/i.test(line));
    const examRelevance = (() => {
        if (!examLine) return "High";
        const value = examLine.toLowerCase();
        if (value.includes("very high")) return "Very High";
        if (value.includes("moderate")) return "Moderate";
        if (value.includes("low")) return "Low";
        return "High";
    })();

    const hasUpContent =
        /uttar pradesh|\bUP\b|UPPCS|Bundelkhand|Ganga|Yamuna|Lucknow|Kanpur|Varanasi|Agra|Fatehpur/i.test(
            content
        );
    const hasPyq = /## PYQs|PYQs \(UPSC|## Complete PYQ Bank/i.test(content);
    const hasMcq = /## Frequently Asked MCQs|## Practice Zone/i.test(content);

    const tags = [{ name: "UPPCS" }, { name: "Prelims" }];
    if (filename.startsWith("00_")) tags.push({ name: "Syllabus" });
    else tags.push({ name: "Revision" });
    if (hasUpContent) tags.push({ name: "UP-specific" });
    if (hasPyq) tags.push({ name: "PYQ" });
    if (hasMcq) tags.push({ name: "MCQ" });

    const estimatedMinutes = Math.max(20, Math.ceil(lines.length / 35));

    return {
        filename,
        filePath,
        topicNo,
        title,
        content,
        examRelevance,
        tags,
        estimatedMinutes,
        status: filename.startsWith("00_") ? "Not Started" : "Done",
        paper: ["Prelims -1"],
        subject: subjectName,
    };
}

function buildProperties(meta) {
    const properties = {
        Name: {
            title: [{ text: { content: meta.title.slice(0, 2000) } }],
        },
        Paper: {
            multi_select: meta.paper.map((name) => ({ name })),
        },
        Subject: {
            select: { name: meta.subject },
        },
        Status: {
            select: { name: meta.status },
        },
        Tags: {
            multi_select: meta.tags,
        },
        "Source File": {
            rich_text: [{ text: { content: meta.filename } }],
        },
        "Exam Relevance": {
            select: { name: meta.examRelevance },
        },
        "Estimated Minutes": {
            number: meta.estimatedMinutes,
        },
    };

    if (meta.topicNo !== null) {
        properties["Topic No"] = { number: meta.topicNo };
    }

    return properties;
}

async function getPagesBySubject(subjectName) {
    const pages = [];
    let cursor = undefined;

    while (true) {
        const response = await notion.dataSources.query({
            data_source_id: DATA_SOURCE_ID,
            filter: {
                property: "Subject",
                select: { equals: subjectName },
            },
            result_type: "page",
            start_cursor: cursor,
        });

        pages.push(...response.results.filter((page) => !page.archived));

        if (!response.has_more) break;
        cursor = response.next_cursor;
    }

    return pages;
}

async function archiveExistingSubjectPages(subjectName, options) {
    const pages = await getPagesBySubject(subjectName);

    if (!pages.length) {
        console.log(`No existing pages found for subject "${subjectName}".`);
        return 0;
    }

    console.log(
        `Archiving ${pages.length} existing page(s) for "${subjectName}"...`
    );

    if (options.dryRun) {
        for (const page of pages) {
            const title =
                page.properties?.Name?.title?.[0]?.plain_text || page.id;
            console.log(`• dry-run archive: ${title}`);
        }
        return pages.length;
    }

    for (const page of pages) {
        const title = page.properties?.Name?.title?.[0]?.plain_text || page.id;
        await notion.pages.update({
            page_id: page.id,
            archived: true,
        });
        console.log(`✓ archived: ${title}`);
        await sleep(REQUEST_DELAY_MS);
    }

    return pages.length;
}

async function appendBlocks(pageId, blocks) {
    for (let i = 0; i < blocks.length; i += BATCH_SIZE) {
        const batch = blocks.slice(i, i + BATCH_SIZE);
        await notion.blocks.children.append({
            block_id: pageId,
            children: batch,
        });
        await sleep(REQUEST_DELAY_MS);
    }
}

async function createTopic(meta, options) {
    if (options.dryRun) {
        console.log(`• dry-run create: ${meta.title} (${meta.filename})`);
        return { action: "dry-run" };
    }

    const properties = buildProperties(meta);
    const blocks = markdownToBlocks(meta.content);

    const page = await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        properties,
    });

    console.log(`✓ created: ${meta.title}`);
    console.log(`  ↳ uploading ${blocks.length} blocks...`);
    await appendBlocks(page.id, blocks);

    return { action: "created", pageId: page.id };
}

async function getMarkdownFiles(notesDir, singleFile) {
    if (singleFile) {
        const filePath = path.isAbsolute(singleFile)
            ? singleFile
            : path.join(notesDir, singleFile);
        return [filePath];
    }

    const files = await fs.readdir(notesDir);
    return files
        .filter((file) => file.endsWith(".md"))
        .sort()
        .map((file) => path.join(notesDir, file));
}

function resolveConfig(options) {
    if (!options.subject) {
        throw new Error(
            'Missing subject. Use --preset=art, --preset=env, or --subject="Art and Culture".'
        );
    }

    if (!options.dir) {
        throw new Error(
            'Missing notes directory. Use --dir="../subjects/art and culture" or set IMPORT_NOTES_DIR.'
        );
    }

    const notesDir = path.resolve(options.dir);

    if (!fs.existsSync(notesDir)) {
        throw new Error(`Notes directory not found: ${notesDir}`);
    }

    return {
        subject: options.subject,
        notesDir,
    };
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    const config = resolveConfig(options);

    console.log(`Subject: ${config.subject}`);
    console.log(`Notes dir: ${config.notesDir}`);
    console.log(`Mode: ${options.replace ? "REPLACE (archive old + import fresh)" : "APPEND (keep existing)"}`);
    console.log(`Database: ${DATABASE_ID}`);

    await ensureDatabaseSchema(config.subject);

    if (options.setupOnly) {
        console.log("Setup complete (--setup-only).");
        return;
    }

    let archived = 0;
    if (options.replace) {
        archived = await archiveExistingSubjectPages(config.subject, options);
    }

    const files = await getMarkdownFiles(config.notesDir, options.file);
    const stats = { created: 0, archived, failed: 0 };

    for (const filePath of files) {
        try {
            const meta = parseTopicFile(filePath, config.subject);
            const result = await createTopic(meta, options);
            if (result.action === "created") stats.created += 1;
        } catch (error) {
            stats.failed += 1;
            console.error(`✗ failed: ${path.basename(filePath)} — ${error.message}`);
        }
    }

    console.log("\nImport complete");
    console.log(`Archived: ${stats.archived}`);
    console.log(`Created:  ${stats.created}`);
    console.log(`Failed:   ${stats.failed}`);
}

main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
