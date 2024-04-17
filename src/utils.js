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
  data
    .reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 2);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, [])
    .map((array) => [...array, (Math.random() + 1).toString(36).substring(7)]);

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

export const isInIframe = () => {
  return window.self !== window.top;
};

export const replaceExternalLinkTargets = (htmlContent) => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(htmlContent, "text/html");

  let anchors = doc.querySelectorAll("a");
  anchors.forEach((anchor) => {
    let href = anchor.getAttribute("href");
    let url;
    try {
      url = new URL(href);
    } catch (_) {
      return; // invalid URL, skip this anchor
    }
    if (
      url.hostname !== window.location.hostname &&
      !anchor.getAttribute("target") // if null or empty string
    ) {
      anchor.setAttribute("target", "_top");
    }
  });

  return doc.body.innerHTML;
};
