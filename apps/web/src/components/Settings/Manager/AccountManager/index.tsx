import { Button, Modal, Tabs } from "@/components/Shared/UI";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import AddAccountManager from "./AddAccountManager";
import Managed from "./Management/Managed";
import Unmanaged from "./Management/Unmanaged";
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
      <div className="mx-5 mt-5 flex items-center justify-between">
        <Tabs
          tabs={tabs}
          active={type}
          setActive={(type) => setType(type as Type)}
          className="mx-5 md:mx-0"
          layoutId="account-manager-tabs"
        />
        {type === Type.MANAGERS && (
          <>
            <Button
              icon={<PlusCircleIcon className="size-4" />}
              onClick={() => setShowAddManagerModal(true)}
              size="sm"
            >
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
