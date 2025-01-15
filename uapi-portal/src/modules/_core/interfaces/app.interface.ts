import { NextPage } from "next";
import type { AppProps } from "next/app";
import { EmotionCache } from "@emotion/react";

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextApplicationPage;
}
export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
  layout?: NextPage;
};

export enum ResponseType {
  SUCCESS = "success",
  ERROR = "error",
}

export interface FooterProps {
  currentCompany: string;
}
