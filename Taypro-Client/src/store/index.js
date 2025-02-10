import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import { Provider } from "react-redux";
import layoutSlice from "./slices/layoutSlice";
import userSlice from "./slices/userSlice";

const persistConfig = {
    key: "root",
    storage,
    serializeableCheck: false,
};

const rootReducer = combineReducers({
    layout: layoutSlice,
    user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;
