import { html, fixture, expect } from '@open-wc/testing';
import "../insta-playlist.js";

describe("InstaPlaylist test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <insta-playlist
        title="title"
      ></insta-playlist>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
