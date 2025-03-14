import { createHash } from "crypto";
import { useRef } from "react";
import { toast, ExternalToast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface SafeToastProps {
    isSuccess: boolean,
    options?: ExternalToast
}

interface GenToastIdProps {
    description: string,
    options?: ExternalToast
}

export const useSafeToast = () => {
    // Use a Set to store IDs of toasts that have been shown
    const shownToasts = useRef<Set<string>>(new Set());

    /**
     * Generates a unique hash ID for the toast based on the message and options.
     */
    const generateToastId = ({ description, options }: GenToastIdProps) => {
        return createHash("md5")
            .update(JSON.stringify({ description, options }))
            .digest("hex");
    };

    /**
     * Shows a toast only once per given ID.
     * @param id A unique identifier for the toast
     * @param message The primary message for the toast
     * @param options Additional toast options
     */
    const safeToast = ({ isSuccess, options }: SafeToastProps) => {
        if (!options || !options.description) return null;

        const id = generateToastId({ 
            description: options.description.toString(), 
            options: options
        });
        const title = isSuccess ? "Success.." : "An error occurred..";

        if (!shownToasts.current.has(id)) {
            toast(title, options);
            shownToasts.current.add(id);
        }
    };

    return safeToast;
};

export default useSafeToast;