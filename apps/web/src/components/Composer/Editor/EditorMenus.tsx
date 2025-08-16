import EmojiPicker from "./EmojiPicker";
import InlineMenu from "./InlineMenu";
import MentionPicker from "./MentionPicker";

const EditorMenus = () => {
  return (
    <>
      <InlineMenu />
      <MentionPicker />
      <EmojiPicker />
    </>
  );
};

export default EditorMenus;
