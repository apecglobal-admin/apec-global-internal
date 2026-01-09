import { useSelector } from 'react-redux';

export const useEconosystemData = () => {
  const econosystem = useSelector((state: any) => state.econosystem);

  const listELearning = econosystem.listELearning.data;
  const listTools = econosystem.listTools.data;
  const listCreative = econosystem.listCreative.data;
  const listNews = econosystem.listNews.data;

  const loadingListELearning = econosystem.listELearning.loading;
  const loadingListTools = econosystem.listTools.loading;
  const loadingListCreative = econosystem.listCreative.loading;
  const loadingListNews = econosystem.listNews.loading;

  const errorListELearning = econosystem.listELearning.error;
  const errorListTools = econosystem.listTools.error;
  const errorListCreative = econosystem.listCreative.error;
  const errorListNews = econosystem.listNews.error;

  const isLoading =
    loadingListELearning ||
    loadingListTools ||
    loadingListCreative ||
    loadingListNews;


  const hasError =
    errorListELearning ||
    errorListTools ||
    errorListCreative ||
    errorListNews;

  // Kiểm tra data có rỗng không (chỉ khi không loading)
  const hasEmptyData = !isLoading && (
    !listELearning || listELearning.length === 0 ||
    !listTools || listTools.length === 0 ||
    !listCreative || listCreative.length === 0 ||
    !listNews || listNews.length === 0
  );
  return {
    // Data 
    listELearning,
    listTools,
    listCreative,
    listNews,
    // Loading states
    loadingListELearning,
    loadingListTools,
    loadingListCreative,
    loadingListNews,
    isLoadingAll: isLoading,
    // Error states
    errorListELearning,
    errorListTools,
    errorListCreative,
    errorListNews,
    hasErrorAll: hasError,
    hasEmptyData

    // Status codes

  };
};