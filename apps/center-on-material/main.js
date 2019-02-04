import _ from "lodash";
import utils from "../lib/utils";
import EaselApp from "../lib/EaselApp";

export default class App extends EaselApp {
    properties(_state) {
        return {};
    }

    executor(state, _props) {
        const volumes = _.isEmpty(state.selectedVolumes)
            ? state.volumes
            : state.selectedVolumes;

        const bounds = utils.calculateBounds(volumes);

        const centerOfMaterial = {
            x: state.material.dimensions.x / 2,
            y: state.material.dimensions.y / 2
        };

        const dx = centerOfMaterial.x - ((bounds.x1 + bounds.x2) / 2);
        const dy = centerOfMaterial.y - ((bounds.y1 + bounds.y2) / 2);

        return _.map(volumes, volume => ({
            ...volume,
            shape: utils.offsetShape(volume.shape, dx, dy)
        }));
    }
}
