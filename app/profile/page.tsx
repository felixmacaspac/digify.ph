"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface CustomerData {
  first_name: string;
  last_name: string;
  street: string;
  city: string;
  province: string;
  zip: string;
}

interface EditableFields extends CustomerData {
  email: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<EditableFields | null>(null);
  const [user, setUser] = useState<any>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Check authentication
      const {
        data: { user: userData },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !userData) {
        router.push("/sign-in");
        return;
      }

      setUser(userData);

      // Fetch customer data
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("customer_id", userData.id)
        .single();

      if (!customerError && customerData) {
        setCustomerData(customerData);
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleEdit = () => {
    console.log("Edit mode activated");
    setIsEditing(true);
    setEditedFields({
      email: user?.email ?? "",
      first_name: customerData?.first_name ?? "",
      last_name: customerData?.last_name ?? "",
      street: customerData?.street ?? "",
      city: customerData?.city ?? "",
      province: customerData?.province ?? "",
      zip: customerData?.zip ?? "",
    });
  };

  const handleCancel = () => {
    console.log("Edit cancelled");
    setIsEditing(false);
    setEditedFields(null);
  };

  const handleSave = () => {
    console.log("Saving changes:", editedFields);
    setIsEditing(false);
    // Implement save functionality here
  };

  const handleFieldChange = (field: keyof EditableFields, value: string) => {
    setEditedFields((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null
    );
  };

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="my-36 text-black uppercase">
      <div className="container max-w-[800px] mx-auto px-4">
        {/* Profile Section */}
        <div className="flex items-end w-full justify-end mb-6">
          {!isEditing ? (
            <Button
              className="bg-black text-white uppercase font-semibold rounded-md"
              onClick={handleEdit}
              size="sm"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="default" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-14">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    First Name
                  </label>
                  <Input
                    value={
                      isEditing
                        ? editedFields?.first_name
                        : customerData?.first_name
                    }
                    onChange={(e) =>
                      handleFieldChange("first_name", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Last Name
                  </label>
                  <Input
                    value={
                      isEditing
                        ? editedFields?.last_name
                        : customerData?.last_name
                    }
                    onChange={(e) =>
                      handleFieldChange("last_name", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">EMAIL</label>
                <Input
                  value={isEditing ? editedFields?.email : user?.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="max-w-md"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Street Address
                </label>
                <Input
                  value={
                    isEditing ? editedFields?.street : customerData?.street
                  }
                  onChange={(e) => handleFieldChange("street", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <Input
                    value={isEditing ? editedFields?.city : customerData?.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Province
                  </label>
                  <Input
                    value={
                      isEditing
                        ? editedFields?.province
                        : customerData?.province
                    }
                    onChange={(e) =>
                      handleFieldChange("province", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    ZIP Code
                  </label>
                  <Input
                    value={isEditing ? editedFields?.zip : customerData?.zip}
                    onChange={(e) => handleFieldChange("zip", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
