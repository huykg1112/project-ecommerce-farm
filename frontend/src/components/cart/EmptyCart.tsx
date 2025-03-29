import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="container py-12">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative w-40 h-40 mb-6">
          <Image src="/images/empty-cart.svg" alt="Giỏ hàng trống" fill />
        </div>
        <h1 className="text-2xl font-bold mb-2">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng. Hãy tiếp tục
          mua sắm để tìm sản phẩm bạn yêu thích.
        </p>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href="/products">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Tiếp tục mua sắm
          </Link>
        </Button>
      </div>
    </div>
  );
}
