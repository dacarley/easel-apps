import EaselApp from "../lib/EaselApp";

const defaultOverlap = {
    in: 1,
    mm: 25
};

const maxOverlap = {
    in: 2,
    mm: 50
};

const alignmentPinOptions = [
    "None",
    "2"
];

export default class App extends EaselApp {
    properties(state) {
        return {
            tileWidth: {
                label: `Tile width (${state.preferredUnit})`,
                type: "text",
                converter: Number
            },
            tileHeight: {
                label: `Tile height (${state.preferredUnit})`,
                type: "text",
                converter: Number
            },
            alignmentPins: {
                label: `Alignment pins`,
                type: "list",
                options: alignmentPinOptions,
                value: alignmentPinOptions[0]
            },
            overlap: {
                label: `Overlap between carves (${state.preferredUnit})`,
                type: "range",
                min: 0,
                max: maxOverlap[state.preferredUnit],
                value: defaultOverlap[state.preferredUnit]
            }
        };
    }

    executor(_state, _props) {
        this.throwUserMessage("Not yet implemented");
    }
}
