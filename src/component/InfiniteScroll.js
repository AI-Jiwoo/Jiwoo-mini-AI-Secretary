import React, { useEffect, useRef } from 'react';

const InfiniteScroll = ({ children, loadMore, hasMore }) => {
    const observer = useRef();
    const lastElementRef = useRef();

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });

        if (lastElementRef.current) {
            observer.current.observe(lastElementRef.current);
        }
    }, [loadMore, hasMore]);

    return (
        <div>
            {children}
            <div ref={lastElementRef} style={{ height: '1px' }} />
        </div>
    );
};

export default InfiniteScroll;