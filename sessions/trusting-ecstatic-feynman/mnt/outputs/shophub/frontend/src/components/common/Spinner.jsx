export default function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-16 h-16' }[size];
  return (
    <div className="flex justify-center items-center p-8">
      <div className={`${s} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
    </div>
  );
}
