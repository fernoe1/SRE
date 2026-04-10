import { createContext, useReducer } from "react";

export const BasketContext = createContext();

const basketReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return { basket: action.payload };

    case "ADD":
      return { basket: [...state.basket, action.payload] };

    case "REMOVE":
      return {
        basket: state.basket.filter(
          item =>
            item.sneaker._id !== action.payload.sneakerId ||
            item.size !== action.payload.size
        )
      };

    case "CLEAR":
      return { basket: [] };

    default:
      return state;
  }
};

export const BasketContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(basketReducer, {
    basket: []
  });

  return (
    <BasketContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BasketContext.Provider>
  );
};
