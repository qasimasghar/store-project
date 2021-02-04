import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import { Link } from "react-router-dom";
import * as BasketStore from "../store/Basket";
import * as PackageItemsStore from "../store/PackageItems";
import { TrashcanIcon } from "@primer/octicons-react";

type BasketProps = BasketStore.BasketState & typeof BasketStore.actionCreators;

class Basket extends React.PureComponent<BasketProps> {
    public render() {
        return (
            <React.Fragment>
                <h1 id="tabelLabel">Basket</h1>
                {this.renderBasketItems()}
                {this.renderTotalPrice()}
            </React.Fragment>
        );
    }

    private renderBasketItems() {
        if (this.props.packages.length === 0) {
            return <div>Your basket is empty...</div>;
        }

        return (
            <table className="table table-hover" aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Package Name</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.packages.map(
                        (packageItem: PackageItemsStore.PackageItem) => (
                            <tr key={packageItem.id}>
                                <td>
                                    <Link to={`/package/${packageItem.id}`}>
                                        {packageItem.name}
                                    </Link>
                                </td>
                                <td>{packageItem.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger float-right"
                                        onClick={() =>
                                            this.handleRemoveFromBasketEvent(
                                                packageItem
                                            )
                                        }
                                    >
                                        <TrashcanIcon />
                                    </button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        );
    }

    private renderTotalPrice() {
        let discountText = <span></span>;

        if (this.props.packages.length > 1) {
            discountText = <span>(- 10%)</span>;
        }

        if (this.props.packages.length > 0) {
            return (
                <h5 className="float-right">
                    Total price: {this.props.price.toFixed(2)} {discountText}
                </h5>
            );
        }
    }

    private handleRemoveFromBasketEvent(
        packageItem: PackageItemsStore.PackageItem
    ) {
        this.props.removePackage(packageItem);
    }
}

export default connect(
    (state: ApplicationState) => state.basket,
    BasketStore.actionCreators
)(Basket as any);
