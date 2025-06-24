import type { CSSProperties, ReactNode } from "react";
import { forwardRef, useCallback, useRef } from "react";
import { VariableSizeList as List } from "react-window";

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  loadMoreRef?: (node: HTMLSpanElement | null) => void;
  estimatedItemSize?: number;
  className?: string;
  height?: number;
}

const VirtualList = <T,>({
  items,
  renderItem,
  loadMoreRef,
  estimatedItemSize = 100,
  className,
  height = 600
}: VirtualListProps<T>) => {
  const listRef = useRef<List>(null);
  const sizeMap = useRef<Record<number, number>>({});

  const setSize = useCallback((index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current[index] = size;
      listRef.current?.resetAfterIndex(index);
    }
  }, []);

  const getSize = useCallback(
    (index: number) => sizeMap.current[index] || estimatedItemSize,
    [estimatedItemSize]
  );

  const itemCount = items.length + (loadMoreRef ? 1 : 0);

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    if (index >= items.length) {
      return (
        <div style={style}>
          <span ref={loadMoreRef} />
        </div>
      );
    }

    return (
      <div
        ref={(node) => {
          if (node) {
            setSize(index, node.getBoundingClientRect().height);
          }
        }}
        style={style}
      >
        {renderItem(items[index], index)}
      </div>
    );
  };

  const Inner = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => <div className={className} ref={ref} {...props} />);
  Inner.displayName = "Inner";

  return (
    <List
      estimatedItemSize={estimatedItemSize}
      height={height}
      innerElementType={Inner}
      itemCount={itemCount}
      itemSize={getSize}
      ref={listRef}
      width="100%"
    >
      {Row}
    </List>
  );
};

export default VirtualList;
