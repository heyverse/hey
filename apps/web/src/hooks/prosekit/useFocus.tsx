import type { Editor } from "prosekit/core";
import { useEffect } from "react";
import type { EditorExtension } from "@/helpers/prosekit/extension";

const useFocus = (editor: Editor<EditorExtension>, isComment: boolean) => {
  useEffect(() => {
    if (!isComment) {
      editor.focus();
    }
  }, [editor, isComment]);
};

export default useFocus;
