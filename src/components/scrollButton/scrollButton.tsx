import { useState, useEffect } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';

// While empty now, we keep the interface for future extensibility
type ScrollButtonProps = {
  // props can be added here if needed
};

const ScrollButton = ({}: ScrollButtonProps): JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = (): void => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);

    return () => {
      window.removeEventListener('scroll', toggleVisible);
    };
  }, []);

  return (
    <button className="fixed bottom-8 right-8 z-50 cursor-pointer text-2xl text-neutral-600 hover:opacity-80 md:text-4xl">
      <FaArrowCircleUp
        onClick={scrollToTop}
        style={{ display: visible ? 'inline' : 'none' }}
      />
    </button>
  );
};

export default ScrollButton;
