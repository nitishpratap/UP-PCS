const MAX_RICH_TEXT = 2000;

function chunkText(text, size = MAX_RICH_TEXT) {
    const chunks = [];

    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.slice(i, i + size));
    }

    return chunks.length ? chunks : [""];
}

function textSegments(content, annotations = {}) {
    const cleanAnnotations = {};

    if (annotations.bold) cleanAnnotations.bold = true;
    if (annotations.italic) cleanAnnotations.italic = true;
    if (annotations.strikethrough) cleanAnnotations.strikethrough = true;
    if (annotations.underline) cleanAnnotations.underline = true;
    if (annotations.code) cleanAnnotations.code = true;
    if (annotations.color && annotations.color !== "default") {
        cleanAnnotations.color = annotations.color;
    }

    return chunkText(content, MAX_RICH_TEXT).map((part) => ({
        type: "text",
        text: { content: part },
        ...(Object.keys(cleanAnnotations).length
            ? { annotations: cleanAnnotations }
            : {}),
    }));
}

function parseInlineMarkdown(text = "") {
    const segments = [];
    const pattern = /(\*\*(.+?)\*\*|(?<!\*)\*([^*\n]+)\*(?!\*)|`([^`\n]+)`)/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push(...textSegments(text.slice(lastIndex, match.index)));
        }

        if (match[2] !== undefined) {
            segments.push(...textSegments(match[2], { bold: true }));
        } else if (match[3] !== undefined) {
            segments.push(...textSegments(match[3], { italic: true }));
        } else if (match[4] !== undefined) {
            segments.push(...textSegments(match[4], { code: true }));
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        segments.push(...textSegments(text.slice(lastIndex)));
    }

    if (!segments.length) {
        segments.push(...textSegments(""));
    }

    return segments;
}

function paragraphBlock(text) {
    return {
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: parseInlineMarkdown(text) },
    };
}

function headingBlock(level, text) {
    const type = `heading_${level}`;
    return {
        object: "block",
        type,
        [type]: { rich_text: parseInlineMarkdown(text), color: "default" },
    };
}

function listBlock(type, text) {
    return {
        object: "block",
        type,
        [type]: { rich_text: parseInlineMarkdown(text) },
    };
}

function quoteBlock(text) {
    return {
        object: "block",
        type: "quote",
        quote: { rich_text: parseInlineMarkdown(text) },
    };
}

function calloutBlock(text, emoji = "💡", color = "gray_background") {
    return {
        object: "block",
        type: "callout",
        callout: {
            rich_text: parseInlineMarkdown(text),
            icon: { type: "emoji", emoji },
            color,
        },
    };
}

function codeBlock(text, language = "plain text") {
    return {
        object: "block",
        type: "code",
        code: {
            rich_text: textSegments(text),
            language,
        },
    };
}

function dividerBlock() {
    return {
        object: "block",
        type: "divider",
        divider: {},
    };
}

function toggleBlock(title, children = []) {
    return {
        object: "block",
        type: "toggle",
        toggle: {
            rich_text: parseInlineMarkdown(title),
            children,
        },
    };
}

function isTableLine(line) {
    return /^\|.*\|$/.test(line.trim());
}

function isTableSeparator(line) {
    return /^\|[\s:|-]+\|$/.test(line.trim());
}

function parseTableCells(line) {
    return line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim());
}

function looksLikeMarkdownTable(text) {
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length < 2) return false;

    const tableLines = lines.filter((line) => isTableLine(line));
    return tableLines.length >= 2;
}

function tableBlock(tableLines) {
    const rows = tableLines
        .filter((line) => !isTableSeparator(line))
        .map(parseTableCells)
        .filter((row) => row.some((cell) => cell.length > 0));

    if (!rows.length) {
        return paragraphBlock(tableLines.join("\n"));
    }

    const width = Math.max(...rows.map((row) => row.length));
    const normalizedRows = rows.map((row) => {
        const copy = [...row];
        while (copy.length < width) copy.push("");
        return copy.slice(0, width);
    });

    return {
        object: "block",
        type: "table",
        table: {
            table_width: width,
            has_column_header: true,
            children: normalizedRows.map((row) => ({
                object: "block",
                type: "table_row",
                table_row: {
                    cells: row.map((cell) => parseInlineMarkdown(cell)),
                },
            })),
        },
    };
}

function calloutFromQuoteLine(line) {
    const plain = line.replace(/\*\*/g, "");

    if (/sources:/i.test(plain)) {
        return calloutBlock(line, "📚", "blue_background");
    }

    if (/exam relevance:/i.test(plain)) {
        return calloutBlock(line, "🎯", "yellow_background");
    }

    return quoteBlock(line);
}

function isStructuralLine(trimmed) {
    const lower = trimmed.toLowerCase();
    return (
        trimmed.startsWith("#") ||
        trimmed.startsWith(">") ||
        /^[-*]\s+/.test(trimmed) ||
        /^\d+\.\s+/.test(trimmed) ||
        trimmed.startsWith("```") ||
        isTableLine(trimmed) ||
        /^---+$/.test(trimmed) ||
        lower === "<details>" ||
        lower === "</details>" ||
        lower.startsWith("<summary>")
    );
}

function parseDetailsChildren(contentLines) {
    const children = [];
    let i = 0;

    while (i < contentLines.length) {
        const trimmed = contentLines[i].trim();
        if (!trimmed) {
            i += 1;
            continue;
        }

        const paragraphLines = [contentLines[i]];
        i += 1;

        while (
            i < contentLines.length &&
            contentLines[i].trim() &&
            !isStructuralLine(contentLines[i].trim())
        ) {
            paragraphLines.push(contentLines[i]);
            i += 1;
        }

        children.push(paragraphBlock(paragraphLines.join("\n").trim()));
    }

    return children.length ? children : [paragraphBlock("")];
}

function parseDetailsBlock(lines, startIndex) {
    let i = startIndex + 1;
    let summary = "Show answer";
    const contentLines = [];

    if (
        i < lines.length &&
        lines[i].trim().toLowerCase().startsWith("<summary>")
    ) {
        summary = lines[i]
            .trim()
            .replace(/<\/?summary>/gi, "")
            .trim();
        i += 1;
    }

    while (i < lines.length && lines[i].trim().toLowerCase() !== "</details>") {
        contentLines.push(lines[i]);
        i += 1;
    }

    if (i < lines.length) {
        i += 1;
    }

    return {
        block: toggleBlock(summary, parseDetailsChildren(contentLines)),
        nextIndex: i,
    };
}

function markdownToBlocks(markdown, options = {}) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const blocks = [];
    let i = 0;
    let consumedHeader = false;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
            i += 1;
            continue;
        }

        if (!options.includeTitle && !consumedHeader && trimmed.startsWith("# ")) {
            consumedHeader = true;
            i += 1;

            while (i < lines.length) {
                const meta = lines[i].trim();
                if (!meta) {
                    i += 1;
                    continue;
                }
                if (meta.startsWith(">")) {
                    while (i < lines.length && lines[i].trim().startsWith(">")) {
                        const quoteLine = lines[i].trim().replace(/^>\s?/, "");
                        blocks.push(calloutFromQuoteLine(quoteLine));
                        i += 1;
                    }
                    continue;
                }
                if (meta === "---") {
                    i += 1;
                    break;
                }
                break;
            }

            if (blocks.length) {
                blocks.push(dividerBlock());
            }
            continue;
        }

        if (trimmed.startsWith("```")) {
            const language = trimmed.slice(3).trim() || "plain text";
            const codeLines = [];
            i += 1;

            while (i < lines.length && !lines[i].trim().startsWith("```")) {
                codeLines.push(lines[i]);
                i += 1;
            }

            const codeText = codeLines.join("\n");

            if (
                (language === "markdown" || language === "md") &&
                looksLikeMarkdownTable(codeText)
            ) {
                blocks.push(
                    tableBlock(
                        codeText
                            .split("\n")
                            .map((entry) => entry.trim())
                            .filter((entry) => entry && isTableLine(entry))
                    )
                );
            } else {
                blocks.push(codeBlock(codeText, language));
            }

            i += 1;
            continue;
        }

        if (isTableLine(trimmed)) {
            const tableLines = [];

            while (i < lines.length && isTableLine(lines[i].trim())) {
                tableLines.push(lines[i].trim());
                i += 1;
            }

            blocks.push(tableBlock(tableLines));
            continue;
        }

        if (/^---+$/.test(trimmed)) {
            blocks.push(dividerBlock());
            i += 1;
            continue;
        }

        if (trimmed.toLowerCase() === "<details>") {
            const details = parseDetailsBlock(lines, i);
            blocks.push(details.block);
            i = details.nextIndex;
            continue;
        }

        if (trimmed.startsWith("### ")) {
            blocks.push(headingBlock(3, trimmed.slice(4).trim()));
            i += 1;
            continue;
        }

        if (trimmed.startsWith("## ")) {
            const heading = trimmed.slice(3).trim();

            if (heading === "One Page Revision") {
                blocks.push(headingBlock(2, heading));
                i += 1;

                if (i < lines.length && lines[i].trim().startsWith("```")) {
                    i += 1;
                    const revisionLines = [];
                    while (i < lines.length && !lines[i].trim().startsWith("```")) {
                        revisionLines.push(lines[i]);
                        i += 1;
                    }
                    i += 1;

                    blocks.push(
                        toggleBlock(
                            "Quick revision sheet",
                            revisionLines
                                .filter(Boolean)
                                .map((entry) => paragraphBlock(entry))
                        )
                    );
                }
                continue;
            }

            blocks.push(headingBlock(2, heading));
            i += 1;
            continue;
        }

        if (trimmed.startsWith("# ")) {
            blocks.push(headingBlock(1, trimmed.slice(2).trim()));
            i += 1;
            continue;
        }

        if (trimmed.startsWith(">")) {
            while (i < lines.length && lines[i].trim().startsWith(">")) {
                const quoteLine = lines[i].trim().replace(/^>\s?/, "");
                blocks.push(calloutFromQuoteLine(quoteLine));
                i += 1;
            }
            continue;
        }

        if (/^[-*]\s+/.test(trimmed)) {
            blocks.push(listBlock("bulleted_list_item", trimmed.replace(/^[-*]\s+/, "")));
            i += 1;
            continue;
        }

        if (/^\d+\.\s+/.test(trimmed)) {
            blocks.push(
                listBlock("numbered_list_item", trimmed.replace(/^\d+\.\s+/, ""))
            );
            i += 1;
            continue;
        }

        const paragraphLines = [line];
        i += 1;

        while (i < lines.length && lines[i].trim() && !isStructuralLine(lines[i].trim())) {
            paragraphLines.push(lines[i]);
            i += 1;
        }

        const paragraphText = paragraphLines.join("\n").trim();

        if (/^\*\*Q\d+\./i.test(paragraphText)) {
            blocks.push(calloutBlock(paragraphText, "✅", "green_background"));
        } else if (/^\*\*Ans:\*\*/i.test(paragraphText)) {
            blocks.push(calloutBlock(paragraphText, "✔️", "gray_background"));
        } else {
            blocks.push(paragraphBlock(paragraphText));
        }
    }

    return blocks;
}

module.exports = {
    markdownToBlocks,
    parseInlineMarkdown,
    MAX_RICH_TEXT,
};
