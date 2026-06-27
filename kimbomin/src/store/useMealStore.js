import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_MEAL_BASE_URL;

const useMealStore = create((set, get) => ({
  categories: [],
  selectedCategory: "Beef",
  query: "",
  selectedMeal: null,

  setQuery: (query) => set({ query }),
  setCategory: (selectedCategory) => set({ selectedCategory }),
  closeModal: () => set({ selectedMeal: null }),

  // 카테고리 목록은 처음 한 번만 받아오면 되기에 store에 저장
  fetchCategories: async () => {
    const res = await axios.get(`${BASE_URL}/categories.php`);
    set({ categories: res.data.categories });
  },

  // 검색어 있으면 검색, 없으면 카테고리별 조회
  // 데이터는 store에 안 넣고 리액트 쿼리가 관리하도록 return
  fetchMeals: async () => {
    const { selectedCategory, query } = get();
    const url = query
      ? `${BASE_URL}/search.php?s=${query}`
      : `${BASE_URL}/filter.php?c=${selectedCategory}`;
    const res = await axios.get(url);
    return res.data.meals || [];
  },

  // 카드 클릭 시 상세 정보 받아서 모달에 띄우기
  fetchMealDetail: async (id) => {
    const res = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
    set({ selectedMeal: res.data.meals[0] });
  },
}));

export default useMealStore;
