import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderSummary from "../components/cart/OrderSummary";
import ReceiverInfo from "../components/cart/ReceiverInfo";
import PaymentMethod from "../components/cart/PaymentMethod";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import instance from "../config/axiosConfig";
import { useCart } from "../context/CartContext"; // Để cập nhật số lượng giỏ hàng

interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  stock: number;
}

interface CartItem {
  productId: Product;
  quantity: number;
}

interface Cart {
  _id: string;
  userId: { _id: string; username: string; email: string };
  items: CartItem[];
}

interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalAmount } = location.state || {
    cart: { items: [] },
    totalAmount: 0,
  };
  const { user } = useAuth();
  const { fetchCartCount } = useCart(); // Để cập nhật số lượng giỏ hàng
  const [isInfoComplete, setIsInfoComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Tính phí vận chuyển (giả định)
  const shippingFee = 15000;
  const finalTotal = totalAmount + shippingFee;

  // Kiểm tra thông tin người dùng có đầy đủ không
  const checkInfoComplete = (userData: User) => {
    const requiredFields = ["username", "email", "phone", "address"];
    const isComplete = requiredFields.every((field) => userData[field]);
    setIsInfoComplete(isComplete);
  };

  // Callback khi cập nhật thông tin thành công
  const handleUpdateSuccess = (updatedUser: User) => {
    checkInfoComplete(updatedUser);
  };

  // Kiểm tra thông tin khi component mount
  useEffect(() => {
    if (user) {
      checkInfoComplete(user);
    }
  }, [user]);

  // Xử lý thanh toán
  const handleCheckout = async (paymentMethod: string) => {
    if (!isInfoComplete) {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi thanh toán!");
      return;
    }
    setLoading(true);
    try {
      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        userId: user?._id,
        items: cart.items.map((item: CartItem) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        totalAmount,
        shippingFee,
        paymentMethod,
        shippingAddress: {
          fullName: user?.username,
          email: user?.email,
          phone: user?.phone,
          address: user?.address,
        },
      };

      // Gửi request tạo đơn hàng
      await instance.post("/orders", orderData);
      toast.success("Đặt hàng thành công!");
      fetchCartCount();
      navigate("/");
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(error.response?.data?.message || "Không thể thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-24">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold mb-6 text-red-500">Thanh toán</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Thông tin đơn hàng */}
            <OrderSummary
              cart={cart}
              totalAmount={totalAmount}
              shippingFee={shippingFee}
              finalTotal={finalTotal}
            />

            {/* Thông tin người nhận */}
            <ReceiverInfo
              username={user?.username || "undefined"}
              onUpdateSuccess={handleUpdateSuccess}
            />
          </div>

          {/* Phương thức thanh toán */}
          <PaymentMethod
            onCheckout={handleCheckout}
            isInfoComplete={isInfoComplete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
