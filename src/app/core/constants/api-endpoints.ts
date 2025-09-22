export const API_ENDPOINTS = {
  AUTH: {
    // LOGIN: '/users',
    LOGOUT: '/auth/logout',
  },
  PRODUCTS: {
    BASE: '/products',
    CATEGORIES: '/categories',
    SEARCH: '/products?q=',
    BY_CATEGORY: (category: string) => `/products?category=${category}`,
  },
  CART: {
    BASE: '/cart',
  },
  USERS: {
    BASE: '/users',
    CURRENT: '/users/current',
  },
  ORDERS: {
    BASE: '/orders',
    USER_ORDERS: '/orders?userId=',
  },
};
