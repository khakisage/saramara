interface LoadingProps {
  isLoading: boolean;
}

export default function Loading({ isLoading }: LoadingProps): JSX.Element {
  if (!isLoading) return <></>;
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}
