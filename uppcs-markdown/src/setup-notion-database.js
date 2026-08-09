require("dotenv").config();

const notion = require("./notion");
const { SUBJECT_OPTIONS } = require("./subject-config");

const DATA_SOURCE_ID =
    process.env.IMPORT_DATA_SOURCE_ID || "39bfb09a-d993-806e-8a13-000b865cf8d2";

const PAPER_OPTIONS = [
    { name: "Prelims -1", color: "default" },
    { name: "Prelims - 2", color: "yellow" },
    { name: "GS 1", color: "blue" },
    { name: "GS-2", color: "green" },
    { name: "GS-3", color: "brown" },
    { name: "GS-4", color: "purple" },
    { name: "Essay", color: "orange" },
    { name: "Mains", color: "pink" },
];

const STATUS_OPTIONS = [
    { name: "Not Started", color: "gray" },
    { name: "Inprogress", color: "yellow" },
    { name: "Done", color: "green" },
    { name: "Revision Pending", color: "orange" },
    { name: "Fully Prepared", color: "pink" },
    { name: "Revised", color: "blue" },
];

const TAG_OPTIONS = [
    { name: "UPPCS", color: "blue" },
    { name: "Prelims", color: "purple" },
    { name: "UP-specific", color: "orange" },
    { name: "PYQ", color: "red" },
    { name: "MCQ", color: "pink" },
    { name: "Syllabus", color: "brown" },
    { name: "Revision", color: "yellow" },
];

const EXAM_RELEVANCE_OPTIONS = [
    { name: "Very High", color: "red" },
    { name: "High", color: "orange" },
    { name: "Moderate", color: "yellow" },
    { name: "Low", color: "gray" },
];

async function setupDatabase() {
    const result = await notion.dataSources.update({
        data_source_id: DATA_SOURCE_ID,
        properties: {
            Subject: {
                select: {
                    options: SUBJECT_OPTIONS,
                },
            },
            Paper: {
                multi_select: {
                    options: PAPER_OPTIONS,
                },
            },
            "Topic No": { number: { format: "number" } },
            Status: {
                select: {
                    options: STATUS_OPTIONS,
                },
            },
            Tags: {
                multi_select: {
                    options: TAG_OPTIONS,
                },
            },
            "Source File": { rich_text: {} },
            "Exam Relevance": {
                select: {
                    options: EXAM_RELEVANCE_OPTIONS,
                },
            },
            "Estimated Minutes": { number: { format: "number" } },
        },
    });

    console.log("Notion database configured.");
    console.log("Subject dropdown options:");
    result.properties.Subject.select.options.forEach((option) => {
        console.log(`  - ${option.name}`);
    });
    console.log("\nFilter in Notion:");
    console.log("  1. Open your database table view");
    console.log("  2. Click Filter → Add filter → Subject");
    console.log('  3. Choose "Environment & Ecology"');
    console.log("\nTip: Save this as a linked view named 'Environment & Ecology'.");
}

setupDatabase().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
