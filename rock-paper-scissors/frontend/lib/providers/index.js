"use client";

import { UserProfileWrapper } from "@/lib/contexts/UserProfileProvider";
import WalletConnectProvider from "./WalletConnectProvider";
import GraphQLProvider from "./GraphQLProvider";

const ProviderList = [
  WalletConnectProvider,
  GraphQLProvider,
  UserProfileWrapper,
];

export default function Providers({ children }) {
  return ProviderList.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}
