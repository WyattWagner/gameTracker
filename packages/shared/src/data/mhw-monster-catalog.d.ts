import type { MonsterCatalogEntry } from "../schemas/catalog";
export declare const MHW_MONSTER_CATALOG: MonsterCatalogEntry[];
export declare const MHW_CATALOG_META: {
    readonly gameId: "monster-hunter";
    readonly gameTitle: "Monster Hunter World (+ Iceborne)";
    readonly source: "mhw-db";
    readonly sourceUrl: "https://docs.mhw-db.com/";
    readonly attribution: "Monster data from the Monster Hunter World Database API (mhw-db.com). Game content © Capcom.";
};
export declare function getMonsterCatalog(gameId: string): MonsterCatalogEntry[];
export declare function findCatalogEntry(gameId: string, catalogId: string): MonsterCatalogEntry | undefined;
//# sourceMappingURL=mhw-monster-catalog.d.ts.map