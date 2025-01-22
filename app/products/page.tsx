"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import ProductsListing from "@/components/products-listing";
import { createClient } from "@/utils/supabase/client";

interface Product {
  product_code: string;
  brand: string;
  megapixels: string;
  sensor_size: string;
  sensor_type: string;
  price: string;
  stocks: string;
}

const priceRanges = [
  { id: "under-500", label: "Under ₱500", min: 0, max: 500 },
  { id: "500-1000", label: "₱500 - ₱1,000", min: 500, max: 1000 },
  { id: "1000-2000", label: "₱1,000 - ₱2,000", min: 1000, max: 2000 },
  { id: "2000-3000", label: "₱2,000 - ₱3,000", min: 2000, max: 3000 },
  { id: "over-3000", label: "Over ₱3,000", min: 3000, max: Infinity },
];

interface FilterState {
  product_code: string;
  brand: string[];
  price: string[];
  megapixels: string;
  sensor_size: string;
  sensor_type: string;
  stocks: number;
}

const Products = () => {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandOptions, setBrandOptions] = useState<
    { id: string; label: string }[]
  >([]);

  const [filters, setFilters] = useState<FilterState>({
    product_code: "",
    brand: [],
    price: [],
    megapixels: "",
    sensor_size: "",
    sensor_type: "",
    stocks: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("products").select("*");

        if (error) {
          console.error("Error fetching products:", error);
          return;
        }

        if (data) {
          setProducts(data as Product[]);

          // Extract unique brands and create brand options
          const uniqueBrands = Array.from(
            new Set(data.map((product) => product.brand))
          )
            .sort()
            .map((brand) => ({
              id: brand.toLowerCase(),
              label: brand,
            }));

          setBrandOptions(uniqueBrands);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (
    section: keyof FilterState,
    value: string | string[]
  ) => {
    setFilters((prev) => {
      if (Array.isArray(prev[section])) {
        const currentFilters = prev[section] as string[];
        return {
          ...prev,
          [section]: currentFilters.includes(value as string)
            ? currentFilters.filter((item) => item !== value)
            : [...currentFilters, value],
        };
      }
      return {
        ...prev,
        [section]: value,
      };
    });
  };

  const filteredProducts = products.filter((product) => {
    // Product code filter
    if (
      filters.product_code &&
      !product.product_code
        .toLowerCase()
        .includes(filters.product_code.toLowerCase())
    ) {
      return false;
    }

    // Brand filter
    if (
      filters.brand.length > 0 &&
      !filters.brand.includes(product.brand.toLowerCase())
    ) {
      return false;
    }

    // Price filter
    if (filters.price.length > 0) {
      const productPrice = parseFloat(product.price);
      const matchesPrice = filters.price.some((rangeId) => {
        const range = priceRanges.find((r) => r.id === rangeId);
        return range && productPrice >= range.min && productPrice < range.max;
      });
      if (!matchesPrice) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="flex border-black border-l max-w-[1440px] mx-auto min-h-screen">
        <aside className="max-w-64 w-full border-r border-r-black">
          {/* Filters Section */}
          <div className="py-4">
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={["brand"]}
            >
              {/* Brand Filter */}
              <AccordionItem value="brand">
                <AccordionTrigger className="px-6">Brand</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {brandOptions.map((brand) => (
                    <div
                      key={brand.id}
                      className="flex items-center px-6 space-x-2"
                    >
                      <Checkbox
                        id={brand.id}
                        checked={filters.brand.includes(brand.id)}
                        className="border-black"
                        onCheckedChange={() =>
                          handleFilterChange("brand", brand.id)
                        }
                      />
                      <label htmlFor={brand.id} className="text-sm">
                        {brand.label}
                      </label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Price Filter */}
              <AccordionItem value="price">
                <AccordionTrigger className="px-6">
                  Price Range
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {priceRanges.map((range) => (
                    <div
                      key={range.id}
                      className="flex items-center px-6 space-x-2"
                    >
                      <Checkbox
                        id={range.id}
                        checked={filters.price.includes(range.id)}
                        className="border-black"
                        onCheckedChange={() =>
                          handleFilterChange("price", range.id)
                        }
                      />
                      <label htmlFor={range.id} className="text-sm">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>

        <main className="w-full pl-20 mt-10">
          <ProductsListing products={filteredProducts} />
        </main>
      </div>
    </div>
  );
};

export default Products;
