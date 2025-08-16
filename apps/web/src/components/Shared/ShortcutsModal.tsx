import KeyboardShortcuts from "@/helpers/shortcuts";

const ShortcutsModal = () => {
  return (
    <div className="max-h-[60vh] overflow-y-auto p-5">
      <ul className="space-y-2">
        {Object.entries(KeyboardShortcuts).map(([id, shortcut]) => (
          <li
            className="flex items-center justify-between rounded-md bg-gray-100 p-2 dark:bg-gray-700"
            key={id}
          >
            <span className="font-mono text-sm">{shortcut.key}</span>
            <span className="text-sm">{shortcut.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShortcutsModal;
