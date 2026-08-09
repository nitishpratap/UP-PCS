if (!process.argv.some((arg) => arg.startsWith("--preset"))) {
    process.argv.push("--preset=env");
}
if (
    !process.argv.includes("--no-replace") &&
    !process.argv.includes("--append")
) {
    process.argv.push("--replace");
}
require("./import-subject.js");
