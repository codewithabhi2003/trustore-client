import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-5">
        <Compass className="w-8 h-8 text-accent" />
      </div>
      <h1 className="text-3xl font-heading font-extrabold text-text-primary mb-2">Page not found</h1>
      <p className="text-sm text-text-secondary mb-8">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
