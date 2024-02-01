export const parseStringJSON = (string = "", defaultVal) => {
  if (!string || string?.length === 0) {
    return defaultVal;
  }
  try {
    return JSON.parse(string);
  } catch (_e) {
    return defaultVal;
  }
};

export const divideDataIntoRows = (data = []) =>
  data.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

export const getContentFromFroala = (element) => {
  const data = [];
  element.querySelectorAll(`.fr-element`).forEach((el) => {
    data.push(el.getContent());
  });
  return data;
};

export const getContentFromFroalaInstance = (element, rowIndex, indexInRow) => {
  const el = element.querySelectorAll(`.fr-element`)[rowIndex * 2 + indexInRow];
  return el.getContent();
};
