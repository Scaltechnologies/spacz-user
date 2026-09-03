import { mockDelay } from '@/services/api';
import { mockMealCards } from '@/services/mock/mealCards.mock';
import { MealCard } from '@/types/mealCard';

export async function getMealCards(): Promise<MealCard[]> {
  return mockDelay(mockMealCards);
}

export async function getMealCardById(id: string): Promise<MealCard | null> {
  return mockDelay(mockMealCards.find((card) => card.id === id) ?? null);
}
