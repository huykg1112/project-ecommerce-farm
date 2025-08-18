"use client";

import { CartHeader } from "@/components/cart/CartHeader";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummaryCart";

import { RecommendedProducts } from "@/components/cart/RecommendedProducts";
import { SellerSection } from "@/components/cart/SellerSection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { withAuth } from "@/lib/auth/with-auth";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/lib/features/cart-slice";
import type { AppDispatch, RootState } from "@/lib/features/store";
import { showToast } from "@/lib/toast-provider";
import { productServiceManagement } from "@/lib_dashboard/services/product-service-management";
import { voucherService } from "@/lib_dashboard/services/voucher-service";
import { Product } from "@/lib_dashboard/types/product";
import { Voucher } from "@/types/entities";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CartPage() {
  const { items, totalItems, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedSellers, setExpandedSellers] = useState<string[]>([]);
  const [myVoucher, setMyVoucher] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchRecommendedProducts = async () => {
      const response =
        await productServiceManagement.getRecommendationsForUser();
      setRecommendedProducts(response.slice(0, 8));
    };

    // fetch my voucher
    const fetchMyVoucher = async () => {
      try {
        const response = await voucherService.getMyCollectedVouchers();
        console.log("My collected vouchers:", response);
        setMyVoucher(response);
      } catch (error) {
        console.error("Error fetching my voucher:", error);
        showToast.error("Lỗi khi lấy voucher của bạn");
      }
    };
    fetchMyVoucher();
    fetchRecommendedProducts();
    setLoading(false);
  }, []);

  const itemsBySeller = items.reduce((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = { sellerName: item.sellerName, items: [] };
    }
    acc[item.sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { sellerName: string; items: any[] }>);

  useEffect(() => {
    setExpandedSellers(Object.keys(itemsBySeller));
  }, [items]);

  // Calculate selected total with discounted prices (discount_value is percent)
  const calculateSelectedTotal = () =>
    items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const originalPrice = item.price;
        const discountPercent = item.promotion?.discount_value || 0;
        const finalPrice =
          originalPrice - (originalPrice * discountPercent) / 100;
        return total + finalPrice * item.quantity;
      }, 0);

  const selectedTotal = calculateSelectedTotal();
  const shippingFee =
    selectedTotal > 300000 ? 0 : selectedTotal > 0 ? 30000 : 0;

  // Calculate voucher discount
  const voucherDiscount = selectedVoucher?.max_discount_value || 0;
  const finalTotal = selectedTotal + shippingFee - voucherDiscount;

  const selectedItemsCount = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((count, item) => count + item.quantity, 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
    const item = items.find((item) => item.id === id);
    if (item)
      showToast.info(`Đã cập nhật số lượng ${item.name} thành ${newQuantity}`);
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find((item) => item.id === id);
    dispatch(removeFromCart(id));
    if (item) showToast.info(`Đã xóa ${item.name} khỏi giỏ hàng`);
  };

  const handleClearCart = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")
    ) {
      dispatch(clearCart());
      showToast.info("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    }
  };

  const handleSelectVoucher = (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);
    if (voucher) {
      showToast.success(`Đã áp dụng voucher ${voucher.voucher_code}`);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectSellerItems = (sellerId: string, isSelected: boolean) => {
    const sellerItemIds = itemsBySeller[sellerId].items.map((item) => item.id);
    if (isSelected) {
      setSelectedItems((prev) => {
        const newSelected = [...prev];
        sellerItemIds.forEach((id) => {
          if (!newSelected.includes(id)) newSelected.push(id);
        });
        return newSelected;
      });
    } else {
      setSelectedItems((prev) =>
        prev.filter((id) => !sellerItemIds.includes(id))
      );
    }
  };

  const isSellerSelected = (sellerId: string) =>
    itemsBySeller[sellerId].items.every((item) =>
      selectedItems.includes(item.id)
    );

  const isSellerPartiallySelected = (sellerId: string) =>
    itemsBySeller[sellerId].items.some((item) =>
      selectedItems.includes(item.id)
    ) &&
    !itemsBySeller[sellerId].items.every((item) =>
      selectedItems.includes(item.id)
    );

  const toggleSellerExpanded = (sellerId: string) => {
    setExpandedSellers((prev) =>
      prev.includes(sellerId)
        ? prev.filter((id) => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const selectAllItems = () => setSelectedItems(items.map((item) => item.id));
  const deselectAllItems = () => setSelectedItems([]);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      showToast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    // Get selected cart items
    const selectedCartItems = items.filter((item) =>
      selectedItems.includes(item.id)
    );

    // Group items by seller (distributor)
    const itemsBySeller = selectedCartItems.reduce((acc, item) => {
      if (!acc[item.sellerId]) {
        acc[item.sellerId] = {
          sellerName: item.sellerName,
          items: [],
        };
      }
      acc[item.sellerId].items.push(item);
      return acc;
    }, {} as Record<string, { sellerName: string; items: any[] }>);

    // Calculate totals for checkout
    const checkoutData = {
      selectedItems: selectedCartItems,
      itemsBySeller,
      selectedVoucher,
      selectedTotal,
      shippingFee,
      voucherDiscount,
      finalTotal,
      // Prepare order details for each seller
      ordersByDistributor: Object.entries(itemsBySeller).map(
        ([sellerId, { sellerName, items: sellerItems }]) => {
          const orderDetails = sellerItems.map((item) => {
            const discountPercent = item.promotion?.discount_value || 0;
            const finalPrice =
              item.price - (item.price * discountPercent) / 100;
            return {
              batch_id: item.batch?.batch_id || "",
              quantity: item.quantity,
              unit_price: finalPrice,
              notes: "",
            };
          });

          const sellerTotal = sellerItems.reduce((total, item) => {
            const discountPercent = item.promotion?.discount_value || 0;
            const finalPrice =
              item.price - (item.price * discountPercent) / 100;
            return total + finalPrice * item.quantity;
          }, 0);

          return {
            distributor_id: sellerId,
            distributor_name: sellerName,
            order_details: orderDetails,
            subtotal: sellerTotal,
          };
        }
      ),
    };

    // Save checkout data to localStorage
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    // Also keep the old format for backward compatibility if needed
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
    if (selectedVoucher) {
      localStorage.setItem("selectedVoucher", JSON.stringify(selectedVoucher));
    } else {
      localStorage.removeItem("selectedVoucher");
    }

    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <EmptyCart />
        {recommendedProducts.length > 0 && (
          <RecommendedProducts products={recommendedProducts} />
        )}
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">Giỏ hàng</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <CartHeader
              totalItems={totalItems}
              selectedItemsLength={selectedItems.length}
              itemsLength={items.length}
              onSelectAll={(checked) =>
                checked ? selectAllItems() : deselectAllItems()
              }
              onClearCart={handleClearCart}
            />
            <div className="space-y-6 px-6 pb-6">
              {Object.entries(itemsBySeller).map(
                ([sellerId, { sellerName, items: sellerItems }]) => (
                  <SellerSection
                    key={sellerId}
                    sellerId={sellerId}
                    sellerName={sellerName}
                    items={sellerItems}
                    selectedItems={selectedItems}
                    expandedSellers={expandedSellers}
                    onSelectSellerItems={handleSelectSellerItems}
                    onToggleSellerExpanded={toggleSellerExpanded}
                    onSelectItem={handleSelectItem}
                    onQuantityChange={handleQuantityChange}
                    onRemoveItem={handleRemoveItem}
                    isSellerSelected={isSellerSelected}
                    isSellerPartiallySelected={isSellerPartiallySelected}
                  />
                )
              )}
            </div>
          </div>
          <div className="mt-6">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/products">
                <ChevronLeft className="h-4 w-4" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        </div>
        <OrderSummary
          selectedItemsCount={selectedItemsCount}
          selectedTotal={selectedTotal}
          shippingFee={shippingFee}
          discount={voucherDiscount}
          finalTotal={finalTotal}
          myVoucher={myVoucher}
          selectedVoucher={selectedVoucher}
          onSelectVoucher={handleSelectVoucher}
          onCheckout={handleCheckout}
        />
      </div>
      <div>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-40">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            ))
          : recommendedProducts.length > 0 && (
              <RecommendedProducts products={recommendedProducts} />
            )}
      </div>
    </div>
  );
}

export default withAuth(CartPage);
