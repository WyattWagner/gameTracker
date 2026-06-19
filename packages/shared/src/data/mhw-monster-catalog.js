"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MHW_CATALOG_META = exports.MHW_MONSTER_CATALOG = void 0;
exports.getMonsterCatalog = getMonsterCatalog;
exports.findCatalogEntry = findCatalogEntry;
const mhw_monster_catalog_json_1 = __importDefault(require("./mhw-monster-catalog.json"));
const catalog_1 = require("../schemas/catalog");
exports.MHW_MONSTER_CATALOG = mhw_monster_catalog_json_1.default.map((entry) => catalog_1.MonsterCatalogEntrySchema.parse(entry));
exports.MHW_CATALOG_META = {
    gameId: "monster-hunter",
    gameTitle: "Monster Hunter World (+ Iceborne)",
    source: "mhw-db",
    sourceUrl: "https://docs.mhw-db.com/",
    attribution: "Monster data from the Monster Hunter World Database API (mhw-db.com). Game content © Capcom.",
};
function getMonsterCatalog(gameId) {
    if (gameId === "monster-hunter")
        return exports.MHW_MONSTER_CATALOG;
    return [];
}
function findCatalogEntry(gameId, catalogId) {
    return getMonsterCatalog(gameId).find((entry) => entry.id === catalogId);
}
//# sourceMappingURL=mhw-monster-catalog.js.map