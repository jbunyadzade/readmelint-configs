const H_LEVELS = {
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
};

function findHeadingChildren(headingToken, idx, tokens) {
    const restTokens = tokens.slice(idx + 1);
    const nextHeadingIdx = restTokens.findIndex(
        (token) => token.type === "heading_open" && H_LEVELS[token.tag] <= H_LEVELS[headingToken.tag],
    );
    const childrenTokens = restTokens.slice(0, nextHeadingIdx);
    return childrenTokens;
}

module.exports = {
    names: ["no-empty-headings"],
    description: "Headings must be followed by content",
    tags: ["no-blank-headings"],
    function: function noEmptyHeadings(params, onError) {
        const { tokens } = params;
        tokens.forEach((token, idx) => {
            if (token.type === "heading_close") {
                const childrenTokens = findHeadingChildren(token, idx, tokens);

                const onlyHasComments =
                    childrenTokens.filter((token) => token.type === "html_block").length === childrenTokens.length;

                if (childrenTokens.length === 0 || onlyHasComments) {
                    onError({
                        lineNumber: tokens[idx - 1].lineNumber,
                        context: tokens[idx - 1].line,
                    });
                }
            }
        });
    },
};
