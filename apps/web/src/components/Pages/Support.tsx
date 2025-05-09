import { PageLayout } from "@/components/Shared/PageLayout";
import { Card, H3 } from "@/components/Shared/UI";
import { Link } from "react-router";

const Support = () => {
  return (
    <PageLayout title="Support">
      <Card className="flex flex-col items-center p-8">
        <div className="linkify max-w-xl text-center">
          <H3>Support</H3>
          <p className="mt-3">
            For assistance, please email us at{" "}
            <Link to="mailto:support@hey.xyz">support@hey.xyz</Link> with a
            detailed description of your issue and how we can assist you.
          </p>
          <div className="my-5 flex flex-col space-y-2">
            <Link to="/guidelines">Community Guidelines</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Hey Privacy Policy</Link>
            <Link
              to="https://www.lens.xyz/privacy"
              target="_blank"
            >
              Lens Privacy Policy
            </Link>
            <Link to="/copyright">Copyright Policy</Link>
          </div>
          <p className="text-gray-500 text-sm">
            Send any legal requests to{" "}
            <Link to="mailto:legal@hey.xyz">legal@hey.xyz</Link>
          </p>
        </div>
      </Card>
    </PageLayout>
  );
};

export default Support;
