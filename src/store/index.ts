import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import conversationsReducer from './conversationsSlice';
import messagesReducer from './messagesSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationsReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['messages/addMessage'],
        ignoredPaths: ['messages.messagesByConversation'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
