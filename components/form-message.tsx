import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full text-base font-bold mt-14 items-center justify-center">
      {"success" in message && (
        <div className="flex items-center px-4 py-2">
          <FaCheckCircle className="text-green-500 mr-2" />
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="flex items-center px-4 py-2">
          <FaTimesCircle className="text-red-500 mr-2" />
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="flex items-center px-4 py-2">
          <FaInfoCircle className="text-blue-500 mr-2" />
          {message.message}
        </div>
      )}
    </div>
  );
}
