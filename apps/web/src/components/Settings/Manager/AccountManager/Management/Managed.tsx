import List from "./List";

const Managed = () => {
  return (
    <div className="pt-2">
      <div className="mx-5 mb-5">
        Accounts under your oversight and management.
      </div>
      <div className="divider" />
      <div className="mx-5 my-3">
        <List managed />
      </div>
    </div>
  );
};

export default Managed;
