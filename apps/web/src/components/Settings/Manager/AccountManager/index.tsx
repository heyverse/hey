import { useState } from "react";
import Managed from "@/components/Settings/Manager/AccountManager/Management/Managed";
import Unmanaged from "@/components/Settings/Manager/AccountManager/Management/Unmanaged";
import { Button, Modal, Tabs } from "@/components/Shared/UI";
import AddAccountManager from "./AddAccountManager";
import Managers from "./Managers";

enum Type {
  MANAGED = "MANAGED",
  MANAGERS = "MANAGERS",
  UNMANAGED = "UNMANAGED"
}

const AccountManager = () => {
  const [type, setType] = useState<Type>(Type.MANAGERS);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);

  const tabs = [
    { name: "Managers", type: Type.MANAGERS },
    { name: "Managed", type: Type.MANAGED },
    { name: "Un-managed", type: Type.UNMANAGED }
  ];

  return (
    <div className="linkify space-y-2">
      <div className="mx-5 mt-5 flex flex-wrap items-center justify-between gap-5">
        <Tabs
          active={type}
          layoutId="account_manager_tab"
          setActive={(tabType) => {
            const nextType = tabType as Type;
            setType(nextType);
          }}
          tabs={tabs}
        />
        {type === Type.MANAGERS && (
          <>
            <Button onClick={() => setShowAddManagerModal(true)} size="sm">
              Add manager
            </Button>
            <Modal
              onClose={() => setShowAddManagerModal(false)}
              show={showAddManagerModal}
              title="Add Account Manager"
            >
              <AddAccountManager
                setShowAddManagerModal={setShowAddManagerModal}
              />
            </Modal>
          </>
        )}
      </div>
      {type === Type.MANAGERS && <Managers />}
      {type === Type.MANAGED && <Managed />}
      {type === Type.UNMANAGED && <Unmanaged />}
    </div>
  );
};

export default AccountManager;
