export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
}

export interface ShippingUpdate {
  date: string;
  status: string;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipping" | "delivered" | "cancelled";
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  shippingMethod: string;
  shippingFee: number;
  trackingNumber?: string;
  shippingUpdates?: ShippingUpdate[];
  note?: string;
}

export const orders: Order[] = [
  {
    id: "order1",
    userId: "user1",
    orderNumber: "ORD-2023-001",
    date: "2023-11-15T08:30:00Z",
    items: [
      {
        id: "item1",
        productId: "p1",
        name: "Rau cải ngọt hữu cơ",
        price: 15000,
        quantity: 2,
        image: "/images/products/rau-cai-ngot.jpg",
        sellerId: "s1",
        sellerName: "Nông Trại Xanh",
      },
      {
        id: "item2",
        productId: "p2",
        name: "Cà chua beef hữu cơ",
        price: 35000,
        quantity: 1,
        image: "/images/products/ca-chua.jpg",
        sellerId: "s2",
        sellerName: "Vườn Sạch",
      },
    ],
    totalAmount: 65000,
    status: "delivered",
    paymentMethod: "COD",
    shippingAddress: {
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường ABC",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
    shippingMethod: "Giao hàng tiêu chuẩn",
    shippingFee: 20000,
    trackingNumber: "VN123456789",
    shippingUpdates: [
      {
        date: "2023-11-15T09:00:00Z",
        status: "order_placed",
        description: "Đơn hàng đã được đặt",
      },
      {
        date: "2023-11-15T10:30:00Z",
        status: "order_confirmed",
        description: "Đơn hàng đã được xác nhận",
      },
      {
        date: "2023-11-16T08:00:00Z",
        status: "order_processing",
        description: "Đơn hàng đang được xử lý",
      },
      {
        date: "2023-11-16T14:00:00Z",
        status: "order_shipped",
        description: "Đơn hàng đã được giao cho đơn vị vận chuyển",
        location: "Trung tâm phân loại TP. Hồ Chí Minh",
      },
      {
        date: "2023-11-17T10:00:00Z",
        status: "order_out_for_delivery",
        description: "Đơn hàng đang được giao đến bạn",
        location: "Quận 1, TP. Hồ Chí Minh",
      },
      {
        date: "2023-11-17T15:30:00Z",
        status: "order_delivered",
        description: "Đơn hàng đã được giao thành công",
        location: "Quận 1, TP. Hồ Chí Minh",
      },
    ],
  },
  {
    id: "order2",
    userId: "user1",
    orderNumber: "ORD-2023-002",
    date: "2023-11-20T14:45:00Z",
    items: [
      {
        id: "item3",
        productId: "p3",
        name: "Táo Fuji nhập khẩu",
        price: 75000,
        quantity: 2,
        image: "/images/products/tao-fuji.jpg",
        sellerId: "s3",
        sellerName: "Trái Cây Nhập Khẩu",
      },
    ],
    totalAmount: 150000,
    status: "shipping",
    paymentMethod: "Chuyển khoản ngân hàng",
    shippingAddress: {
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường ABC",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
    shippingMethod: "Giao hàng nhanh",
    shippingFee: 30000,
    trackingNumber: "VN987654321",
    shippingUpdates: [
      {
        date: "2023-11-20T14:45:00Z",
        status: "order_placed",
        description: "Đơn hàng đã được đặt",
      },
      {
        date: "2023-11-20T16:00:00Z",
        status: "order_confirmed",
        description: "Đơn hàng đã được xác nhận",
      },
      {
        date: "2023-11-21T09:30:00Z",
        status: "order_processing",
        description: "Đơn hàng đang được xử lý",
      },
      {
        date: "2023-11-21T15:00:00Z",
        status: "order_shipped",
        description: "Đơn hàng đã được giao cho đơn vị vận chuyển",
        location: "Trung tâm phân loại TP. Hồ Chí Minh",
      },
    ],
  },
  {
    id: "order3",
    userId: "user1",
    orderNumber: "ORD-2023-003",
    date: "2023-11-25T10:15:00Z",
    items: [
      {
        id: "item4",
        productId: "p5",
        name: "Phân bón hữu cơ vi sinh",
        price: 120000,
        quantity: 1,
        image: "/images/products/phan-bon.jpg",
        sellerId: "s5",
        sellerName: "Vật Tư Nông Nghiệp Miền Nam",
      },
      {
        id: "item5",
        productId: "p4",
        name: "Hạt giống cà rốt",
        price: 25000,
        quantity: 3,
        image: "/images/products/hat-giong-ca-rot.jpg",
        sellerId: "s4",
        sellerName: "Hạt Giống Việt",
      },
    ],
    totalAmount: 195000,
    status: "processing",
    paymentMethod: "Ví MoMo",
    shippingAddress: {
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường ABC",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
    shippingMethod: "Giao hàng tiêu chuẩn",
    shippingFee: 20000,
    shippingUpdates: [
      {
        date: "2023-11-25T10:15:00Z",
        status: "order_placed",
        description: "Đơn hàng đã được đặt",
      },
      {
        date: "2023-11-25T11:30:00Z",
        status: "order_confirmed",
        description: "Đơn hàng đã được xác nhận",
      },
      {
        date: "2023-11-26T08:45:00Z",
        status: "order_processing",
        description: "Đơn hàng đang được xử lý",
      },
    ],
  },
  {
    id: "order4",
    userId: "user1",
    orderNumber: "ORD-2023-004",
    date: "2023-11-28T16:20:00Z",
    items: [
      {
        id: "item6",
        productId: "p6",
        name: "Mật ong rừng nguyên chất",
        price: 220000,
        quantity: 1,
        image: "/images/products/mat-ong.jpg",
        sellerId: "s6",
        sellerName: "Đặc Sản Vùng Cao",
      },
    ],
    totalAmount: 220000,
    status: "pending",
    paymentMethod: "Chuyển khoản ngân hàng",
    shippingAddress: {
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường ABC",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
    shippingMethod: "Giao hàng tiêu chuẩn",
    shippingFee: 20000,
    shippingUpdates: [
      {
        date: "2023-11-28T16:20:00Z",
        status: "order_placed",
        description: "Đơn hàng đã được đặt",
      },
    ],
  },
  {
    id: "order5",
    userId: "user1",
    orderNumber: "ORD-2023-005",
    date: "2023-12-01T09:10:00Z",
    items: [
      {
        id: "item7",
        productId: "p8",
        name: "Dưa lưới Nhật Bản",
        price: 85000,
        quantity: 2,
        image: "/images/products/dua-luoi.jpg",
        sellerId: "s3",
        sellerName: "Trái Cây Nhập Khẩu",
      },
      {
        id: "item8",
        productId: "p7",
        name: "Bơ sáp Đắk Lắk",
        price: 65000,
        quantity: 3,
        image: "/images/products/bo-sap.jpg",
        sellerId: "s1",
        sellerName: "Nông Trại Xanh",
      },
    ],
    totalAmount: 365000,
    status: "cancelled",
    paymentMethod: "COD",
    shippingAddress: {
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường ABC",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
    shippingMethod: "Giao hàng nhanh",
    shippingFee: 30000,
    shippingUpdates: [
      {
        date: "2023-12-01T09:10:00Z",
        status: "order_placed",
        description: "Đơn hàng đã được đặt",
      },
      {
        date: "2023-12-01T10:30:00Z",
        status: "order_confirmed",
        description: "Đơn hàng đã được xác nhận",
      },
      {
        date: "2023-12-01T15:45:00Z",
        status: "order_cancelled",
        description: "Đơn hàng đã bị hủy theo yêu cầu của khách hàng",
      },
    ],
  },
];

export const getOrderById = (id: string): Order | undefined => {
  return orders.find((order) => order.id === id);
};

export const getOrdersByUserId = (userId: string): Order[] => {
  return orders.filter((order) => order.userId === userId);
};

export const getOrderStatusText = (status: Order["status"]): string => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "processing":
      return "Đang xử lý";
    case "shipping":
      return "Đang giao hàng";
    case "delivered":
      return "Đã giao hàng";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

export const getOrderStatusColor = (status: Order["status"]): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipping":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
