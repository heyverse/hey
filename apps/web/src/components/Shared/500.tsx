import { Button, H3 } from "@/components/Shared/UI";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Footer from "./Footer";
import { PageLayout } from "./PageLayout";

const Custom500 = () => {
  const clearLocalData = () => {
    localStorage.clear();
    setTimeout(() => location.reload(), 200);
  };

  return (
    <PageLayout
      title="500"
      sidebar={<Footer />}
      sidebarPosition="right"
      showSearch
    >
      <div className="p-10 text-center">
        <H3 className="mb-4">Looks like something went wrong!</H3>
        <div className="mb-4 text-gray-500 dark:text-gray-200">
          We track these errors automatically, but if the problem persists feel
          free to contact us. In the meantime, try refreshing.
        </div>
        <Button
          className="mx-auto flex items-center"
          icon={<ArrowPathIcon className="size-4" />}
          onClick={() => clearLocalData()}
        >
          Clear cache and refresh
        </Button>
      </div>
    </PageLayout>
  );
};

export default Custom500;
