import { useEffect, useRef, useState } from "react";
import { expose } from "comlink";

type CounterListener = (counter: number) => void;

export const Counter = () => {
  const [count, setCount] = useState(0);

  const [listeners, setListeners] = useState<CounterListener[]>([]);

  const api = useRef({
    increase: () => setCount((count) => count + 1),
    decrease: () => setCount((count) => count - 1),
    addCounterListener: (listener: CounterListener) => {
      console.log("addCounterListener", listener);
      setListeners((listeners) => [...listeners, listener]);
    },
    removeCounterListener: (listener: CounterListener) => {
      console.log("removeCounterListener", listener);
      setListeners((listeners) => listeners.filter((l) => l !== listener));
    },
  });

  useEffect(() => {
    console.log("child count", count, listeners);
    listeners.forEach((listener) => listener(count));
  }, [count, listeners]);

  const isExposedRef = useRef(false);
  useEffect(() => {
    if (isExposedRef.current) {
      return;
    }

    expose(api.current);
    isExposedRef.current = true;
  }, []);

  return (
    <div className="w-2xs h-12 flex items-center justify-center">{count}</div>
  );
};
