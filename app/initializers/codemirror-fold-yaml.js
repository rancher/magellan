export function initialize(/* application */) {
  function isLineComment(cm, lineNo) {
    return /\bcomment\b/.test(cm.getTokenTypeAt(CodeMirror.Pos(lineNo, 0)));
  }

  function lineIndent(cm, lineNo) {
    var text = cm.getLine(lineNo).substr(1);
    var spaceTo = text.search(/\S/);

    if (spaceTo === -1 ) {
      return -1;
    }

    let out = CodeMirror.countColumn(text, null, cm.getOption('tabSize'));

    return out;
  }

  if ( typeof window === 'undefined' || typeof window.CodeMirror === 'undefined' ) {
    return;
  }

  const CodeMirror = window.CodeMirror;

  CodeMirror.registerHelper('fold', 'yaml', (cm, start) => {
    if ( !isLineComment(cm, start.line) ) {
      return;
    }

    var myIndent = lineIndent(cm, start.line);

    if (myIndent < 0) {
      return;
    }

    var lastLineInFold = null;

    // Go through lines until we find a line that definitely doesn't belong in
    // the block we're folding, or to the end.
    for (var i = start.line + 1, end = cm.lastLine(); i <= end; ++i) {
      if ( !isLineComment(cm, i) ) {
        break;
      }

      var indent = lineIndent(cm, i);

      if (indent === -1) {
        // empty?
      } else if (indent > myIndent) {
        // Lines with a greater indent are considered part of the block.
        lastLineInFold = i;
      } else {
        // If this line has non-space, non-comment content, and is
        // indented less or equal to the start line, it is the start of
        // another block.
        break;
      }
    }

    if (lastLineInFold) {
      return {
        from: CodeMirror.Pos(start.line, cm.getLine(start.line).length),
        to:   CodeMirror.Pos(lastLineInFold, cm.getLine(lastLineInFold).length)
      }
    }
  });
}

export default {
  name:       'codemirror-fold-yaml',
  initialize
};
