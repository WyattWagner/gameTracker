import { z } from "zod";
export declare const ElementalWeaknessSchema: z.ZodObject<{
    element: z.ZodString;
    stars: z.ZodNumber;
}, z.core.$strip>;
export declare const AilmentWeaknessSchema: z.ZodObject<{
    ailment: z.ZodString;
    stars: z.ZodNumber;
    resistance: z.ZodNumber;
}, z.core.$strip>;
export declare const MonsterCatalogEntrySchema: z.ZodObject<{
    id: z.ZodString;
    source: z.ZodString;
    sourceId: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodEnum<{
        large: "large";
        small: "small";
    }>;
    species: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    elements: z.ZodArray<z.ZodString>;
    ailments: z.ZodArray<z.ZodString>;
    locations: z.ZodArray<z.ZodString>;
    elementalWeaknesses: z.ZodArray<z.ZodObject<{
        element: z.ZodString;
        stars: z.ZodNumber;
    }, z.core.$strip>>;
    ailmentWeaknesses: z.ZodArray<z.ZodObject<{
        ailment: z.ZodString;
        stars: z.ZodNumber;
        resistance: z.ZodNumber;
    }, z.core.$strip>>;
    canBeCaptured: z.ZodBoolean;
}, z.core.$strip>;
export type MonsterCatalogEntry = z.infer<typeof MonsterCatalogEntrySchema>;
export declare const MonsterCatalogListResponseSchema: z.ZodObject<{
    monsters: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodString;
        sourceId: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodEnum<{
            large: "large";
            small: "small";
        }>;
        species: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        elements: z.ZodArray<z.ZodString>;
        ailments: z.ZodArray<z.ZodString>;
        locations: z.ZodArray<z.ZodString>;
        elementalWeaknesses: z.ZodArray<z.ZodObject<{
            element: z.ZodString;
            stars: z.ZodNumber;
        }, z.core.$strip>>;
        ailmentWeaknesses: z.ZodArray<z.ZodObject<{
            ailment: z.ZodString;
            stars: z.ZodNumber;
            resistance: z.ZodNumber;
        }, z.core.$strip>>;
        canBeCaptured: z.ZodBoolean;
    }, z.core.$strip>>;
    total: z.ZodNumber;
    gameTitle: z.ZodString;
    source: z.ZodString;
    sourceUrl: z.ZodString;
}, z.core.$strip>;
export type MonsterCatalogListResponse = z.infer<typeof MonsterCatalogListResponseSchema>;
export declare const ListCatalogQuerySchema: z.ZodObject<{
    gameId: z.ZodDefault<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<{
        large: "large";
        small: "small";
        all: "all";
    }>>;
}, z.core.$strip>;
export type ListCatalogQuery = z.infer<typeof ListCatalogQuerySchema>;
export declare const CreateMonsterFromCatalogSchema: z.ZodObject<{
    gameId: z.ZodString;
    catalogId: z.ZodString;
}, z.core.$strip>;
export type CreateMonsterFromCatalogRequest = z.infer<typeof CreateMonsterFromCatalogSchema>;
//# sourceMappingURL=catalog.d.ts.map