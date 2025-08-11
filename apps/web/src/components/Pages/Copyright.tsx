import { memo } from "react";
import { Link } from "react-router";
import PageHeader from "@/components/Pages/PageHeader";
import PageLayout from "@/components/Shared/PageLayout";
import { H4 } from "@/components/Shared/UI";

const Copyright = () => {
  const updatedAt = "October 22, 2024";

  return (
    <PageLayout title="Copyright Policy">
      <PageHeader title="Copyright Policy" updatedAt={updatedAt} />
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg">
            <div className="!p-8 max-w-none text-gray-500 dark:text-gray-200">
              {/* Notification of Copyright Infringement begins */}
              <H4 className="mb-5">Notification of Copyright Infringement</H4>
              <div className="space-y-5">
                <p className="leading-7">
                  Hey ("Hey.xyz") respects the intellectual property rights of
                  others and expects its users to do the same.
                </p>
                <p className="leading-7">
                  It is Hey's policy, in appropriate circumstances and at its
                  discretion, to disable the accounts of users who repeatedly
                  infringe the copyrights of others.
                </p>
                <p className="linkify leading-7">
                  In accordance with the Digital Millennium Copyright Act of
                  1998, the text of which may be found on the U.S. Copyright
                  Office website at{" "}
                  <Link
                    target="_blank"
                    to="http://www.copyright.gov/legislation/dmca.pdf"
                  >
                    http://www.copyright.gov/legislation/dmca.pdf
                  </Link>
                  , Hey will respond expeditiously to claims of copyright
                  infringement committed using the Hey website, app, or other
                  Hey owned or controlled online network services accessible
                  through a mobile device or other type of device (the "Sites")
                  that are reported to Hey's Designated Copyright Agent,
                  identified in the sample notice below.
                </p>
                <p className="leading-7">
                  If you are a copyright owner, or are authorized to act on
                  behalf of one, or authorized to act under any exclusive right
                  under copyright, please report alleged copyright infringements
                  taking place on or through the Sites by completing the
                  following DMCA Notice of Alleged Infringement and delivering
                  it to Hey's Designated Copyright Agent. Upon receipt of the
                  Notice as described below, Hey will take whatever action, in
                  its sole discretion, it deems appropriate, including removal
                  of the challenged material from the Sites.
                </p>
              </div>
              {/* Notification of Copyright Infringement ends */}
              {/* DMCA Notice of Alleged Infringement ("Notice") begins */}
              <H4 className="mt-8 mb-5">
                DMCA Notice of Alleged Infringement ("Notice")
              </H4>
              <div className="space-y-5">
                <p className="leading-7">
                  1. Identify the copyrighted work that you claim has been
                  infringed, or – if multiple copyrighted works are covered by
                  this Notice – you may provide a representative list of the
                  copyrighted works that you claim have been infringed.
                </p>
                <p className="leading-7">
                  2. Identify the material that you claim is infringing (or to
                  be the subject of infringing activity) and that is to be
                  removed or access to which is to be disabled, and information
                  reasonably sufficient to permit us to locate the material,
                  including at a minimum, if applicable, the URL of the link
                  shown on the Site(s) where such material may be found.
                </p>
                <p className="leading-7">
                  3. Provide your mailing address, telephone number, and email
                  address.
                </p>
                <div className="space-y-5">
                  <p className="leading-7">
                    4. Include both of the following statements in the body of
                    the Notice:
                  </p>
                  <ul className="ml-5 list-inside list-disc space-y-5">
                    <li>
                      "I hereby state that I have a good faith belief that the
                      disputed use of the copyrighted material is not authorized
                      by the copyright owner, its agent, or the law (e.g., as a
                      fair use)."
                    </li>
                    <li>
                      "I hereby state that the information in this Notice is
                      accurate and, under penalty of perjury, that I am the
                      owner, or authorized to act on behalf of the owner, of the
                      copyright or of an exclusive right under the copyright
                      that is allegedly infringed."
                    </li>
                  </ul>
                </div>
                <p className="leading-7">
                  5. Provide your full legal name and your electronic or
                  physical signature.
                </p>
                <p className="leading-7">
                  Deliver this Notice, with all items completed, to Hey's
                  Designated Copyright Agent:
                </p>
                <p className="leading-7">
                  Hey Designated Copyright Agent: Yoginth
                </p>
                <p className="linkify leading-7">
                  Email:{" "}
                  <Link to="mailto:copyright@hey.xyz">copyright@hey.xyz</Link>
                </p>
              </div>
              {/* DMCA Notice of Alleged Infringement ("Notice") ends */}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default memo(Copyright);
