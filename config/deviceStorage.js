import { AsyncStorage } from 'react-native';

const deviceStorage = {
    async setJWT(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
            await AsyncStorage.setItem('root', 'Auth');
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },
    async loadJWT() {
        try {
            const value = await AsyncStorage.getItem('id_token');
            if (value !== null) {
                this.setState({
                    loading: true,
                    jwt: value,
                });
            }else{
                this.setState({
                    loading: false,
                    jwt: false,
                });
            }
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },
    async loadInfo(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                console.log(value);
            }else{
                return null;
            }
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },

    async deleteJWT() {
        try{
            await AsyncStorage.removeItem('id_token');
            await AsyncStorage.setItem('root', 'App');
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    }
};

export default deviceStorage;
