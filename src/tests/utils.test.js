import { replaceExternalLinkTargets } from "../utils";

global.window = Object.create(window);

describe("replaceExternalLinkTargets", () => {
  it("should set target of external links to _top", () => {
    Object.defineProperty(window, "location", {
      value: {
        hostname: "localhost",
      },
    });

    const htmlContent = `<p>testing <a target="_blank" href="http://external">External Link in new tab</a><a href="http://localhost">Internal Link</a><a href="http://external.com">External Link</a></p>`;

    const expectedOutput = `<p>testing <a target="_blank" href="http://external">External Link in new tab</a><a href="http://localhost">Internal Link</a><a href="http://external.com" target="_top">External Link</a></p>`;

    const result = replaceExternalLinkTargets(htmlContent);

    expect(result).toBe(expectedOutput);
  });
});
