export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="p-2">
        <div className="p-2 border rounded-sm shadow-md bg-background transition-colors duration-500 ease-out hover:border-primary/30">
          {children}
        </div>
      </div>
    </>
  );
};
