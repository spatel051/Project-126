import * as React from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component {
    constructor(){
        super();
        this.state = {
            image: null
        }
    }

    getPermission = async() => {
        if(Platform.OS !== "web"){
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== "granted"){
                alert("Sorry we need camera permissions to make this work.")
            }
        }
    }

    pickImage = async() => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.ALL,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            })

            if(!result.cancelled){
                this.setState({
                    image: result.data
                })
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(E){
            console.log(E)
        }
    }

    uploadImage = async(uri) => {
        const data = new FormData()
        let fileName = uri.split('/')[uri.split('/').length - 1]
        `image/${uri.split('.')[uri.split('.').length - 1]}`
        const file_to_upload = {
            uri: uri,
            name: fileName,
            type: type
        }
        data.append("alphabet", file_to_upload)
        fetch("https://07afd951a187.ngrok.i o/predict-alphabet", {
            method: "POST",
            body: data,
            headers: {
                "content-type": "multipart/form-data",
            },
        })
        .then((response) => response.json())
        .then((result) => {
            console.log("Success:", result);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    componentDidMount(){
        this.getPermission();
    }

    render(){
        let { image } = this.state
        return(
            <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Button title = "Pick Image" onPress = {() => {this.pickImage()}}/>
            </View>
        );
    }
}