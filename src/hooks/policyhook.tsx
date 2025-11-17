import { useSelector } from 'react-redux';

export const usePolicyData = () => {
  const policy = useSelector((state: any) => state.policy);

  return {
    // Data 
    statPolicy: policy.statPolicy.data,
    listPolicy: policy.listPolicy.data,
    // Loading states


    // Error states


    // Status codes

  };
};