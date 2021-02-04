import { Action, Reducer } from "redux";
import { PackageItem } from "./PackageItems";

export interface BasketState {
    packages: PackageItem[];
    price: number;
}

export interface AddPackageAction {
    type: "ADD_PACKAGE";
    packageItem: PackageItem;
}
export interface RemovePackageAction {
    type: "REMOVE_PACKAGE";
    packageItem: PackageItem;
}

export type KnownAction = AddPackageAction | RemovePackageAction;

export const actionCreators = {
    addPackage: (packageItem: PackageItem) =>
        ({ type: "ADD_PACKAGE", packageItem: packageItem } as AddPackageAction),
    removePackage: (packageItem: PackageItem) =>
        ({
            type: "REMOVE_PACKAGE",
            packageItem: packageItem,
        } as RemovePackageAction),
};

export const reducer: Reducer<BasketState> = (
    state: BasketState | undefined,
    incomingAction: Action
): BasketState => {
    if (state === undefined) {
        return { packages: [], price: 0 };
    }

    const action = incomingAction as KnownAction;

    let newState = Object.assign({}, state);

    switch (action.type) {
        case "ADD_PACKAGE":
            if (
                !newState.packages.find(
                    (packageItem) => packageItem.id === action.packageItem.id
                )
            ) {
                newState.packages.push(action.packageItem);
            }

            break;
        case "REMOVE_PACKAGE":
            newState.packages = newState.packages.filter(
                (p) => p.id !== action.packageItem.id
            );

            break;
    }

    newState.price = newState.packages.reduce((a, b) => a + b.price, 0);

    if (newState.packages.length > 1) {
        newState.price = newState.price * 0.9;
    }

    return newState;
};
