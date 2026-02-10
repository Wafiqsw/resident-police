export const BLOCKS = [
    'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2',
    'E1', 'E2', 'F1', 'F2', 'G1', 'G2', 'H1', 'H2'
] as const;

/**
 * Standardizes the Unit ID across the app (e.g., "A1-4-08")
 */
export const formatUnitId = (block: string, floor: string, unitNo: string) => {
    if (!block || !floor || !unitNo) return '';
    return `${block.toUpperCase()}-${floor.toUpperCase()}-${unitNo.padStart(2, '0')}`;
};

/**
 * Checks if a unit is occupied, excluding the user's current unit
 */
export const isUnitOccupied = (
    block: string,
    floor: string,
    unitNo: string,
    occupiedList: string[],
    initialUnitId?: string
) => {
    const id = formatUnitId(block, floor, unitNo);
    if (!id) return false;
    return occupiedList.includes(id) && id !== initialUnitId;
};

export type BlockType = typeof BLOCKS[number];

export const FLOORS = ['B', '1', '2', '3', '4'] as const;
export type FloorType = typeof FLOORS[number];

export const UNITS_PER_FLOOR = 8; // 8 units * 5 floors = 40 units per block

export const RESIDENTIAL_DATA: Record<BlockType, Record<FloorType, string[]>> = BLOCKS.reduce((acc, block) => {
    acc[block] = FLOORS.reduce((floorAcc, floor) => {
        floorAcc[floor] = Array.from({ length: UNITS_PER_FLOOR }, (_, i) => {
            const unitNo = (i + 1).toString().padStart(2, '0');
            return `${block}-${floor}-${unitNo}`;
        });
        return floorAcc;
    }, {} as Record<FloorType, string[]>);
    return acc;
}, {} as Record<BlockType, Record<FloorType, string[]>>);

export const getUnits = (block: BlockType, floor: FloorType) => {
    return RESIDENTIAL_DATA[block]?.[floor] || [];
};

export const getAllHouses = () => {
    const all: string[] = [];
    BLOCKS.forEach(block => {
        FLOORS.forEach(floor => {
            all.push(...RESIDENTIAL_DATA[block][floor]);
        });
    });
    return all;
};
