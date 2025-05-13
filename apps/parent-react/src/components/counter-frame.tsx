import { windowEndpoint, wrap, proxy, type Remote } from "comlink";
import { useEffect, useRef, useState } from "react";

type CounterApi = {
  increase: () => number;
  decrease: () => number;
  addCounterListener: (listener: (counter: number) => void) => void;
  removeCounterListener: (listener: (counter: number) => void) => void;
};

export const CounterFrame = () => {
  const [api, setApi] = useState<Remote<CounterApi> | null>(null);

  const proxyRef = useRef(
    proxy((count: number) => {
      console.log("parent counter", count);
    })
  );

  useEffect(() => {
    if (api) {
      api.addCounterListener(proxyRef.current);
    }
  }, [api]);

  const handleIncrease = async () => {
    await api?.increase();
  };

  const handleDecrease = () => {
    api?.decrease();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex gap-2">
        <button className="w-12 h-12" onClick={handleIncrease}>
          +
        </button>
        <button className="w-12 h-12" onClick={handleDecrease}>
          -
        </button>
      </div>

      <iframe
        className="flex"
        src="http://localhost:3004"
        onLoad={(event) => {
          if (event.currentTarget.contentWindow) {
            const endpoint = windowEndpoint(
              event.currentTarget.contentWindow,
              window,
              "*"
            );

            setApi((prev) => prev ?? wrap<CounterApi>(endpoint));
          }
        }}
      />
    </div>
  );
};
