import EaselApp from "../lib/EaselApp";

export default class App extends EaselApp {
    properties(_state) {
        return {
            columns: {
                label: "Props Not Yet Implemented",
                type: "range",
                value: 2,
                min: 1,
                max: 10,
                step: 1
            }
        };
    }

    executor(_state, _props) {
        this.throwUserMessage("Not Yet Implemented");
    }
}
