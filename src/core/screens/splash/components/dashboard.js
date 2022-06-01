import React from 'react';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import Identify from '@helper/Identify';
import Layout from '@helper/config/layout';
import Events from '@helper/config/events';
import AppStorage from "@helper/storage";
import simicart from '@helper/simicart';

class Dashboard extends React.Component {

    componentDidMount() {
        new NewConnection()
            .init(simicart.simicart_url + 'bear_token/' + simicart.simicart_authorization, 'get_dashboard_config', this)
            .setCustomURL(true)
            .setShowErrorAlert(false)
            .connect();
    }

    setData(data, requestID) {
        this.saveAppConfig(data)
    }

    handleWhenRequestFail(requestID) {
        AppStorage.getData('dashboard_configs').then(results => {
            if (results && results !== undefined) {
                let dataFromStorage = JSON.parse(results)
                this.saveAppConfig(dataFromStorage, false)
            }
        })
    }

    saveAppConfig(data, shouldSaveToStorage = true) {
        data['app-configs'][0]['site_plugins'] = [
            {config: {enable: "1", config_values: "{'default':{'mobile_platform':'1'}}"}, sku: "simi_simicontact_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_appwishlist_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_simibarcode_40"},
            {config: {enable: "1", config_values: ""}, sku: "magestore_productlabel_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_simivideo_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_paypalexpress_40"},
            {config: {enable: "1", config_values: ""}, sku: "checkout_management_40"},
            {config: {enable: "1", config_values: "{'default':{'mobile_platform':'1'}}"}, sku: "simi_simimixpanel_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_simiproductreview_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_simisocialshare_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_simicouponcode_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_searchvoice_40"},
            {config: {enable: "1", config_values: "{'default':{'facebook_key':'1231231231','facebook_name':','mobile_platform':'1'}}"}, sku: "simi_fblogin_40"},
            {config: {enable: "1", config_values: "{'default':{'mobile_platform':'1'}}"}, sku: "magestore_storelocator_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_addressautofill_40"},
            {config: {enable: "1", config_values: ""}, sku: "simi_simibraintree_40"},
            {config: {enable: "1", config_values: "{'default':{'image_search_key':'22222ssss','mobile_platform':'1'}}"}, sku: "simi_simisearchbyimage_40"}
        ]

        Identify.setAppConfig(data['app-configs'][0]);

        Layout.plugins = data['app-configs'][0]['site_plugins'] || [];
        Layout.initAppLayout();

        Events.plugins = data['app-configs'][0]['site_plugins'] || [];
        Events.initAppEvents();

        this.props.storeData(data);

        if (shouldSaveToStorage) {
            AppStorage.saveData('dashboard_configs', JSON.stringify(data))
        }
    }

    render() {
        return (null);
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (data) => {
            dispatch({ type: 'dashboard_configs', data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
