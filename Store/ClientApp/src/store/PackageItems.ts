import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";

// state

export interface PackageItemsState {
    isLoading: boolean;
    packageItems: PackageItem[];
}

export interface PackageItemState {
    isLoading: boolean;
    packageItem: PackageItem;
}

export interface PackageItem {
    id: number;
    name: string;
    description: string;
    products: [];
    price: number;
}

// actions

interface RequestPackageItemsAction {
    type: "REQUEST_PACKAGES";
}

interface ReceivePackageItemsAction {
    type: "RECEIVE_PACKAGES_ACTION";
    packageItems: PackageItem[];
}

interface FilterPackageItemsAction {
    type: "FILTER_PACKAGE_ACTION";
    filterBy: string;
}

interface SortPackageItemsAction {
    type: "SORT_PACKAGE_ACTION";
    sortBy: string;
}

interface RequestPackageItemAction {
    type: "REQUEST_PACKAGE";
}

interface ReceivePackageItemAction {
    type: "RECEIVE_PACKAGE_ACTION";
    packageItem: PackageItem;
}

type KnownPackageItemsAction =
    | RequestPackageItemsAction
    | ReceivePackageItemsAction
    | FilterPackageItemsAction
    | SortPackageItemsAction;
type KnownPackageItemAction =
    | RequestPackageItemAction
    | ReceivePackageItemAction;

// action creators

export const actionCreators = {
    requestPackageItems: (): AppThunkAction<KnownPackageItemsAction> => (
        dispatch,
        getState
    ) => {
        const appState = getState();

        if (
            appState &&
            appState.packageItems !== undefined &&
            appState.packageItems.packageItems.length === 0
        ) {
            fetch(`api/package`)
                .then((response) => response.json() as Promise<PackageItem[]>)
                .then((data) => {
                    dispatch({
                        type: "RECEIVE_PACKAGES_ACTION",
                        packageItems: data,
                    });
                });

            dispatch({ type: "REQUEST_PACKAGES" });
        }
    },
    requestPackageItem: (
        id: number
    ): AppThunkAction<KnownPackageItemAction> => (dispatch, getState) => {
        const appState = getState();

        if (
            appState &&
            appState.packageItem !== undefined &&
            appState.packageItem.packageItem.id !== id
        ) {
            fetch(`api/package/${id}`)
                .then((response) => response.json() as Promise<PackageItem>)
                .then((data) => {
                    dispatch({
                        type: "RECEIVE_PACKAGE_ACTION",
                        packageItem: data,
                    });
                });

            dispatch({ type: "REQUEST_PACKAGE" });
        }
    },
    sortPackageItemList: (
        sortType: string
    ): AppThunkAction<KnownPackageItemsAction> => (dispatch, getState) => {
        const appState = getState();

        if (
            appState &&
            appState.packageItems !== undefined &&
            appState.packageItems.packageItems.length !== 0
        ) {
            dispatch({
                type: "SORT_PACKAGE_ACTION",
                sortBy: sortType,
            });
        }
    },
    filterPackageItemList: (
        searchTerm: string
    ): AppThunkAction<KnownPackageItemsAction> => (dispatch, getState) => {
        const appState = getState();

        if (
            appState &&
            appState.packageItems !== undefined &&
            appState.packageItems.packageItems.length !== 0
        ) {
            dispatch({
                type: "FILTER_PACKAGE_ACTION",
                filterBy: searchTerm,
            });
        }
    },
};

// reducer

const packageItemsUnloadedState: PackageItemsState = {
    packageItems: [],
    isLoading: false,
};

export const packageItemsReducer: Reducer<PackageItemsState> = (
    state: PackageItemsState | undefined,
    incomingAction: Action
): PackageItemsState => {
    if (state === undefined) {
        return packageItemsUnloadedState;
    }

    const action = incomingAction as KnownPackageItemsAction;

    switch (action.type) {
        case "REQUEST_PACKAGES":
            return {
                packageItems: state.packageItems,
                isLoading: true,
            };
        case "RECEIVE_PACKAGES_ACTION":
            return {
                packageItems: action.packageItems,
                isLoading: false,
            };
        case "SORT_PACKAGE_ACTION":
            let sortedState = Object.assign({}, state);

            switch (action.sortBy) {
                case "Price":
                    sortedState.packageItems.sort((a, b) => {
                        return a.price - b.price;
                    });

                    break;
                case "Name":
                    sortedState.packageItems.sort((a, b) => {
                        return a.name.localeCompare(b.name);
                    });

                    break;
            }

            return sortedState;
        case "FILTER_PACKAGE_ACTION":
            let filteredState = Object.assign({}, state);

            filteredState.packageItems = filteredState.packageItems.filter(
                (packageItem) => packageItem.name.includes(action.filterBy)
            );

            return filteredState;
    }

    return state;
};

const packageItemUnloadedState: PackageItemState = {
    packageItem: { id: 0, name: "", description: "", products: [], price: 0 },
    isLoading: false,
};

export const packageItemReducer: Reducer<PackageItemState> = (
    state: PackageItemState | undefined,
    incomingAction: Action
): PackageItemState => {
    if (state === undefined) {
        return packageItemUnloadedState;
    }

    const action = incomingAction as KnownPackageItemAction;

    switch (action.type) {
        case "REQUEST_PACKAGE":
            return {
                packageItem: state.packageItem,
                isLoading: true,
            };
        case "RECEIVE_PACKAGE_ACTION":
            return {
                packageItem: action.packageItem,
                isLoading: false,
            };
    }

    return state;
};
