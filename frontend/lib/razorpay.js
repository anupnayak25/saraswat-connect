const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
let razorpayScriptPromise = null;

export const loadRazorpayScript = () => {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Razorpay can only be loaded in the browser."));
    }

    if (window.Razorpay) {
        return Promise.resolve(true);
    }

    if (razorpayScriptPromise) {
        return razorpayScriptPromise;
    }

    razorpayScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = RAZORPAY_SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
        document.body.appendChild(script);
    });

    return razorpayScriptPromise;
};

export const payWithRazorpay = async ({
    amount,
    currency = "INR",
    name,
    description,
    image,
    orderId,
    prefill,
    notes,
    theme,
}) => {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!key) {
        throw new Error("Missing Razorpay key. Set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid payment amount.");
    }

    await loadRazorpayScript();

    return new Promise((resolve, reject) => {
        const options = {
            key,
            amount: Math.round(amount),
            currency,
            name,
            description,
            image,
            order_id: orderId,
            prefill,
            notes,
            theme,
            handler: (response) => resolve(response),
            modal: {
                ondismiss: () => reject(new Error("Payment cancelled.")),
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    });
};