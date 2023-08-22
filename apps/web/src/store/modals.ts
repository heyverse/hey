import type { Profile, Publication } from '@lenster/lens';
import { create } from 'zustand';

export enum PublicationTypes {
  Post = 'POST',
  Spaces = 'SPACES',
  Comment = 'COMMENT',
  Mirror = 'MIRROR'
}

interface GlobalModalState {
  showAuthModal: boolean;
  setShowAuthModal: (showAuthModal: boolean) => void;
  showNewPublicationModal: boolean;
  modalPublicationType: PublicationTypes;
  setShowNewPublicationModal: (
    showNewPublicationModal: boolean,
    modalPublicationType: PublicationTypes
  ) => void;
  showDiscardModal: boolean;
  setShowDiscardModal: (showDiscardModal: boolean) => void;
  showStatusModal: boolean;
  setShowStatusModal: (showStatusModal: boolean) => void;
  showProfileSwitchModal: boolean;
  setShowProfileSwitchModal: (showProfileSwitchModal: boolean) => void;
  showMobileDrawer: boolean;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
  showInvitesModal: boolean;
  setShowInvitesModal: (showInvitesModal: boolean) => void;
  showPublicationReportModal: boolean;
  reportingPublication: Publication | null;
  setShowPublicationReportModal: (
    showPublicationReportModal: boolean,
    reportingPublication: Publication | null
  ) => void;
  showReportProfileModal: boolean;
  reportingProfile: Profile | null;
  setShowReportProfileModal: (
    reportProfileModal: boolean,
    reportingProfile: Profile | null
  ) => void;
}

export const useGlobalModalStateStore = create<GlobalModalState>((set) => ({
  showAuthModal: false,
  setShowAuthModal: (showAuthModal) => set(() => ({ showAuthModal })),
  showNewPublicationModal: false,
  modalPublicationType: PublicationTypes.Post,
  setShowNewPublicationModal: (showNewPublicationModal, modalPublicationType) =>
    set(() => ({ showNewPublicationModal, modalPublicationType })),
  showDiscardModal: false,
  setShowDiscardModal: (showDiscardModal) => set(() => ({ showDiscardModal })),
  showPublicationReportModal: false,
  showStatusModal: false,
  setShowStatusModal: (showStatusModal) => set(() => ({ showStatusModal })),
  showProfileSwitchModal: false,
  setShowProfileSwitchModal: (showProfileSwitchModal) =>
    set(() => ({ showProfileSwitchModal })),
  showMobileDrawer: false,
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer })),
  showInvitesModal: false,
  setShowInvitesModal: (showInvitesModal) => set(() => ({ showInvitesModal })),
  reportingPublication: null,
  setShowPublicationReportModal: (
    showPublicationReportModal,
    reportingPublication
  ) =>
    set(() => ({
      showPublicationReportModal,
      reportingPublication
    })),
  showReportProfileModal: false,
  reportingProfile: null,
  setShowReportProfileModal: (showReportProfileModal, reportingProfile) =>
    set(() => ({ showReportProfileModal, reportingProfile }))
}));
