import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { userApi } from "../user/admin-user-service"

export const store = configureStore({
      reducer: {
            [userApi.reducerPath]: userApi.reducer,
            [categoryApi.reducerPath]: categoryApi.reducer,
            [productApi.reducerPath]: productApi.reducer,
            [ingredientApi.reducerPath]: ingredientApi.reducer,
            users: userReducer,
            categories: categoryReducer,
            products: productReducer,
            ingredients: ingredientReducer,
            ui: uiReducer,
      },
      middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                  userApi.middleware,
                  categoryApi.middleware,
                  productApi.middleware,
                  ingredientApi.middleware,
            ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
