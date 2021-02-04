import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as BasketStore from "../store/Basket";

type BasketProps = BasketStore.BasketState & typeof BasketStore.actionCreators;

class BasketNavMenu extends React.PureComponent<BasketProps> {
    public render() {
        return (
            <React.Fragment>
                <div>
                    {this.renderBasketCount()}
                    <span> | </span>
                    {this.renderTotalPrice()}
                </div>
            </React.Fragment>
        );
    }

    private renderBasketCount() {
        return <span>Basket items: {this.props.packages.length}</span>;
    }

    private renderTotalPrice() {
        let discountText = <span></span>;

        if (this.props.packages.length > 1) {
            discountText = <span>(- 10%)</span>;
        }

        return (
            <span>
                {this.props.price.toFixed(2)} {discountText}
            </span>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.basket,
    BasketStore.actionCreators
)(BasketNavMenu as any);
