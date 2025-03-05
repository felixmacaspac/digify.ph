"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

//Add to cart function 

export const addToCartAction = async (formData: FormData) => {
  const product_id = formData.get("product_id") as string;
  const quantity = formData.get("quantity") as string;
  const supabase = await createClient();

  // Get user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return encodedRedirect(
      "error",
      `/login`,
      userError?.message || "User not logged in"
    );
  }

  // Insert to cart
  const { error: insertError } = await supabase
    .from('cart_items')
    .insert([
      { 
        customer_id: user.id, 
        product_id, 
        quantity 
      }
    ]);

  // Wait for insert to complete before redirect
  if (insertError) {
    return encodedRedirect(
      "error",
      `/products/${product_id}`,
      insertError.message
    );
  }

  // Only redirect after confirmed insert
  return encodedRedirect(
    "success",
    `/cart`,
    "Added to cart successfully"
  );
};

async function deleteImage(
  publicUrl: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  try {
    // Extract the storage bucket and file path from the public URL
    const url = new URL(publicUrl);
    const pathSegments = url.pathname.split("/");

    // Ensure the URL has enough segments to extract bucket and file path
    if (pathSegments.length < 3) {
      throw new Error(
        "Invalid public URL format. Unable to extract bucket and file path."
      );
    }

    const bucketName = "products";
    const filePath = pathSegments.slice(6).join("/");

    console.log(`Bucket Name: ${bucketName}`);
    console.log(`filePath: ${filePath}`);
    console.log(`File segments: ${pathSegments}`);

    // Attempt to delete the file from the storage bucket
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: (err as Error).message };
  }
}

export const updateProductAction = async (formData: FormData) => {
  const supabase = await createClient();
  // Handling Product ID for Update
  const product_id = formData.get("product_id")?.toString();

  if (!product_id) {
    return encodedRedirect(
      "error",
      "/admin/products",
      "Product ID is required for updating."
    );
  }

  //Handling Product Image Update
  let imageUrl = formData.get("existing_image_url")?.toString();
  const product_image = formData.get("product_image") as File;

  if (product_image && product_image.size > 0) {
    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(product_image.type)) {
      return encodedRedirect(
        "error",
        "/admin/products",
        "Invalid file type. Only .png, .jpeg, or .jpg images are allowed."
      );
    }

    //Deleting Old Image

    const { success, error } = await deleteImage(imageUrl ?? "");

    if (!success) {
      return encodedRedirect(
        "error",
        "/admin/products",
        `Image Deletion failed: ${error}`
      );
    }

    // Upload new image to Supabase storage bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .upload(`images/${Date.now()}_${product_image.name}`, product_image);

    if (uploadError) {
      return encodedRedirect(
        "error",
        "/admin/products",
        `Image upload failed: ${uploadError.message}`
      );
    }

    const { data: publicURLData } = supabase.storage
      .from("products")
      .getPublicUrl(uploadData.path);

    if (!publicURLData) {
      return encodedRedirect(
        "error",
        "/admin/products",
        "Failed to get the image URL."
      );
    }

    imageUrl = publicURLData.publicUrl;
  }

  // Validate required fields (excluding image)
  const requiredFields = [
    "product_code",
    "brand",
    "megapixels",
    "sensor_size",
    "sensor_type",
    "price",
    "stocks",
  ];

  const missingFields = requiredFields.filter(
    (field) => !formData.get(field)?.toString().trim()
  );

  if (missingFields.length > 0) {
    return encodedRedirect(
      "error",
      "/admin/products",
      `Required fields are missing: ${missingFields.join(", ")}`
    );
  }

  // Extract form data
  const product_code = formData.get("product_code")?.toString();
  const brand = formData.get("brand")?.toString();
  const megapixels = formData.get("megapixels")?.toString();
  const sensor_size = formData.get("sensor_size")?.toString();
  const sensor_type = formData.get("sensor_type")?.toString();
  const price = formData.get("price")?.toString();
  const stocks = formData.get("stocks")?.toString();

  // Prepare update object
  const updateData: Record<string, string> = {
    product_code: product_code ?? "",
    product_image: imageUrl ?? "",
    brand: brand ?? "",
    megapixels: megapixels ?? "",
    sensor_size: sensor_size ?? "",
    sensor_type: sensor_type ?? "",
    price: price ?? "",
    stocks: stocks ?? "",
  };

  // Perform the update
  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("product_id", product_id);

  if (error) {
    return encodedRedirect(
      "error",
      "/admin/products",
      `Failed to update product in the database. ${error.message}`
    );
  }

  return encodedRedirect(
    "success",
    "/admin/products",
    "Updated product successfully."
  );
};

export async function deleteProductAction(
  productId: string,
  productImage: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("product_id", productId);

    if (error) {
      return encodedRedirect(
        "error",
        "/admin/products",
        `Error Deleting Product`
      );
    }

    const { success, error: deleteError } = await deleteImage(productImage);

    if (!success) {
      return encodedRedirect(
        "error",
        "/admin/products",
        `Image Deletion failed: ${deleteError}`
      );
    }

    return encodedRedirect(
      "success",
      "/admin/products",
      `Successfully deleted a product.`
    );
  } catch (err) {
    return encodedRedirect(
      "error",
      "/admin/products",
      `Unexpected Error: ${(err as Error).message}`
    );
  }
}

export const newProductAction = async (formData: FormData) => {
  const supabase = await createClient();
  const product_image = formData.get("product_image") as File;

  if (!product_image) {
    return encodedRedirect(
      "error",
      "/admin/products",
      `Please upload an Image`
    );
  }

  // Validate file type
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(product_image.type)) {
    return encodedRedirect(
      "error",
      "/admin/products",
      "Invalid file type. Only .png, .jpeg, or .jpg images are allowed."
    );
  }

  // Upload image to Supabase storage bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("products")
    .upload(`images/${Date.now()}_${product_image.name}`, product_image);

  if (uploadError) {
    return encodedRedirect(
      "error",
      "/admin/products",
      `Image upload failed: ${uploadError.message}`
    );
  }

  const { data: publicURLData } = supabase.storage
    .from("products")
    .getPublicUrl(uploadData.path);

  if (!publicURLData) {
    return encodedRedirect(
      "error",
      "/admin/products",
      "Failed to get the image URL."
    );
  }

  const requiredFields = [
    "product_code",
    "brand",
    "megapixels",
    "sensor_size",
    "sensor_type",
    "price",
    "stocks",
  ];

  const missingFields = requiredFields.filter(
    (field) => !formData.get(field)?.toString().trim()
  );

  if (missingFields.length > 0) {
    return encodedRedirect(
      "error",
      "/admin/products",
      `Required fields are missing: ${missingFields.join(", ")}`
    );
  }

  const product_code = formData.get("product_code")?.toString();
  const brand = formData.get("brand")?.toString();
  const megapixels = formData.get("megapixels")?.toString();
  const sensor_size = formData.get("sensor_size")?.toString();
  const sensor_type = formData.get("sensor_type")?.toString();
  const price = formData.get("price")?.toString();
  const stocks = formData.get("stocks")?.toString();

  const { data, error } = await supabase.from("products").insert([
    {
      product_code: product_code,
      brand: brand,
      megapixels: megapixels,
      sensor_size: sensor_size,
      sensor_type: sensor_type,
      price: price,
      stocks: stocks,
      product_image: publicURLData.publicUrl,
    },
  ]);

  if (error) {
    return encodedRedirect(
      "error",
      "/admin/products",
      `Failed to insert product into the database. ${error.message}`
    );
  }

  return encodedRedirect(
    "success",
    "/admin/products",
    "Added new product successfully."
  );
};

// Sign up action
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const first_name = formData.get("first_name")?.toString();
  const last_name = formData.get("last_name")?.toString();
  const street = formData.get("street")?.toString();
  const city = formData.get("city")?.toString();
  const province = formData.get("province")?.toString();
  const zip = formData.get("zip")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  const userId = data?.user?.id;
  if (!userId) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Could not retrieve the user ID"
    );
  }

  const { error: insertError } = await supabase.from("customers").insert({
    customer_id: userId,
    first_name,
    last_name,
    street,
    city,
    province,
    zip,
  });

  if (insertError) {
    return encodedRedirect("error", "/sign-up", insertError.message);
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link."
  );
};

// Sign in action
export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/admin");
};

// Fetch customer full name based on customer_id
export const getCustomerFullName = async (customer_id: string) => {
  const supabase = await createClient();

  const { data: customerData, error: queryError } = await supabase
    .from("customers")
    .select("first_name, last_name")
    .eq("customer_id", customer_id)
    .single();

  if (queryError) {
    console.log("Error fetching customer data:", queryError.message);
    return "";
  }

  return `${customerData?.first_name} ${customerData?.last_name}` || "";
};

// Forgot password action
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/profile/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

// Reset password action
export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/profile/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/profile/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/profile/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/profile/reset-password", "Password updated");
};

// Sign out action
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


