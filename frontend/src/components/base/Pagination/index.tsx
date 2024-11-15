import React, { Dispatch, SetStateAction } from "react";

import { ArrowLeftOutlineIcon, ArrowRightOutlineIcon } from "../icons";

export interface IPagination {
  length: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}

const Pagination: React.FC<IPagination> = ({
  length,
  selected,
  setSelected,
}) => {
  return (
    <div className="flex gap-1 items-center justify-center">
      <ArrowLeftOutlineIcon
        isDiabled={selected === 0 ? true : false}
        onClick={() => setSelected(selected > 0 ? --selected : 0)}
        className="hidden md:flex hover:bg-gray-300 rounded-lg cursor-pointer"
      />
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer ${
          selected === 0
            ? "bg-accent hover:bg-sky-300 text-white"
            : "hover:bg-gray-300"
        }`}
        onClick={() => setSelected(0)}
      >
        1
      </div>
      {length > 7 ? (
        <>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer ${
              selected === 1
                ? "bg-accent hover:bg-sky-300 text-white"
                : "hover:bg-gray-300"
            }`}
            onClick={() => setSelected(1)}
          >
            {selected < 4 ? 2 : "..."}
          </div>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer ${
              selected === 2
                ? "bg-accent hover:bg-sky-300 text-white"
                : "hover:bg-gray-300"
            }`}
            onClick={() =>
              setSelected(
                selected >= 4
                  ? selected < length - 4
                    ? selected - 1
                    : length - 5
                  : 2
              )
            }
          >
            {selected >= 4
              ? selected < length - 4
                ? selected
                : length - 4
              : 3}
          </div>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer ${
              selected >= 4 && selected <= length - 4
                ? "bg-accent hover:bg-sky-300 text-white"
                : selected === 3
                ? "bg-accent hover:bg-sky-300 text-white"
                : "hover:bg-gray-300"
            }`}
            onClick={() =>
              setSelected(
                selected >= 4
                  ? selected < length - 4
                    ? selected
                    : length - 4
                  : 3
              )
            }
          >
            {selected >= 4
              ? selected < length - 4
                ? selected + 1
                : length - 3
              : 4}
          </div>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer ${
              selected === length - 3
                ? "bg-accent hover:bg-sky-300 text-white"
                : "hover:bg-gray-300"
            }`}
            onClick={() =>
              setSelected(
                selected >= 4
                  ? selected < length - 4
                    ? selected + 1
                    : length - 3
                  : 4
              )
            }
          >
            {selected >= 4
              ? selected < length - 4
                ? selected + 2
                : length - 2
              : 5}
          </div>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer ${
              selected === length - 2
                ? "bg-accent hover:bg-sky-300 text-white"
                : "hover:bg-gray-300"
            }`}
            onClick={() => setSelected(length - 2)}
          >
            {selected < length - 4 ? "..." : length - 1}
          </div>
        </>
      ) : (
        <>
          {Array.from({ length: length - 2 }, (_, index) => index + 2).map(
            (paginationItem, index) => (
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer ${
                  selected === index + 1
                    ? "bg-accent hover:bg-sky-300 text-white"
                    : "hover:bg-gray-300"
                }`}
                key={index}
                onClick={() => setSelected(index + 1)}
              >
                {paginationItem}
              </div>
            )
          )}
        </>
      )}
      {length > 1 ? (
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer ${
            selected === length - 1
              ? "bg-accent hover:bg-sky-300 text-white"
              : "hover:bg-gray-300"
          }`}
          onClick={() => setSelected(length - 1)}
        >
          {length}
        </div>
      ) : null}
      <ArrowRightOutlineIcon
        isDiabled={selected === length - 1 ? true : false}
        onClick={() =>
          setSelected(selected < length - 1 ? ++selected : length - 1)
        }
        className="hidden md:flex hover:bg-gray-300 rounded-lg cursor-pointer"
      />
    </div>
  );
};

export default Pagination;
