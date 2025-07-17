import { useState, useEffect } from 'react';

interface Disease {
  disease_id: string;
  disease_name: string;
}

export const useDiseases = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockData: Disease[] = [
      { disease_id: '1', disease_name: 'Bệnh đốm lá' },
      { disease_id: '2', disease_name: 'Bệnh khô vằn' },
      { disease_id: '3', disease_name: 'Bệnh thối rễ' },
      { disease_id: '4', disease_name: 'Bệnh héo xanh' },
      { disease_id: '5', disease_name: 'Bệnh cháy bìa lá' },
      { disease_id: '6', disease_name: 'Bệnh đạo ôn' },
      { disease_id: '7', disease_name: 'Bệnh khô vằn cây họ đậu' },
    ];

    setTimeout(() => {
      setDiseases(mockData);
      setLoading(false);
    }, 500);
  }, []);

  return {
    diseases,
    loading,
  };
};