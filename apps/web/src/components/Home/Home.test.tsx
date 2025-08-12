import { render } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import Home from "./index";

vi.mock("@/components/Composer/NewPost", () => ({
  default: () => <div>NewPost</div>
}));
vi.mock("@/components/Explore/ExploreFeed", () => ({
  default: () => <div>ExploreFeed</div>
}));
vi.mock("@/components/Shared/PageLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));
vi.mock("@/components/Shared/Loader", () => ({
  default: () => <div>Loader</div>
}));
vi.mock("@/store/persisted/useAccountStore", () => ({
  useAccountStore: () => ({ currentAccount: undefined })
}));
vi.mock("@/store/persisted/useHomeTabStore", () => ({
  useHomeTabStore: () => ({ feedType: "FORYOU" })
}));
vi.mock("./FeedType", () => ({ default: () => <div>FeedType</div> }));
vi.mock("./ForYou", () => ({ default: () => <div>ForYou</div> }));
vi.mock("./Hero", () => ({ default: () => <div>Hero</div> }));
vi.mock("./Highlights", () => ({ default: () => <div>Highlights</div> }));
vi.mock("./Timeline", () => ({ default: () => <div>Timeline</div> }));

describe("Home", () => {
  it("renders correctly", async () => {
    const { container, findByText } = render(<Home />);
    await findByText("ExploreFeed");
    expect(container).toMatchSnapshot();
  });
});
