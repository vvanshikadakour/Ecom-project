const initialState = {
  cart: {
    products: [],
    productCount: 0,
    totalPrice: 0,
    shipping: 0,
  },
  user: {
    id: null,
    name: "",
    userName: "",
  },
  isAdmin: false ,
  isProductAdd : false
};

export default initialState;
