
function sanitize(str = "") {
    return str
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function getPropertyText(property) {
    if (!property) return "";

    switch (property.type) {
        case "title":
            return property.title?.[0]?.plain_text || "";
        case "rich_text":
            return property.rich_text?.[0]?.plain_text || "";
        case "select":
            return property.select?.name || "";
        case "multi_select":
            return property.multi_select?.map((item) => item.name).join(", ") || "";
        default:
            return "";
    }
}

function shortPageId(pageId = "") {
    return pageId.replace(/-/g, "").slice(0, 8);
}

const FALLBACK = {
    paper: "_uncategorized",
    subject: "_no-subject",
    topic: "_untitled",
};

function extractPageFields(page) {
    const props = page.properties || {};
    const paperRaw = getPropertyText(props.Paper);
    const subjectRaw = getPropertyText(props.Subject);
    const topicRaw = getPropertyText(props.Topic);

    return {
        pageId: page.id,
        paperRaw,
        subjectRaw,
        topicRaw,
        paper: sanitize(paperRaw) || FALLBACK.paper,
        subject: sanitize(subjectRaw) || FALLBACK.subject,
        topic: sanitize(topicRaw) || `${FALLBACK.topic}__${shortPageId(page.id)}`,
        missing: {
            paper: !paperRaw,
            subject: !subjectRaw,
            topic: !topicRaw,
        },
    };
}

class PathRegistry {
    constructor() {
        this.used = new Map();
    }

    resolve(folderPath, pageId) {
        const owner = this.used.get(folderPath);

        if (!owner) {
            this.used.set(folderPath, pageId);
            return { folderPath, deduplicated: false };
        }

        if (owner === pageId) {
            return { folderPath, deduplicated: false };
        }

        const uniquePath = `${folderPath} [${shortPageId(pageId)}]`;
        this.used.set(uniquePath, pageId);

        return { folderPath: uniquePath, deduplicated: true };
    }

    register(folderPath, pageId) {
        if (folderPath && pageId) {
            this.used.set(folderPath, pageId);
        }
    }
}

module.exports = {
    sanitize,
    getPropertyText,
    shortPageId,
    FALLBACK,
    extractPageFields,
    PathRegistry,
};