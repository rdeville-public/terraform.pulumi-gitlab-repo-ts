// commitlint.config.js
// emojis like "✅ ", "😂 ", ...
const matchAnyEmojiWithSpaceAfter =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])\s/;
const subjectThatDontStartWithBracket = /([^\[].+)/; // "Add tests" but don't allow "[ Add tests"

module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: new RegExp(
        "^" +
          matchAnyEmojiWithSpaceAfter.source +
          subjectThatDontStartWithBracket.source +
          "$"
      ),
      headerCorrespondence: ["emoji", "subject"],
    },
  },
  plugins: [
    {
      rules: {
        "header-match-pattern": (parsed) => {
          const { emoji, subject } = parsed;
          if (emoji === null && subject === null) {
            return [false, "header must be in format '✅ Add tests'"];
          }
          return [true, ""];
        },
      },
    },
  ],
  rules: {
    "header-match-pattern": [2, "always"],
  },
};
