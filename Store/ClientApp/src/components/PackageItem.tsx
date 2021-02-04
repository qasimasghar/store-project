import * as React from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import * as PackageItemsStore from "../store/PackageItems";
import * as BasketStore from "../store/Basket";

type PackageItemProps = PackageItemsStore.PackageItemState &
    typeof PackageItemsStore.actionCreators &
    typeof BasketStore.actionCreators &
    RouteComponentProps<{ id: string }>;

class PackageItem extends React.PureComponent<PackageItemProps> {
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    public render() {
        return <React.Fragment>{this.renderPackageItem()}</React.Fragment>;
    }

    private ensureDataFetched() {
        this.props.requestPackageItem(Number(this.props.match.params.id));
    }

    private renderPackageItem() {
        if (!this.props.packageItem) {
            return <h1>Not found..</h1>;
        }

        return (
            <div className="row pt-2">
                <div className="col-sm-6">
                    <h1 className="mb-4">{this.props.packageItem.name}</h1>
                    <img
                        className="card-img-top mb-4"
                        src="https://via.placeholder.com/500x200?text=Placeholder+image"
                        alt="placeholder"
                    />
                </div>
                <div className="col-sm-6">
                    <p className="card-text">
                        {this.props.packageItem.description}
                    </p>
                    <div className="row">
                        <div className="col-sm-6">
                            <h5>{this.props.packageItem.price.toFixed(2)}</h5>
                        </div>
                        <div className="col-sm-6">
                            <button
                                className="btn btn-primary float-right"
                                onClick={() =>
                                    this.handleAddToBasketEvent(
                                        this.props.packageItem
                                    )
                                }
                            >
                                <span>Add to Basket</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleAddToBasketEvent(packageItem: PackageItemsStore.PackageItem) {
        this.props.addPackage(packageItem);
    }
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
    return bindActionCreators(
        Object.assign(
            {},
            PackageItemsStore.actionCreators,
            BasketStore.actionCreators
        ),
        dispatch
    );
}

export default connect(
    (state: ApplicationState) => state.packageItem,
    mapDispatchToProps
)(PackageItem as any);
