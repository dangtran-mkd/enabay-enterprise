import React from 'react';
import BraintreeDropIn from 'react-native-braintree-payments-drop-in';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import { Toast } from 'native-base';

export function onPlaceOrder(parent) {
    console.log(parent.selectedPayment);
    if(parent.selectedPayment.payment_method.toUpperCase() != 'SIMIBRAINTREE') {
        return false;
    }
    BraintreeDropIn.show({
        clientToken: parent.selectedPayment.token,
    }).then(result => {
        console.log(result);
        parent.onPlaceOrder({
            nonce: result.nonce,
            type: result.type,
            description: result.description
        });
    }).catch((error) => {
        console.log(error);
        Toast.show({
            text: Identify.__('Payment failed. Please try again'),
            type: "danger", textStyle: { fontFamily: material.fontFamily }, duration: 3000
        })
    });
    return true;
}