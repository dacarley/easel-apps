import EaselArgs from "./EaselArgs";

const userMessagePrefix = "User Message: ";

export default class EaselApp {
    propertiesWrapper(args) {
        return this.properties(new EaselArgs(args));
    }

    executorWrapper(args, success, failure) {
        try {
            success(this.executor(new EaselArgs(args)));
        } catch (err) {
            const message = err.message.startsWith(userMessagePrefix)
                ? err.message.replace(userMessagePrefix, "").trim()
                : err.stack;

            failure(message);
        }
    }

    throwUserMessage(message) {
        throw new Error(`${userMessagePrefix}${message}`);
    }
}
