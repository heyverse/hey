import { Link } from "react-router";
import { Button, H3 } from "@/components/Shared/UI";
import PageLayout from "./PageLayout";

const Custom404 = () => {
  return (
    <PageLayout title="404">
      <div className="p-10 text-center">
        <H3 className="mb-4">Oops, Lost‽</H3>
        <div className="mb-4">This page could not be found.</div>
        <Link to="/">
          <Button className="mx-auto flex items-center">Go to home</Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default Custom404;
