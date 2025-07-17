import { useState, useEffect } from 'react';

interface ActiveIngredient {
  ingredient_id: string;
  ingredient_name: string;
}

export const useActiveIngredients = () => {
  const [activeIngredients, setActiveIngredients] = useState<ActiveIngredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockData: ActiveIngredient[] = [
      { ingredient_id: '1', ingredient_name: 'Glyphosate' },
      { ingredient_id: '2', ingredient_name: 'Atrazine' },
      { ingredient_id: '3', ingredient_name: 'Chlorpyrifos' },
      { ingredient_id: '4', ingredient_name: 'Imidacloprid' },
      { ingredient_id: '5', ingredient_name: 'Paraquat' },
    ];

    setTimeout(() => {
      setActiveIngredients(mockData);
      setLoading(false);
    }, 500);
  }, []);

  return {
    activeIngredients,
    loading,
  };
};