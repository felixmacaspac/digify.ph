interface Product {
  product_code: string;
  brand: string;
  megapixels: string;
  sensor_size: string;
  sensor_type: string;
  price: string;
  stocks: string;
}

interface ProductsListingProps {
  products: Product[];
}

const ProductsListing = ({ products }: ProductsListingProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Digital Cameras</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.product_code} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{product.brand}</h2>
            <p className="text-sm text-gray-600">
              Code: {product.product_code}
            </p>
            <p className="text-sm text-gray-600">{product.megapixels} MP</p>
            <p className="text-sm text-gray-600">{product.sensor_size}</p>
            <p className="text-sm text-gray-600">{product.sensor_type}</p>
            <p className="font-medium mt-2">${product.price}</p>
            <p className="text-sm text-gray-600">Stock: {product.stocks}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsListing;
