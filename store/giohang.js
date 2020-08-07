export const state = () => ({
  soLuong: 0
});

export const mutations = {
  add(state, number) {
    state.soLuong = number
  },
  remove(state) {
    state.soLuong = 0
  },
};
