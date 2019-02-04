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
    propertiesWrapper(args) {
        const properties = this.properties(new EaselState(args));

        return _.map(properties, property => ({
            ..._.pick(property, standardPropFields),
            id: property.label
        }));
    }

    executorWrapper(args, success, failure) {
        try {
            const state = new EaselState(args);
            const props = this._getProps(args, state);

            success(this.executor(state, props));
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

    _getProps(args, state) {
        const properties = this.properties(state);

        return _.mapValues(properties, (property) => {
            return args.params[property.label];
        });
    }
}
