import * as React from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { ApplicationState } from "../store";
import * as PackageItemsStore from "../store/PackageItems";
import * as BasketStore from "../store/Basket";
import { Link } from "react-router-dom";

type PackageItemListProps = PackageItemsStore.PackageItemsState &
    typeof PackageItemsStore.actionCreators &
    typeof BasketStore.actionCreators;

class PackageItemList extends React.PureComponent<PackageItemListProps> {
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    public render() {
        return (
            <React.Fragment>
                <h1 id="tabelLabel" className="mb-3">
                    Packages
                </h1>
                {/*{this.renderSortAndFilter()} not quite working correctly */}
                {this.renderPackageItems()}
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        this.props.requestPackageItems();
    }

    private renderSortAndFilter() {
        return (
            <div className="row mb-3">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-6"></div>
                                <div className="col-sm-3">
                                    <input
                                        type="text"
                                        placeholder="Search.."
                                        className="form-control"
                                        onChange={(
                                            e: React.FormEvent<HTMLInputElement>
                                        ) => this.onSearchChange(e)}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <select
                                        className="form-control"
                                        onChange={(
                                            e: React.FormEvent<HTMLSelectElement>
                                        ) => this.onSortChange(e)}
                                    >
                                        <option value="">Sort by..</option>
                                        <option value="Price">Price</option>
                                        <option value="Name">Name</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderPackageItems() {
        return (
            <div className="row pt-2">
                {this.props.packageItems.map(
                    (packageItem: PackageItemsStore.PackageItem) => (
                        <div className="col-sm-6 col-lg-3" key={packageItem.id}>
                            {this.renderPackageItem(packageItem)}
                        </div>
                    )
                )}
            </div>
        );
    }

    private renderPackageItem(packageItem: PackageItemsStore.PackageItem) {
        return (
            <div className="card mb-4">
                <img
                    className="card-img-top"
                    src="https://via.placeholder.com/500x200?text=Placeholder+image"
                    alt="placeholder"
                />
                <div className="card-body">
                    <h5 className="card-title">
                        <Link to={`/package/${packageItem.id}`}>
                            {packageItem.name}
                        </Link>
                    </h5>
                    <p className="card-text">{packageItem.description}</p>
                    <div className="row">
                        <div className="col-sm-4">
                            <strong>{packageItem.price}</strong>
                        </div>
                        <div className="col-sm-8">
                            <button
                                className="btn btn-sm btn-primary float-right"
                                onClick={() =>
                                    this.handleAddToBasketEvent(packageItem)
                                }
                            >
                                Add to basket
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

    private onSortChange(e: React.FormEvent<HTMLSelectElement>) {
        this.props.sortPackageItemList(e.currentTarget.value);
    }

    private onSearchChange(e: React.FormEvent<HTMLInputElement>) {
        this.props.filterPackageItemList(e.currentTarget.value);
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
    (state: ApplicationState) => state.packageItems,
    mapDispatchToProps
)(PackageItemList as any);
