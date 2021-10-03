// return xy coords for the center of a grid point
export function getCoordinates({x, y}) {
    return {
        x: 400 + (x * 600),
        y: 300 + (y * 400),
    }
}

// given xy coords for center of grid point returns corresponding grid point coords
export function getGridCoordinates({x, y}) {
    return {
        x: Math.round((x - 400) / 600),
        y: Math.round((y - 300) / 400),
    }
}

export function moveCoords({x, y}, dir) {
    let result = {x, y};
    if (dir.includes('N')) result.y -= 1;
    if (dir.includes('S')) result.y += 1;
    if (dir.includes('E')) result.x += 1;
    if (dir.includes('W')) result.x -= 1;
    return result;
}


export function getTileNeighbors(gridCoords) {
    return {
        N: moveCoords(gridCoords, 'N'),
        S: moveCoords(gridCoords, 'S'),
        E: moveCoords(gridCoords, 'E'),
        W: moveCoords(gridCoords, 'W'),
    }
}