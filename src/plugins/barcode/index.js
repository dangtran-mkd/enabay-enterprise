import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Toast } from 'native-base';
import SimiPageComponent from "@base/components/SimiPageComponent";
import { RNCamera } from 'react-native-camera';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import { barcode } from '../constants'
import material from "@theme/variables/material";
// import { withNavigationFocus } from 'react-navigation'
import Identify from '@helper/Identify';
import BarcodeMask from 'react-native-barcode-mask';

class QrBarCode extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.foundResult = false;
    }

    handleWhenRequestFail() {
        this.showLoading('none');
        Alert.alert(
            Identify.__('Error'),
            Identify.__('There is No Product Matchs your Code'),
            [
                {
                    text: Identify.__('Cancel'),
                    style: 'cancel',
                    onPress: () => this.foundResult = false
                },
                { text: Identify.__('OK'), onPress: () => this.foundResult = false },
            ]
        );
    }

    setData(data) {
        this.showLoading('none');
        this.foundResult = false;
        if (data.error) {
            Toast.show({ text: data.error[0].message, textStyle: { fontFamily: material.fontFamily }, duration: 3000 })
        } else {
            this.foundResult = true;
            let productID = data.simibarcode.product_entity_id;
            NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                productId: productID
            });
            setTimeout(() => {
                this.foundResult = false;
            }, 2000);
        }

    }

    requestCheckQRCode(code) {
        new NewConnection()
            .init(barcode + '/' + code, 'get_qrcode_data', this)
            .setShowErrorAlert(false)
            .addGetData({
                type: code.includes('QR') ? '1' : '0'
            })
            .connect();
        this.showLoading('dialog');
    }

    cameraView() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: Identify.__('Permission to use camera'),
                        message: Identify.__('We need your permission to use your camera'),
                        buttonPositive: Identify.__('OK'),
                        buttonNegative: Identify.__('Cancel'),
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: Identify.__('Permission to use audio recording'),
                        message: Identify.__('We need your permission to use your audio'),
                        buttonPositive: Identify.__('OK'),
                        buttonNegative: Identify.__('Cancel'),
                    }}
                    onBarCodeRead={(barcode) => {
                        console.log('onBarCodeRead')
                        console.log(barcode.data)
                        if (barcode.data && !this.foundResult) {
                            this.foundResult = true;
                            this.requestCheckQRCode(barcode.data);

                        }
                    }}
                >
                    <BarcodeMask showAnimatedLine={false} />
                </RNCamera>
            </View>
        );
    }

    renderPhoneLayout() {
        const { isFocused } = this.props.navigation;
        if (isFocused) {
            return (this.cameraView());
        } else {
            return <View />;
        }
    }
}

export default QrBarCode

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
});
