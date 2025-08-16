import LoginButton from "@/components/Shared/LoginButton";
import { H3 } from "@/components/Shared/UI";
import Footer from "./Footer";
import PageLayout from "./PageLayout";

const NotLoggedIn = () => {
  return (
    <PageLayout sidebar={<Footer />} title="Not logged in">
      <div className="p-10 text-center">
        <H3 className="mb-4">Not logged in!</H3>
        <div className="mb-4">Log in to continue</div>
        <LoginButton />
      </div>
    </PageLayout>
  );
};

export default NotLoggedIn;
