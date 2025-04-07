import { Image } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import type { EditorExtension } from "@/helpers/prosekit/extension";
import type { MentionAccount } from "@/hooks/prosekit/useMentionQuery";
import useMentionQuery from "@/hooks/prosekit/useMentionQuery";
import { EditorRegex } from "@hey/data/regex";
import { useEditor } from "prosekit/react";
import {
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover
} from "prosekit/react/autocomplete";
import { useState } from "react";

interface MentionItemProps {
  onSelect: VoidFunction;
  account: MentionAccount;
}

const MentionItem = ({ onSelect, account }: MentionItemProps) => {
  return (
    <div className="m-0 p-0">
      <AutocompleteItem
        className="focusable-dropdown-item m-1.5 flex cursor-pointer items-center space-x-2 rounded-lg px-3 py-1 dark:text-white"
        onSelect={onSelect}
      >
        <Image
          alt={account.displayUsername}
          className="size-7 rounded-full border border-gray-200 bg-gray-200 dark:border-gray-700"
          height="28"
          src={account.picture}
          width="28"
        />
        <div className="flex flex-col truncate">
          <div>{account.name}</div>
          <span className="text-xs">{account.displayUsername}</span>
        </div>
      </AutocompleteItem>
    </div>
  );
};

const MentionPicker = () => {
  const editor = useEditor<EditorExtension>();
  const [queryString, setQueryString] = useState<string>("");
  const results = useMentionQuery(queryString);

  const handleAccountInsert = (account: MentionAccount) => {
    editor.commands.insertMention({
      id: account.address,
      kind: "account",
      value: account.username
    });
    editor.commands.insertText({ text: " " });
  };

  return (
    <AutocompletePopover
      className={cn(
        "z-10 block w-52 rounded-xl border border-gray-200 bg-white p-0 shadow-xs dark:border-gray-700 dark:bg-gray-900",
        !results.length && "hidden"
      )}
      offset={10}
      onQueryChange={setQueryString}
      regex={EditorRegex.mention}
    >
      <AutocompleteList
        className="divide-y divide-gray-200 dark:divide-gray-700"
        filter={null}
      >
        {results.map((account) => (
          <MentionItem
            key={account.address}
            onSelect={() => handleAccountInsert(account)}
            account={account}
          />
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
};

export default MentionPicker;
