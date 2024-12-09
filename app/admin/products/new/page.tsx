import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { newProductAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";


const NewProduct = async (props: {
  searchParams: Promise<Message>;
}) => {

  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  
  return (
    <div>
<form className="flex-1 flex flex-col my-40 w-full max-w-lg mx-auto">
        <h1 className="text-4xl text-center uppercase font-bold">New Product</h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8 uppercase text-black">
        <Label htmlFor="product_code">Product Code:</Label>
          <Input
            type="text"
            id="product_code"
            name="product_code"
            required
          />
        </div>
        <div>
          <Label htmlFor="brand">Brand:</Label>
          <Input
            type="text"
            id="brand"
            name="brand"
            required
          />
        </div>
        <div>
          <Label htmlFor="megapixels">Effective Pixels:</Label>
          <Input
            type="number"
            id="megapixels"
            name="megapixels"
            required
          />
        </div>
        <div>
          <Label htmlFor="sensor_size">Sensor Size:</Label>
          <Input
            type="text"
            id="sensor_size"
            name="sensor_size"
            required
          />
        </div>
        <div>
          <Label htmlFor="sensor_type">Sensor Type:</Label>
          <Input
            type="text"
            id="sensor_type"
            name="sensor_type"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price:</Label>
          <Input
            type="number"
            id="price"
            name="price"
            min={0} // Ensure stocks are non-negative
            required
            step=".01"
          />
        </div>
        <div>
          <Label htmlFor="stocks">Stocks:</Label>
          <Input
            type="number"
            id="stocks"
            name="stocks"
            min={0} // Ensure stocks are non-negative
            required
          />
          <SubmitButton formAction={newProductAction} pendingText="Signing up...">
            ADD PRODUCT
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  )
}

export default NewProduct;