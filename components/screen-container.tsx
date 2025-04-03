import React from "react";

export const ScreenContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col min-w-full min-h-screen ">
      {children}
    </div>
  );
};

export const ScreenContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex grow flex-col px-4 pb-6 pt-2 md:px-5 lg:px-6 lg:pb-8 3xl:px-8 3xl:pt-4 4xl:px-10 4xl:pb-9">
      {children}
    </div>
  );
};
