import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

const metadataQuery = gql`
  query MyQuery($user: String = "", $type: String = "Stake") {
    stakeInfos {
      id
      user
      rewardPaid
      lastTimestamp
    }
    histories(orderBy: timestamp, where: { user: $user, type: $type }) {
      id
      user
      type
      amount
      timestamp
    }
  }
`;

export const useGetStakingList = (address) => {
  const { loading, error, data } = useQuery(metadataQuery, {
    variables: {
      user: address.toLowerCase(),
    },
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
