"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCatalogEntry = exports.getMonsterCatalog = exports.MHW_CATALOG_META = exports.MHW_MONSTER_CATALOG = void 0;
__exportStar(require("./schemas/errors"), exports);
__exportStar(require("./schemas/auth"), exports);
__exportStar(require("./schemas/common"), exports);
__exportStar(require("./schemas/monsters"), exports);
__exportStar(require("./schemas/quests"), exports);
__exportStar(require("./schemas/drops"), exports);
__exportStar(require("./schemas/stats"), exports);
__exportStar(require("./schemas/monster-hunter"), exports);
__exportStar(require("./schemas/catalog"), exports);
var mhw_monster_catalog_1 = require("./data/mhw-monster-catalog");
Object.defineProperty(exports, "MHW_MONSTER_CATALOG", { enumerable: true, get: function () { return mhw_monster_catalog_1.MHW_MONSTER_CATALOG; } });
Object.defineProperty(exports, "MHW_CATALOG_META", { enumerable: true, get: function () { return mhw_monster_catalog_1.MHW_CATALOG_META; } });
Object.defineProperty(exports, "getMonsterCatalog", { enumerable: true, get: function () { return mhw_monster_catalog_1.getMonsterCatalog; } });
Object.defineProperty(exports, "findCatalogEntry", { enumerable: true, get: function () { return mhw_monster_catalog_1.findCatalogEntry; } });
//# sourceMappingURL=index.js.map