import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LlmModel } from '@/model/llm-model';

const initialState: Record<string, LlmModel> = {};

const toLlmModelsMap = (models: LlmModel[]): Record<string, LlmModel> =>
  models.reduce<Record<string, LlmModel>>((acc, row) => {
    acc[row.model] = row;
    return acc;
  }, {});

export const llmModelsSlice = createSlice({
  name: 'llmModels',
  initialState,
  reducers: {
    setLlmModels: (_state, action: PayloadAction<LlmModel[]>) => toLlmModelsMap(action.payload),
  },
});

export const LlmModelsActions = llmModelsSlice.actions;
export const llmModelsReducer = llmModelsSlice.reducer;
