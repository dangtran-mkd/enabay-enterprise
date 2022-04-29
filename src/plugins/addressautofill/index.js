import React from 'react';
import { Platform } from 'react-native';
import { ListItem, Body, CheckBox, Text } from 'native-base';
import NewConnection from '@base/network/NewConnection';
import { addressautofill } from '../constants'
import Identify from '@helper/Identify';
import Geolocation from '@react-native-community/geolocation';

export default class AddressAutoFill extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filled: false
        }
    }

    requestGetAddressInfo(latitude, longitude) {
        this.props.parent.showLoading('dialog')
        new NewConnection()
            .init(addressautofill, 'get_autofill_data', this)
            .addGetData({
                longitude: longitude,
                latitude: latitude
            })
            .connect();
    }

    setData(data) {
        this.setState({ filled: true });
        if (data && data.address) {
            this.fillAddressData(data.address);
        }
    }

    fillAddressData(data) {
        let filledAddress = JSON.parse(JSON.stringify(this.props.parent.state.address));

        if (data.hasOwnProperty('street')) {
            filledAddress['street'] = data.street;
        }
        if (data.hasOwnProperty('city')) {
            filledAddress['city'] = data.city;
        }
        if (data.hasOwnProperty('postcode')) {
            filledAddress['postcode'] = data.postcode;
        }
        if (data.hasOwnProperty('country_id') && data.country_id.length == 2) {
            filledAddress['country_name'] = data.country_name;
            filledAddress['country_id'] = data.country_id;
        }
        if (data.hasOwnProperty('region_id')) {
            filledAddress['region'] = data.region;
            filledAddress['region_code'] = data.region_id;
        }

        this.props.parent.setState({ showLoading: 'none', address: filledAddress });
    }

    handleWhenRequestFail() {
        this.props.parent.showLoading()
    }

    handlePositionData(latitude, longitude) {
        this.requestGetAddressInfo(latitude, longitude);
    }

    getCurrentLocation() {
        Geolocation.getCurrentPosition(
            ({ coords }) => {
                const { latitude, longitude } = coords;
                this.handlePositionData(latitude, longitude)
            },
            (error) => console.log(JSON.stringify(error)),
            { enableHighAccuracy: Platform.OS === 'ios' ? true : false, timeout: 20000, maximumAge: 1000 }
        )
    }

    componentDidMount() {
        if (!this.props.parent.mode.includes('edit')) {
            this.getCurrentLocation();
        }
    }

    render() {
        return (
            <ListItem style={{ marginBottom: 20, paddingLeft: 0, paddingRight: 0, marginLeft: 0, borderBottomWidth: 0 }}>
                <CheckBox checked={this.state.filled} onPress={() => {
                    if (!this.state.filled) {
                        this.getCurrentLocation();
                    }
                }} />
                <Body>
                    <Text>{Identify.__('Use location to checkout faster')}</Text>
                </Body>
            </ListItem>
        );
    }
}