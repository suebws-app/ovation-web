const KioskLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background fixed inset-0 overflow-hidden">
      {children}
    </div>
  );
};

export default KioskLayout;
