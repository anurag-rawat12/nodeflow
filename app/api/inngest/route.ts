import { serve } from "inngest/next";
import { inngest } from "@/inngest/Client";
import { aiResponse } from "@/inngest/function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        aiResponse,
    ],
});