import _ from "lodash";

export default class EaselArgs {
    constructor(args) {
        this.args = args;
        this.memos = {};
    }

    get material() {
        return this.args.material;
    }

    get volumes() {
        return this.args.volumes;
    }

    get selectedVolumes() {
        return this.memoize("selectedVolumes", () => {
            return _.filter(this.args.volumes, (volume) => {
                return _.some(this.args.selectedVolumeIds, id => id === volume.id);
            });
        });
    }

    memoize(name, func) {
        if (!this.memos[name]) {
            this.memos[name] = func();
        }

        return this.memos[name];
    }
}
