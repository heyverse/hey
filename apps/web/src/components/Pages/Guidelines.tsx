import { Link } from "react-router";
import PageHeader from "@/components/Pages/PageHeader";
import PageLayout from "@/components/Shared/PageLayout";
import { H4 } from "@/components/Shared/UI";

const Guidelines = () => {
  return (
    <PageLayout title="Community Guidelines">
      <PageHeader title="Community Guidelines" />
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg">
            <div className="!p-8 max-w-none text-gray-500 dark:text-gray-200">
              <div className="space-y-5">
                <p className="leading-7">
                  To protect all users on Hey and to prevent spam, we put some
                  rules in place. Please read them carefully and remember them
                  whenever you are posting something on Hey or you are changing
                  your Account.
                </p>
              </div>
              {/* Safety begins */}
              <H4 className="mt-8 mb-5">Safety</H4>
              <div className="space-y-5">
                <p className="leading-7">
                  You are not allowed to display, share or promote any form of
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li>Violence</li>
                  <li>Abuse</li>
                  <li>Harassment</li>
                  <li>Hateful speech</li>
                  <li>
                    Harmful content (including self-harm and suicidal content)
                  </li>
                  <li>Illegal/unlawful content</li>
                </ul>
              </div>
              {/* Safety ends */}
              {/* Nudity begins */}
              <H4 className="mt-8 mb-5">Nudity</H4>
              <div className="space-y-5">
                <p className="leading-7">
                  Hey is not a place to display, share or promote any form of
                  the following types of content:
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li>Nudity</li>
                  <li>Sexual content</li>
                </ul>
                <p className="leading-7">
                  Please try to keep Hey family-friendly (especially considering
                  all Images, Videos, Audios and Links).
                </p>
              </div>
              {/* Nudity ends */}
              {/* Spam begins */}
              <H4 className="mt-8 mb-5">Spam</H4>
              <div className="space-y-5">
                <p className="leading-7">
                  You are not allowed to use Hey as a platform to
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li>Manipulate other users</li>
                  <li>Create a large amount of Accounts</li>
                  <li>
                    Share excessive amounts of content of any type ("Spam")
                  </li>
                  <li>Airdrop farming</li>
                </ul>
                <p className="leading-7">
                  If your account got suspended, you are not allowed to create
                  any new accounts.
                </p>
              </div>
              {/* Spam ends */}
              {/* Impersonation begins */}
              <H4 className="mt-8 mb-5">Impersonation</H4>
              <div className="space-y-5">
                <p className="leading-7">
                  You are not allowed to impersonate other people on Hey.
                </p>
                <p className="leading-7">
                  We understand that some of you like to create Accounts with
                  the names of popular persons as a parody. If you do something
                  like this, please use the "About me" section on your Account
                  to inform other users that your Account is a parody account.
                  You must do this in a way which can be easily seen and
                  understood by other users.
                </p>
                <H4 className="mt-8 mb-5">Suspension</H4>
                <p className="leading-7">
                  Account suspension applies only to Hey and not to Lens.
                  Decisions to suspend an account are made by the Hey team and
                  are not automated.
                </p>
                <p className="leading-7">
                  We reserve the right to take down any account that violates
                  these guidelines, with or without prior notice.
                </p>
                <p className="font-bold leading-7">
                  This is a Hey-specific decision / feature and not a
                  protocol-level decision / feature.
                </p>
              </div>
              {/* Impersonation ends */}
              {/* Copyright and Trademarks begins */}
              <H4 className="mt-8 mb-5">Copyright and Trademarks</H4>
              <p className="leading-7">
                You are not allowed to violate any intellectual property rights,
                including copyright and trademark, of others.
              </p>
              {/* Copyright and Trademarks ends */}
              {/* Feedback begins */}
              <H4 className="mt-8 mb-5">Feedback</H4>
              <p className="linkify leading-7">
                If you have any feedback on these rules or if you have any
                questions, please <Link to="/support">Contact us</Link>.
              </p>
              {/* Feedback ends */}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Guidelines;
