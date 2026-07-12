
export function AlertError({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2 mb-4">
      
      <span className="text-sm">{message}</span>
    </div>
  );
}

export function AlertSuccess({ message }: { message: string }) {
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2 mb-4">
      
      <span className="text-sm">{message}</span>
    </div>
  );
}
