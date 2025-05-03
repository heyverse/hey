import { PageLayout } from "./PageLayout";
import SiteError from "./SiteError";

const Custom500 = () => {
  return (
    <PageLayout title="500">
      <SiteError />
    </PageLayout>
  );
};

export default Custom500;
