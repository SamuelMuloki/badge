import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Badge, BadgeProps } from "../Badge";

describe("Badge", () => {
    let badgeProps: BadgeProps;
    const createBadge = (props: BadgeProps) => shallow(createElement(Badge, props));

    beforeEach(() => {
        badgeProps = {
            badgeValue: "0",
            label: "default",
            onClick: jasmine.createSpy("OnClick"),
            style: "default"
        };
    });

    it("should render the structure", () => {
        const badgeComponent = createBadge(badgeProps);

        expect(badgeComponent).toBeElement(
            DOM.div(
                {
                    className: "widget-badge-display widget-badge-link",
                    onClick: jasmine.any(Function) as any
                },
                DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                DOM.span({ className: "widget-badge badge label-default" }, badgeProps.badgeValue)
            )
        );
    });

    it("with style 'success' should have class 'widget-badge badge label-success'", () => {
        badgeProps.style = "success";

        const badgeComponent = createBadge(badgeProps);

        expect(badgeComponent.childAt(1).hasClass("widget-badge badge label-success")).toBe(true);
    });


    describe("click event", () => {

        it("with click function should respond to click event", () => {
            const onClick = badgeProps.onClick = jasmine.createSpy("onClick");
            const badgeComponent = createBadge(badgeProps);

            badgeComponent.simulate("click");

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it("without click function should render the structure", () => {
            badgeProps.onClick = undefined;

            const badgeComponent = createBadge(badgeProps);

            expect(badgeComponent).toBeElement(
                DOM.div(
                    {
                        className: "widget-badge-display"
                    },
                    DOM.span({ className: "widget-badge-text" }, badgeProps.label),
                    DOM.span({ className: "widget-badge badge label-default" }, badgeProps.badgeValue)
                )
            );
        });
    });
});