import ProductsCrud from "@/components/admin/products-crud";
import { createClient } from "@/utils/supabase/server";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { message?: string; type?: string };
}) {
  const supabase = await createClient();

  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
  }

  return <ProductsCrud products={products || []} searchParams={searchParams} />;
}
