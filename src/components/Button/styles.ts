import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';


export const Container = styled(RectButton)`
    width: 100%;
    height: 60px;
    background: #FF9000;
    border-radius: 10px;
    padding: 0 30px;

    margin-top: 8px;
    justify-content: center;
    align-items: center;
`;

export const ButtonText = styled.Text`
    font-family: 'RobotoSlab-Medium';
    color: #312E38;
    font-size: 18px;
`;
