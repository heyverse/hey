import { render } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import Home from "./index";

vi.mock("../Composer/NewPost", () => ({ default: () => <div>NewPost</div> }));
vi.mock("../Explore/ExploreFeed", () => ({
  default: () => <div>ExploreFeed</div>
}));
vi.mock("../Shared/PageLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));
vi.mock("../../store/persisted/useAccountStore", () => ({
  useAccountStore: () => ({ currentAccount: undefined })
}));
vi.mock("../../store/persisted/useHomeTabStore", () => ({
  useHomeTabStore: () => ({ feedType: "FORYOU" })
}));
vi.mock("./FeedType", () => ({ default: () => <div>FeedType</div> }));
vi.mock("./ForYou", () => ({ default: () => <div>ForYou</div> }));
vi.mock("./Hero", () => ({ default: () => <div>Hero</div> }));
vi.mock("./Highlights", () => ({ default: () => <div>Highlights</div> }));
vi.mock("./Timeline", () => ({ default: () => <div>Timeline</div> }));

describe("Home", () => {
  it("renders correctly", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
