import React  from 'react';
import {
    Container,
    Header,
    Content,
    List,
    ListItem,
    Text,
    Left,
    Right,
    Icon,
    Button,
    Body,
    Switch,
    Item
} from 'native-base';
import {StyleSheet} from "react-native";
import lang from '../../config/Languages'

export default class ListScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Container style={styles.parent}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon type="AntDesign" name="arrowleft" style={{fontSize: 25, color: '#FFFFFF'}}/>
                        </Button>
                    </Left>
                    <Body style={{flex: 2}}>
                    <Text style={styles.headerText}>{lang.settings}</Text>
                    </Body>
                </Header>


                <Content style={{marginTop: 10}}>
                    <ListItem onPress={() => this.props.navigation.navigate('ProfileSettingsScreen')} icon>
                        <Left>
                            <Button style={{ backgroundColor: "#FF9501" }}>
                                <Icon active name={'user-o'} type={'FontAwesome'}/>
                            </Button>
                        </Left>
                        <Body style={styles.item} >
                        <Text style={styles.textStyle}>{lang.profile}</Text>
                        </Body>
                        <Right style={styles.item} >
                            <Icon active name="arrow-forward" />
                        </Right>
                    </ListItem>

                    <ListItem onPress={() => this.props.navigation.navigate('SecuritySettingsScreen')} icon>
                        <Left>
                            <Button style={{ backgroundColor: "#FF9501" }}>
                                <Icon active name={'security'} type={'MaterialCommunityIcons'}/>
                            </Button>
                        </Left>
                        <Body style={styles.item} >
                        <Text style={styles.textStyle}>{lang.security}</Text>
                        </Body>
                        <Right style={styles.item} >
                            <Icon active name="arrow-forward" />
                        </Right>
                    </ListItem>

                    <ListItem onPress={() => this.props.navigation.navigate('HistoryWatchScreen')} icon>
                        <Left>
                            <Button style={{ backgroundColor: "#FF9501" }}>
                                <Icon active name={'history'} type={'MaterialCommunityIcons'}/>
                            </Button>
                        </Left>
                        <Body style={styles.item} >
                        <Text style={styles.textStyle}>{lang.device_activity}</Text>
                        </Body>
                        <Right style={styles.item} >
                            <Icon active name="arrow-forward" />
                        </Right>
                    </ListItem>


                    <ListItem onPress={() => this.props.navigation.navigate('DevicesActivityScreen')} icon>
                        <Left>
                            <Button style={{ backgroundColor: "#FF9501" }}>
                                <Icon active name={'devices'} type={'MaterialIcons'}/>
                            </Button>
                        </Left>
                        <Body style={styles.item} >
                        <Text style={styles.textStyle}>{lang.history_watch}</Text>
                        </Body>
                        <Right style={styles.item} >
                            <Icon active name="arrow-forward" />
                        </Right>
                    </ListItem>


                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1B1B1B',
        height: 55
    },
    headerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18
    },
    parent: {
        backgroundColor: '#101010'
    },
    parentButton: {
        position: 'relative',
        marginTop: 20,
        left: '10%'
    },
    textStyle: {
        color: '#FFF'
    },
    item: {
        borderColor: '#232a3b',
    },
});
