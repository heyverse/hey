import type { EditorExtension } from "@helpers/prosekit/extension";
import { setMarkdownContent } from "@helpers/prosekit/markdownContent";
import type { Editor } from "prosekit/core";
import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface EditorHandle {
  insertText: (text: string) => void;
  setMarkdown: (markdown: string) => void;
}

const HandleContext = createContext<EditorHandle | null>(null);
const SetHandleContext = createContext<((handle: EditorHandle) => void) | null>(
  null
);

interface EditorProps {
  children: ReactNode;
}

const Provider: FC<EditorProps> = ({ children }) => {
  const [handle, setHandle] = useState<EditorHandle | null>(null);

  return (
    <HandleContext.Provider value={handle}>
      <SetHandleContext.Provider value={setHandle}>
        {children}
      </SetHandleContext.Provider>
    </HandleContext.Provider>
  );
};

export const useEditorContext = (): EditorHandle | null => {
  return useContext(HandleContext);
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
