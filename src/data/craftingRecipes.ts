export interface CraftingRecipe {
  id: string;
  ingredients: string[];
  result: string;
  gridPositions?: number[]; // Optional: positions 0-8 for 3x3 grid
}

export const craftingRecipes: CraftingRecipe[] = [
  {
    id: "1",
    ingredients: ["oak planks", "oak planks"],
    result: "sticks",
  },
  {
    id: "2",
    ingredients: ["cobblestone", "cobblestone", "cobblestone", "sticks", "sticks"],
    result: "stone pickaxe",
  },
  {
    id: "3",
    ingredients: ["oak planks", "oak planks", "oak planks", "oak planks"],
    result: "crafting table",
  },
  {
    id: "4",
    ingredients: ["iron ingot", "iron ingot", "iron ingot", "sticks", "sticks"],
    result: "iron pickaxe",
  },
  {
    id: "5",
    ingredients: ["oak planks", "oak planks", "oak planks", "sticks", "sticks"],
    result: "wooden pickaxe",
  },
  {
    id: "6",
    ingredients: ["wheat", "wheat", "wheat"],
    result: "bread",
  },
  {
    id: "7",
    ingredients: ["iron ingot", "iron ingot", "iron ingot", "iron ingot", "iron ingot", "iron ingot"],
    result: "iron door",
  },
  {
    id: "8",
    ingredients: ["diamond", "diamond", "diamond", "sticks", "sticks"],
    result: "diamond pickaxe",
  },
  {
    id: "9",
    ingredients: ["cobblestone", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "cobblestone"],
    result: "furnace",
  },
  {
    id: "10",
    ingredients: ["oak planks", "oak planks", "oak planks", "oak planks", "oak planks", "oak planks"],
    result: "door",
  },
];
