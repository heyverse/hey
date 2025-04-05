import { APP_NAME } from "@hey/data/constants";

interface MetaTagsProps {
  title?: string;
}

const MetaTags = ({ title = APP_NAME }: MetaTagsProps) => {
  return <title>{title}</title>;
};

export default MetaTags;
