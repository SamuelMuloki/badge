import { Component, DOM, MouseEventHandler, StatelessComponent , createElement } from "react";
import * as classNames from "classnames";

export type BadgeOnclick = "doNothing" | "showPage" | "callMicroflow";
export type PageSettings = "content" | "popup" | "modal";

export const ValidationAlert: StatelessComponent<{ message: string }> = (props) =>
    DOM.div({ className: "alert alert-danger widget-validation-message" }, props.message);

export interface BadgeProps {
    label?: string;
    badgeValue?: string;
    style?: string;
    microflow?: {
        onClickType: BadgeOnclick;
        microflowProps?: {
            name: string;
            guid: string;
        };
        pageProps?: {
            page: string;
            pageSetting: PageSettings;
            entity: string;
            guid: string;
        };
    } | any;
    disabled?: string;
}

export class Badge extends Component<BadgeProps, { alertMessage: string }> {
    static defaultProps: BadgeProps = { label: "default", style: "default" };
    private onClickEvent: MouseEventHandler<HTMLDivElement>;

    constructor(props: BadgeProps) {
        super(props);

        this.onClickEvent = () => this.handleOnClick(this.props);
        this.state = { alertMessage: "" };
    }

    componentDidMount() {
        // this.checkConfig();
    }

    render() {
        return createElement("div",
            {
                className: classNames("widget-badge-display",
                    { "widget-badge-link": !!this.props.microflow }
                ),
                onClick: this.onClickEvent
            },
            DOM.span({ className: "widget-badge-text" }, this.props.label),
            DOM.span({
                className: classNames("widget-badge", "badge",
                    { [`label-${this.props.style}`]: !!this.props.style }
                )
            }, this.props.badgeValue),
            this.state.alertMessage ? createElement(ValidationAlert, { message: this.state.alertMessage }) : null
        );
    }

    private handleOnClick(props: BadgeProps) {
        if (props.microflow.onClickType === "callMicroflow"
            && props.microflow.microflowProps.name && props.microflow.microflowProps.guid) {
            window.mx.ui.action(props.microflow.microflowProps.name, {
                error: (error) => {
                    this.setState({
                        alertMessage:
                        `Error while executing microflow: ${props.microflow.microflowProps.name}: ${error.message}`
                    });
                },
                params: {
                    applyto: "selection",
                    guids: [ props.microflow.microflowProps.guid ]
                }
            });
        } else if (props.microflow.onClickType === "showPage"
            && props.microflow.pageProps.page && props.microflow.pageProps.guid) {
            const context = new mendix.lib.MxContext();
            context.setTrackId(props.microflow.pageProps.guid);
            context.setTrackEntity(props.microflow.pageProps.entity);

            window.mx.ui.openForm(props.microflow.pageProps.page, {
                context,
                location: props.microflow.pageProps.pageSetting
            });
        }
    }
}
