import { createClient } from "@/utils/supabase/client";

export async function generateStaticParams() {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("product_id");

  if (error || !products) {
    console.error("Error fetching product IDs:", error);
    return [];
  }

  return products.map((product: { product_id: { toString: () => any } }) => ({
    id: product.product_id.toString(),
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { id } = params;

  const { data: product, error } = await (await supabase)
    .from("products")
    .select("*")
    .eq("product_id", id)
    .single();

  if (error || !product) {
    console.error("Error fetching product:", error);
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>
        {product.brand} {product.product_code}
      </h1>
      <p>Price: ₱{product.price}</p>
      <p>Stocks: {product.stocks}</p>
      <p>Sensor: {product.sensor_type}</p>
    </div>
  );
}
