import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

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
    <section className="my-20">
      <div className="container">
        <div className="flex flex-row items-center justify-center gap-10">
          <Image
            src={product.product_image}
            alt={product.brand}
            width={150}
            height={150}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-4xl font-bold text-black">
              {product.brand} {product.product_code}
            </h1>
            <p className="text-xl font-bold mb-6 mt-2">
              Price: ₱{product.price}
            </p>
            <p className="text-xl text-gray-600">{product.megapixels} MP</p>
            <p className="text-xl text-gray-600">{product.sensor_size}</p>
            <p className="text-xl text-gray-600">{product.sensor_type}</p>
            <p className="text-xl text-gray-600">Stock: {product.stocks}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
