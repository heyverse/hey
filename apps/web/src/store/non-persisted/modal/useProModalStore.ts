import { createAtomStore } from "@/store/createAtomStore";

const { useStore } = createAtomStore(false);

const useProModal = () => {
  const [showProModal, setShowProModal] = useStore();
  return { setShowProModal, showProModal };
};

export { useProModal };
