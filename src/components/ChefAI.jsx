import BaseChefAI from "@cookbookdev/docsbot/react";

/** It's going to be exposed in HTTP requests anyway so it's fine to just hardcode it here */
const COOKBOOK_PUBLIC_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODhhM2ZjZWUyNWM1MzM5MDhiM2Y1MjYiLCJpYXQiOjE3NTM4OTA3NjYsImV4cCI6MjA2OTQ2Njc2Nn0.8M-xIAoySWFRooW01xKmh76HVVJzD0_NdPWxNx-eCII";
export const ChefAI = () => {
  return <BaseChefAI apiKey={COOKBOOK_PUBLIC_API_KEY} />;
};