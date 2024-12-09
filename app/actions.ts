"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const newProductAction = async (formData: FormData) => {
    // List of all required fields
    const requiredFields = [
      "product_code",
      "brand",
      "megapixels",
      "sensor_size",
      "sensor_type",
      "price",
      "stocks",
    ];
  
    // Validate that all required fields are present and not empty
    const missingFields = requiredFields.filter(
      (field) => !formData.get(field)?.toString().trim()
    );
  
    if (missingFields.length > 0) {
      return encodedRedirect(
        "error",
        "/admin/products/new",
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

  const supabase = await createClient();

  const { data, error } = await supabase.from("products").insert([
    {
      "product_code": product_code,
      "brand": brand,
      "megapixels": megapixels,
      "sensor_size": sensor_size,
      "sensor_type": sensor_type,
      "price": price,
      "stocks": stocks,
    },
  ]);


  if (error) {
    return encodedRedirect(
      "error",
      "/admin/products/new",
      `Failed to insert product into the database. ${error.message}`
    );
  }

  return encodedRedirect(
    "success",
    "/admin/products/new",
    "Added new product"
  );
}


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
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
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
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

// Sign out action
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
