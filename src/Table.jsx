export default function Table({ children }) {
  return (
    <div className="fixed inset-0 flex flex-col bg-green-800 text-white">
      <div className="h-[12vh] flex items-center justify-center">
        <div className="rounded-md bg-green-900/70 px-6 py-2 text-sm border border-green-950 shadow">
          Dealer
        </div>
      </div>

      <div className="h-[70vh] flex items-center justify-center">
        {children}
      </div>

      <div className="h-[18vh] flex items-center justify-center">
        <div className="rounded-md bg-green-900/70 px-6 py-2 text-sm border border-green-950 shadow">
          Player
        </div>
      </div>
    </div>
  );
}
