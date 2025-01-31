import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const usePinFooter = () => {
  const [showingComments, setShowingComments] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return {
    ref,
    showingComments,
    setShowingComments,
    inView,
  };
};
