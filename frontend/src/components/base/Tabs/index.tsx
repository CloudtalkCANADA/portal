import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ITabs {
  titles: Array<string>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}

const Tabs: React.FC<ITabs> = ({ titles, selected, setSelected }) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);

  useEffect(() => {
    const tabs = tabsRef.current?.children;
    if (tabs) {
      const tabsArray = Array.from(tabs);
      for (let tab of tabsArray) {
        const htmlTab = tab as HTMLElement;
        if (htmlTab.textContent === selected) {
          setIndicatorWidth(htmlTab.clientWidth);
          setIndicatorLeft(htmlTab.offsetLeft);
          break;
        }
      }
    }
  }, [selected]);

  return (
    <div className="h-full flex flex-col">
      <div className="relative">
        <div className="flex gap-8 mb-2.75" ref={tabsRef}>
          {titles.map((title, index) => (
            <div className="flex flex-col gap-2.75" key={index}>
              <button
                className="*:font-bold text-15 leading-custom-20 uppercase text-accent transition duration-150 ease-in-out"
                onClick={() => setSelected(title)}
              >
                {title}
              </button>
            </div>
          ))}
        </div>
        <div
          className="absolute bottom-0 h-0.75 rounded-t-custom-4 bg-accent transition-all duration-300"
          style={{ width: indicatorWidth, left: indicatorLeft }}
        />
        <div className="border-b" />
      </div>
    </div>
  );
};

export default Tabs;
