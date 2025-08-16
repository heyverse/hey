import List from "./List";

const Managers = () => {
  return (
    <div className="pt-2">
      <div className="mx-5 mb-5">
        Accounts with control over your account can act on your behalf.
      </div>
      <div className="divider" />
      <List />
    </div>
  );
};

export default Managers;
