export class ProductImageSerializer {
  static serialize(image) {
    return {
      id: image.product_image_id,
      image_url: image.image_url,
      description: image.description,
      created_at: image.created_at,
      product_id: image.product?.product_id,
      product_name: image.product?.product_name,
    };
  }
}
