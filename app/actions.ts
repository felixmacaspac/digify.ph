"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { cookies } from "next/headers";


// Define Zod schema for server-side validation
const signUpSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  street: z.string().min(4, "Street must be at least 4 characters"),
  city: z.string().min(4, "City must be at least 2 characters"),
  province: z.string().min(4, "Province must be at least 2 characters"),
  zip: z.string().regex(/^\d{4,6}$/, "Invalid zip code (4-6 digits required)"),
});

// Define validation schema using Zod
const productSchema = z.object({
  product_code: z.string().min(1, "Product code is required").max(50),
  brand: z.string().min(1, "Brand is required").max(50),
  megapixels: z.coerce.number().min(0, "Megapixels must be a positive number"),
  sensor_size: z.string().min(1, "Sensor size is required").max(50),
  sensor_type: z.string().min(1, "Sensor type is required").max(50),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stocks: z.coerce.number().min(0, "Stocks must be a positive number"),
});

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");


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
      console.error(error);
      return redirect(`/error?message=Image Deletion Failed`)
    }

    // Upload new image to Supabase storage bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .upload(`images/${Date.now()}_${product_image.name}`, product_image);

    if (uploadError) {
      console.error(uploadError);
      return redirect(`/error?message=Image Upload Failed`)
    }

    const { data: publicURLData} = supabase.storage
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
    console.error(error) //Log error internally
    return redirect(`/error?message=Product Update Failed`)
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


  // Extract & sanitize form data
  const rawData = {
    product_code: sanitizeHtml(formData.get("product_code")?.toString() || ""),
    brand: sanitizeHtml(formData.get("brand")?.toString() || ""),
    megapixels: sanitizeHtml(formData.get("megapixels")?.toString() || ""),
    sensor_size: sanitizeHtml(formData.get("sensor_size")?.toString() || ""),
    sensor_type: sanitizeHtml(formData.get("sensor_type")?.toString() || ""),
    price: sanitizeHtml(formData.get("price")?.toString() || ""),
    stocks: sanitizeHtml(formData.get("stocks")?.toString() || ""),
  };

    // Validate input using Zod
    const parsedData = productSchema.safeParse(rawData);
    if (!parsedData.success) {
      return encodedRedirect("error", "/admin/products", parsedData.error.errors.map((err) => err.message).join(", "));
    }



  const { data, error } = await supabase.from("products").insert([
    {
      ...parsedData.data,
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

async function getServerTime() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_server_time');
  
  if (error) {
    console.error("Error fetching time:", error);
    return -1;
  } else {
    console.log("Server Time:", data);
    return new Date(data);
  }
}

// Sign up action
export const signUpAction = async (formData: FormData) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const data = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
    first_name: formData.get("first_name")?.toString() ?? "",
    last_name: formData.get("last_name")?.toString() ?? "",
    street: formData.get("street")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    province: formData.get("province")?.toString() ?? "",
    zip: formData.get("zip")?.toString() ?? "",
  };

    // Sanitize inputs
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitizeHtml(value)])
    );

  // Validate data with Zod
  const validation = signUpSchema.safeParse(sanitizedData);
  if (!validation.success) {
    return encodedRedirect("error", "sign-up", validation.error.errors.map(err => err.message).join(", "));
  }


    // Validate inputs using Zod
    const validatedData = signUpSchema.parse(sanitizedData);

    const passwordValidation = passwordSchema.safeParse(validatedData.password);
    if (!passwordValidation.success) {
      return encodedRedirect("error", "sign-up", passwordValidation.error.errors.map(err => err.message).join(", "));
    }

  // Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: validatedData.email,
    password: validatedData.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (authError) {
    console.error(authError.code + " " + authError.message);
    return encodedRedirect("error", "/sign-up", authError.message);
  }

  const userId = authData?.user?.id;
  if (!userId) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Could not retrieve the user ID"
    );
  }

// Insert additional user details into the "customers" table
const { error: insertError } = await supabase.from("customers").insert({
  customer_id: userId,
  first_name: validatedData.first_name,
  last_name: validatedData.last_name,
  street: validatedData.street,
  city: validatedData.city,
  province: validatedData.province,
  zip: validatedData.zip,
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

  if (!email || !password) {
    return encodedRedirect("error", "/sign-in", "Please input necessary fields!");
  }

  const { data: failedUser } = await supabase
    .from("failed_logins")
    .select("*")
    .eq("email", email)
    .single();

  if (failedUser && failedUser.attempts + 1 >= 5) {
    const lastAttemptTime = new Date(failedUser.last_attempt).getTime();
    const lockoutDuration = 15 * 60 * 1000; // 15 minutes lockout
    const serverTime = await getServerTime();

    if (serverTime == -1) return encodedRedirect("error", "/sign-in", "Error fetching server time!");

    const timeDifference = serverTime.getTime() - lastAttemptTime;


    if (timeDifference < lockoutDuration) {
      console.log("Too many failed attempts. Lockout active.");
      return encodedRedirect("error", "/sign-in", "Too many failed attempts. Try again later.");
    } else {
      console.log("Lockout expired. Resetting failed attempts.");
      await supabase.from("failed_logins").delete().eq("email", email);
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (failedUser) {
      await supabase
        .from("failed_logins")
        .update({ attempts: failedUser.attempts + 1, last_attempt: new Date().toISOString() })
        .eq("email", email);
    } else {
      await supabase.from("failed_logins").insert([{ email, attempts: 1 }]);
    }
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


