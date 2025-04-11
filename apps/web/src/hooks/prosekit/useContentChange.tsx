import type { EditorExtension } from "@/helpers/prosekit/extension";
import { getMarkdownContent } from "@/helpers/prosekit/markdownContent";
import useDebouncedCallback from "@/hooks/prosekit/useDebouncedCallback";
import { usePostStore } from "@/store/non-persisted/post/usePostStore";
import type { Editor } from "prosekit/core";
import { useDocChange } from "prosekit/react";
import { useCallback, useState } from "react";

const DEBOUNCE_CHARS_THRESHOLD = 3000;
const DEBOUNCE_DELAY = 500;

const useContentChange = (editor: Editor<EditorExtension>) => {
  const { setPostContent } = usePostStore();
  const [largeDocument, setLargeDocument] = useState(false);

  const updatePostContent = useCallback(
    (markdown: string) => {
      setLargeDocument(markdown.length > DEBOUNCE_CHARS_THRESHOLD);
      setPostContent(markdown);
    },
    [setPostContent]
  );

  const serializeContent = useCallback(() => {
    const markdown = getMarkdownContent(editor);
    updatePostContent(markdown);
  }, [editor, updatePostContent]);

  // Determine debounce delay based on document size
  const delay = largeDocument ? DEBOUNCE_DELAY : 0;
  const debouncedSetContent = useDebouncedCallback(serializeContent, delay);

  useDocChange(debouncedSetContent, { editor });
};

export default useContentChange;
