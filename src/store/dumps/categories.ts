import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '@/model/category';

const initialState: Record<string, Category> = {};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (_state, action: PayloadAction<Record<string, Category>>) => action.payload,
    upsertCategory: (state, action: PayloadAction<Category>) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const CategoriesActions = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;
