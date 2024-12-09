import { create } from 'zustand';

export const useNicknameStore = create((set) => ({
  nickname: '',
  setNickname: (newNickname) => set({ nickname: newNickname }),
}));

export const useMembershipStore = create((set) => ({
  selectedCrewAccount: null,
  selectedMyAccount: null,
  setSelectedCrewAccount: (account) => set({ selectedCrewAccount: account }),
  setSelectedMyAccount: (account) => set({ selectedMyAccount: account }),
}));
