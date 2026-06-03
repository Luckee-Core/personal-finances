import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DashboardTimePeriod } from '@/model/dashboard/time-period';

type DashboardBuilderState = {
  timePeriod: DashboardTimePeriod;
  filteredCategory: string | null;
};

const initialState: DashboardBuilderState = {
  timePeriod: 'this_month',
  filteredCategory: null,
};

export const dashboardBuilderSlice = createSlice({
  name: 'dashboardBuilder',
  initialState,
  reducers: {
    setTimePeriod: (state, action: PayloadAction<DashboardTimePeriod>) => {
      state.timePeriod = action.payload;
    },
    setFilteredCategory: (state, action: PayloadAction<string | null>) => {
      state.filteredCategory = action.payload;
    },
    reset: () => initialState,
  },
});

export const DashboardBuilderActions = dashboardBuilderSlice.actions;
export const dashboardBuilderReducer = dashboardBuilderSlice.reducer;
