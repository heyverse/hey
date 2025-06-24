import type { Editor } from "prosekit/core";
import type { FC, MutableRefObject, ReactNode } from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import type { EditorExtension } from "@/helpers/prosekit/extension";
import { setMarkdownContent } from "@/helpers/prosekit/markdownContent";

interface EditorHandle {
  insertText: (text: string) => void;
  setMarkdown: (markdown: string) => void;
}

const HandleContext =
  createContext<MutableRefObject<EditorHandle | null> | null>(null);
const SetHandleContext = createContext<((handle: EditorHandle) => void) | null>(
  null
);

interface EditorProps {
  children: ReactNode;
}

const Provider = ({ children }: EditorProps) => {
  const handleRef = useRef<EditorHandle | null>(null);

  const setHandle = (handle: EditorHandle) => {
    handleRef.current = handle;
  };

  return (
    <HandleContext.Provider value={handleRef}>
      <SetHandleContext.Provider value={setHandle}>
        {children}
      </SetHandleContext.Provider>
    </HandleContext.Provider>
  );
};

export const useEditorContext = (): EditorHandle | null => {
  return useContext(HandleContext)?.current ?? null;
};

export const useEditorHandle = (editor: Editor<EditorExtension>) => {
  const setHandle = useContext(SetHandleContext);

  useEffect(() => {
    const handle: EditorHandle = {
      insertText: (text: string): void => {
        if (!editor.mounted) {
          return;
        }

        editor.commands.insertText({ text });
      },
      setMarkdown: (markdown: string): void => {
        setMarkdownContent(editor, markdown);
      }
    };

    setHandle?.(handle);
  }, [setHandle, editor]);
};

export const withEditorContext = <Props extends object>(
  Component: FC<Props>
): FC<Props> => {
  const WithEditorContext: FC<Props> = (props: Props) => {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  };

  return WithEditorContext;
};
