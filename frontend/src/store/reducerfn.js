// reducerfn.js
import initialState from "./initialState";

const reducerfn = (state = initialState, action) => {
  switch (action.type) {
    case "set-user":
      return {
        ...state,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          userName: action.payload.userName,
        },
      };

    case "set-cart":
      return {
        ...state,
        cart: {
          products: action.payload.products || [],
          totalPrice: action.payload.totalPrice || 0,
          totalShipping: action.payload.totalShipping || 0,
        },
      };

    case "product-add":
      const existing = state.cart.products.find(
        (p) => p.item._id === action.payload.item._id
      );

      let newProducts;
      if (existing) {
        newProducts = state.cart.products.map((p) =>
          p.item._id === action.payload.item._id
            ? { ...p, qty: (p.qty || 1) + 1 }
            : p
        );
      } else {
        newProducts = [...state.cart.products, { ...action.payload, qty: 1 }];
      }

      
      const totalPrice = newProducts.reduce(
        (sum, p) => sum + p.price * (p.qty || 1),
    );

      const totalShipping = newProducts.reduce(
        (sum, p) => sum + (p.shipping || 0),
        0
      );

      return {
        ...state,
        cart: {
          products: newProducts,
          totalPrice,
          totalShipping,
        },
      };

       case "admin":return  {
...state,
isAdmin: action.payload
       }
case "productAdd" :return{
  ...state,
  isProductAdd:action.payload.isAdding
}
    default:
      return state;
  }
};

export default reducerfn;
