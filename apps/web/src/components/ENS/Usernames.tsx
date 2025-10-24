import { HEY_ENS_NAMESPACE } from "@hey/data/constants";
import { useUsernamesQuery } from "@hey/indexer";
import { Card, Image } from "@/components/Shared/UI";

const Usernames = () => {
  const { data } = useUsernamesQuery({
    variables: { request: { filter: { namespace: HEY_ENS_NAMESPACE } } }
  });

  const usernames = data?.usernames?.items;

  if (usernames?.length === 0) {
    return null;
  }

  return (
    <Card className="mt-5 space-y-2 p-5">
      {usernames?.map((username) => (
        <div key={username.localName}>
          <div className="flex items-center gap-x-2">
            <Image
              className="size-4"
              src="https://ens.domains/assets/brand/mark/ens-mark-Blue.svg"
            />
            <div>
              <b>{username.localName}</b>.hey.xyz
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default Usernames;
