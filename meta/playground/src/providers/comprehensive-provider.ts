import { defineProvider } from "@ai16z/eliza-nitro/runtime";

export default defineProvider({
    get: async (runtime, message, state) => {
        try {
            // Get recent messages
            const messages = await runtime.messageManager.getMemories({
                roomId: message.roomId,
                count: 5,
            });

            // Get user context
            const userContext = await runtime.descriptionManager.getMemories({
                roomId: message.roomId,
                agentId: message.agentId,
            });

            // Get relevant facts
            const facts = await runtime.messageManager.getMemories({
                roomId: message.roomId,
                // tableName: "facts",
                count: 3,
            });

            // Format comprehensive context
            return `
# Conversation Context
${messages.map((m) => `- ${m.content.text}`).join("\n")}

# User Information
${userContext.map((c) => c.content.text).join("\n")}

# Related Facts
${facts.map((f) => `- ${f.content.text}`).join("\n")}
      `.trim();
        } catch (error) {
            console.error("Provider error:", error);
            return "Context temporarily unavailable";
        }
    },
});
