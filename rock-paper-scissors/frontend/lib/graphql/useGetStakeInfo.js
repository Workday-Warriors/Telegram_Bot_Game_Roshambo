import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

const metadataQuery = gql`
  query MyQuery($user: String = "") {
    stakeInfos(where: { user: $user }) {
      id
      lastTimestamp
      rewardPaid
      stakedAmount
      unStakedAmount
      user
    }
  }
`;

export const useGetStakeInfo = (address) => {
  const { loading, error, data } = useQuery(metadataQuery, {
    variables: {
      user: address.toLowerCase(),
    },
    pollInterval: 10000,
  });

  const [isLoading, setLoading] = useState(false);
  const [err, setError] = useState();
  const [result, setResult] = useState(null);
  useEffect(() => {
    setLoading(loading);
    setError(error);
    setResult(data);
  }, [loading, error, data]);

  return {
    isLoading,
    err,
    result,
  };
};
