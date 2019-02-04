import _ from "lodash";
import EaselState from "./EaselState";

const userMessagePrefix = "User Message: ";
const standardPropFields = [
    "type",
    "options",
    "min",
    "max",
    "value"
];

export default class EaselApp {
    get executorDelay() {
        return 250;
    }

    propertiesWrapper(args) {
        const properties = this.properties(new EaselState(args));

        return _.map(properties, property => ({
            ..._.pick(property, standardPropFields),
            id: property.label
        }));
    }

    executorWrapper(args, success, failure) {
        if (this.lastTimeout) {
            clearTimeout(this.lastTimeout);
        }

        this.lastTimeout = setTimeout(() => {
            try {
                const state = new EaselState(args);
                const props = this._processProps(args, state);

                success(this.executor(state, props));
            } catch (err) {
                const message = err.message.startsWith(userMessagePrefix)
                    ? err.message.replace(userMessagePrefix, "").trim()
                    : err.stack;

                failure(message);
            }
        }, this.executorDelay);
    }

    throwUserMessage(message) {
        throw new Error(`${userMessagePrefix}${message}`);
    }

    _processProps(args, state) {
        const properties = this.properties(state);

        return _.mapValues(properties, (property) => {
            let value = args.params[property.label];

            if (property.converter) {
                value = property.converter(value);
            }

            return value;
        });
    }
}
