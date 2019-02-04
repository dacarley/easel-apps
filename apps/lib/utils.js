import _ from "lodash";

export default {
    offsetShape,
    getVolumeBounds,
    calculateBounds,

    _offsetLine,
    _offsetCenteredShape
};

function offsetShape(shape, dx, dy) {
    switch (shape.type) {
        case "line":
            return this._offsetLine(shape, dx, dy);

        default:
            return this._offsetCenteredShape(shape, dx, dy);
    }
}

function _offsetLine(shape, dx, dy) {
    return {
        ...shape,
        point1: {
            x: shape.point1.x + dx,
            y: shape.point1.y + dy
        },
        point2: {
            x: shape.point2.x + dx,
            y: shape.point2.y + dy
        }
    };
}

function _offsetCenteredShape(shape, dx, dy) {
    return {
        ...shape,
        center: {
            x: shape.center.x + dx,
            y: shape.center.y + dy
        }
    };
}

function getVolumeBounds(volume) {
    switch (volume.shape.type) {
        case "line":
            return {
                x1: Math.min(volume.shape.point1.x, volume.shape.point2.x),
                x2: Math.max(volume.shape.point1.x, volume.shape.point2.x),
                y1: Math.min(volume.shape.point1.y, volume.shape.point2.y),
                y2: Math.max(volume.shape.point1.y, volume.shape.point2.y)
            };

        case "drill":
            return {
                x1: volume.shape.center.x,
                x2: volume.shape.center.x,
                y1: volume.shape.center.y,
                y2: volume.shape.center.y
            };

        default:
            return {
                x1: volume.shape.center.x - (volume.shape.width / 2),
                x2: volume.shape.center.x + (volume.shape.width / 2),
                y1: volume.shape.center.y - (volume.shape.height / 2),
                y2: volume.shape.center.y + (volume.shape.height / 2)
            };
    }
}

function calculateBounds(volumes) {
    const bounds = getVolumeBounds(volumes[0]);

    _.each(volumes, (volume) => {
        const volumeBounds = getVolumeBounds(volume);

        bounds.x1 = Math.min(bounds.x1, volumeBounds.x1);
        bounds.x2 = Math.max(bounds.x2, volumeBounds.x2);
        bounds.y1 = Math.min(bounds.y1, volumeBounds.y1);
        bounds.y2 = Math.max(bounds.y2, volumeBounds.y2);
    });

    return bounds;
}
