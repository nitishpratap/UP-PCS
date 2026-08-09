const path = require("path");

const SUBJECT_OPTIONS = [
    { name: "Environment & Ecology", color: "green" },
    { name: "Art and Culture", color: "purple" },
    { name: "Polity", color: "blue" },
    { name: "History", color: "brown" },
    { name: "Modern History", color: "red" },
    { name: "Medieval India", color: "orange" },
    { name: "Geography", color: "yellow" },
    { name: "Economy", color: "purple" },
    { name: "Science", color: "pink" },
    { name: "Ethics", color: "gray" },
    { name: "Hindi", color: "default" },
    { name: "Current Affairs", color: "red" },
];

const SUBJECT_PRESETS = {
    env: {
        subject: "Environment & Ecology",
        dir: path.resolve(__dirname, "../../subjects/environments & ecology"),
    },
    art: {
        subject: "Art and Culture",
        dir: path.resolve(__dirname, "../../subjects/art and culture"),
    },
};

module.exports = {
    SUBJECT_OPTIONS,
    SUBJECT_PRESETS,
};
