import LoginButton from "@/components/Shared/LoginButton";
import { H3 } from "@/components/Shared/UI";
import Footer from "./Footer";
import { GeneralPageLayout } from "./PageLayout";

const NotLoggedIn = () => {
  return (
    <GeneralPageLayout title="Not logged in" sidebar={<Footer />}>
      <div className="p-10 text-center">
        <H3 className="mb-4">Not logged in!</H3>
        <div className="mb-4">Log in to continue</div>
        <LoginButton />
      </div>
    </GeneralPageLayout>
  );
};

export default NotLoggedIn;
