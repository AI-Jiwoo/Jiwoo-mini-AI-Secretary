// hooks/useIntersectionObserver.js
import { useEffect, useState } from 'react';

const useIntersectionObserver = (elementRef, { threshold = 0, root = null, rootMargin = '0%' }) => {
    const [entry, setEntry] = useState();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setEntry(entry),
            { threshold, root, rootMargin }
        );

        const currentElement = elementRef.current;

        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [elementRef, threshold, root, rootMargin]);

    return entry;
};

export default useIntersectionObserver;