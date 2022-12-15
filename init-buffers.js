import { Vector } from "./vector.js";
import { NUMBER_OF_TRIANGLES } from "./constants.js";

function randomVector() {
    return new Vector(
        2.0 * Math.random() - 1.0,
        2.0 * Math.random() - 1.0,
        2.0 * Math.random() - 1.0);
}

function christmasTreeRandomNumber() {
    const x = Math.random(), y = Math.random();

    if (x > y) {
        return y;
    }
    return 1 - y;
}

function christmasDecorationGenerator() {
    var vertices = [
        0, 0, -1.902, 0, 0, 1.902, -1.701, 0, -0.8507, 1.701, 0, 0.8507, 1.376, -1.000, -0.8507, 1.376, 1.000,
        -0.8507, -1.376, -1.000, 0.8507, -1.376, 1.000, 0.8507, -0.5257, -1.618, -0.8507, -0.5257, 1.618,
        -0.8507, 0.5257, -1.618, 0.8507, 0.5257, 1.618, 0.8507];
    var ind = [
        [1, 11, 7], [1, 7, 6], [1, 6, 10], [1, 10, 3], [1, 3, 11], [4, 8, 0], [5, 4, 0], [9, 5, 0], [2, 9, 0],
        [8, 2, 0], [11, 9, 7], [7, 2, 6], [6, 8, 10], [10, 4, 3], [3, 5, 11], [4, 10, 8], [5, 3, 4], [9, 11, 5],
        [2, 7, 9], [8, 6, 2]
    ];

    var colors = [], indices = [], positions = [];
    const scale = 0.2;

    for (var i = 0; i < vertices.length; ++i) {
        positions.push(vertices[i] * scale);
    }

    for (var i = 0; i < ind.length; ++i) {
        indices = indices.concat(ind[i]);

        for (var j = 0; j < ind[i].length; ++j) {
            colors = colors.concat([0, 0.263, 0.412, 1.0]);
        }
    }

    return {
        positions: positions,
        colors: colors,
        indices: indices
    }
}

function treeGenerator() {
    var positions = [], colors = [];

    const faceColors = [
        [0.553, 0.608, 0.416, 1.0],
        [0.44, 0.58, 0.39, 1.0],
        [0.29, 0.55, 0.39, 1.0],
        [0.47, 0.62, 0.17, 1.0]
    ];

    for (var i = 0; i < NUMBER_OF_TRIANGLES; ++i) {

        var center = new Vector(0, 0, 0);

        const TREE_HEIGHT = 3, TREE_WIDTH = 1.4;

        center.y = christmasTreeRandomNumber() * TREE_HEIGHT;

        const RAD_LIMIT = (TREE_HEIGHT - center.y) * TREE_WIDTH / TREE_HEIGHT;

        const angle = 2 * Math.PI * Math.random();
        const rad = Math.random() * RAD_LIMIT;
        center.x = rad * Math.cos(angle);
        center.z = rad * Math.sin(angle);

        var direction_1 = randomVector().normalize(),
            direction_2 = randomVector();

        direction_2 = direction_2.minus(direction_2.timesScalar(direction_1.scalarProduct(direction_2))).normalize();

        var scale = 0.15 + 0.1 * Math.random();

        var scale_a = 0.6 - 0.1 + Math.random() * 0.2,
            scale_b = 1 - 0.1 + Math.random() * 0.2,
            scale_c = 1 - 0.1 + Math.random() * 0.2;

        var a = direction_1.timesScalar(scale_a),
            b = direction_1.plus(direction_2).timesScalar(scale_b),
            c = direction_1.minus(direction_2).timesScalar(scale_c);

        a = center.plus(a.timesScalar(scale));
        b = center.minus(b.timesScalar(scale));
        c = center.minus(c.timesScalar(scale));

        positions.push(
            a.x, a.y, a.z,
            b.x, b.y, b.z,
            c.x, c.y, c.z);

        const col = faceColors[i % faceColors.length];
        colors = colors.concat(col, col, col);
    }

    return {
        positions: positions,
        colors: colors,
        indices: [...Array(NUMBER_OF_TRIANGLES * 3).keys()]
    }
}

function initBuffers(gl, generator) {
    const data = generator();

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.positions), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.colors), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        num_vertices: data.indices.length
    };
}

export { initBuffers, treeGenerator, christmasDecorationGenerator };
