import * as React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import PackageItem from "./components/PackageItem";
import PackageItemList from "./components/PackageItemList";
import Basket from "./components/Basket";
import "./custom.css";

export default () => (
    <Layout>
        <Route exact path="/" component={PackageItemList} />
        <Route exact path="/package/:id" component={PackageItem} />
        <Route exact path="/basket" component={Basket} />
    </Layout>
);
