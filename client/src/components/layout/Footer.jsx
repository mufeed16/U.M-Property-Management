import { HiOutlineHeart } from 'react-icons/hi';

export function Footer() {
  return (
    <footer className="mt-8 py-4 text-center" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
      <p className="text-xs text-gray-400">
        Built with <HiOutlineHeart className="inline w-3 h-3 text-red-400" /> by{' '}
        <a
          href="https://mufeed.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline"
          style={{ color: '#3b82f6' }}
        >
          Mufeed Moosa
        </a>
      </p>
      <p className="text-[10px] text-gray-300 mt-1">UM Cottage &copy; {new Date().getFullYear()}</p>
    </footer>
  );
}
