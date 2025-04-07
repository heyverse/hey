import { Button, H3 } from "@/components/Shared/UI";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import Footer from "./Footer";
import { GeneralPageLayout } from "./PageLayout";

const Custom404 = () => {
  return (
    <GeneralPageLayout title="400" sidebar={<Footer />}>
      <div className="p-10 text-center">
        <H3 className="mb-4">Oops, Lost‽</H3>
        <div className="mb-4">This page could not be found.</div>
        <Link to="/">
          <Button
            className="mx-auto flex items-center"
            icon={<HomeIcon className="size-4" />}
          >
            Go to home
          </Button>
        </Link>
      </div>
    </GeneralPageLayout>
  );
};

export default Custom404;
