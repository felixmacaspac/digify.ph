"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import {
  newProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/actions";

const ProductsCrud = ({
  searchParams,
  products = [],
}: {
  searchParams: Message;
  products: Array<{
    product_id: string;
    product_code: string;
    brand: string;
    megapixels: number;
    sensor_size: string;
    sensor_type: string;
    price: number;
    stocks: number;
    product_image: string;
  }>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddNewProduct = () => {
    setIsOpen(true);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={handleAddNewProduct}
              className="bg-black text-white font-bold uppercase hover:bg-black hover:text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-secondary text-black max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form
              action={editingProduct ? updateProductAction : newProductAction}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Image Preview Section */}
                <div className="col-span-2 space-y-2 grid grid-cols-1 gap-4">
                  {/* Show the current image if editingProduct has a product_image */}
                  {editingProduct?.product_image && (
                    <div>
                      <img
                        src={editingProduct.product_image}
                        alt="Current Product"
                        className="w-40 h-40 mx-auto object-cover rounded border border-gray-200"
                      />
                    </div>
                  )}
                  {/* File input */}
                  <Input
                    type="file"
                    id="product_image"
                    name="product_image"
                    accept=".png, .jpeg, .jpg"
                    required={!editingProduct}
                    className="file:mr-4 file:bg-black file:text-white file:py-2 file:px-4 file:!border-0 file:text-sm file:font-semibold !outline-1"
                  />
                </div>

                <Input
                  type="hidden"
                  id="product_id"
                  name="product_id"
                  required={!editingProduct}
                  defaultValue={editingProduct?.product_id}
                />

                <Input
                  type="hidden"
                  id="existing_image_url"
                  name="existing_image_url"
                  required={!editingProduct}
                  defaultValue={editingProduct?.product_image}
                />

                <div className="space-y-2">
                  <Label htmlFor="product_code" className="uppercase">
                    Product Code:
                  </Label>
                  <Input
                    type="text"
                    id="product_code"
                    name="product_code"
                    required
                    defaultValue={editingProduct?.product_code}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="uppercase">
                    Brand:
                  </Label>
                  <Input
                    type="text"
                    id="brand"
                    name="brand"
                    required
                    defaultValue={editingProduct?.brand}
                  />
                </div>

                {/* Other input fields */}
                <div className="space-y-2">
                  <Label htmlFor="megapixels" className="uppercase">
                    Effective Pixels:
                  </Label>
                  <Input
                    type="number"
                    id="megapixels"
                    name="megapixels"
                    required
                    step="0.1"
                    defaultValue={editingProduct?.megapixels}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sensor_size" className="uppercase">
                    Sensor Size:
                  </Label>
                  <Input
                    type="text"
                    id="sensor_size"
                    name="sensor_size"
                    required
                    defaultValue={editingProduct?.sensor_size}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sensor_type" className="uppercase">
                    Sensor Type:
                  </Label>
                  <Input
                    type="text"
                    id="sensor_type"
                    name="sensor_type"
                    required
                    defaultValue={editingProduct?.sensor_type}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="uppercase">
                    Price:
                  </Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    min={0}
                    step="0.01"
                    required
                    defaultValue={editingProduct?.price}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stocks" className="uppercase">
                    Stocks:
                  </Label>
                  <Input
                    type="number"
                    id="stocks"
                    name="stocks"
                    min={0}
                    required
                    defaultValue={editingProduct?.stocks}
                  />
                </div>
              </div>

              <SubmitButton
                pendingText={editingProduct ? "Updating..." : "Adding..."}
                className="w-full font-bold text-white uppercase !bg-black"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </SubmitButton>

              {searchParams && <FormMessage message={searchParams} />}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product Code</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Megapixels</TableHead>
                <TableHead>Sensor Size</TableHead>
                <TableHead>Sensor Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stocks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>No products available</TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={product.product_image}
                        alt={product.product_code}
                        className="object-cover rounded w-full"
                      />
                    </TableCell>
                    <TableCell>{product.product_code}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.megapixels}</TableCell>
                    <TableCell>{product.sensor_size}</TableCell>
                    <TableCell>{product.sensor_type}</TableCell>
                    <TableCell>
                      ₱{parseFloat(product.price || "0").toFixed(2)}
                    </TableCell>
                    <TableCell>{product.stocks}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <form>
                          <SubmitButton
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            formAction={() =>
                              deleteProductAction(
                                product.product_id,
                                product.product_image
                              )
                            }
                            pendingText="Deleting..."
                          >
                            <Trash2 className="w-4 h-4" />
                          </SubmitButton>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsCrud;
