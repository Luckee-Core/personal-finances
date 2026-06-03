import type { Action } from '@reduxjs/toolkit';
import type { ThunkAction } from 'redux-thunk';
import type { RootState } from './store';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
