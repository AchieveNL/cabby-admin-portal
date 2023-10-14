export interface Overview {
  totals: {
    drivers: number;
    vehicles: number;
    orders: number;
    ordersRejection: number;
    pendingOrders: number;
    pendingDrivers: number;
  };
  newThisWeek: {
    drivers: number;
    orders: number;
  };
}

interface User {
  email: string;
}

interface PendingDriver {
  id: string;
  firstName: string;
  user: User;
}

interface PendingOrder {
  id: string;
  vehicleId: string;
  totalAmount: number;
  rentalStartDate: Date;
  rentalEndDate: Date;
}

export interface PendingDetailsResponse {
  pendingDrivers: PendingDriver[];
  pendingOrders: PendingOrder[];
}
