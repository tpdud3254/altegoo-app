import styled from "styled-components/native";
import { color } from "../../styles";
import { TouchableOpacity } from "react-native";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import BoldText from "../text/BoldText";

const Container = styled.View`
    padding-top: 20px;
    margin-bottom: -10px;
`;

export const Popup = ({
    children,
    visible,
    onTouchOutside,
    onClick,
    width,
}) => {
    return (
        <Dialog
            visible={visible}
            onTouchOutside={onTouchOutside}
            onHardwareBackPress={onTouchOutside}
            overlayBackgroundColor="#00000044"
            width={width ? width : undefined}
            footer={
                <TouchableOpacity
                    onPress={onClick}
                    style={{
                        height: 60,
                        backgroundColor: color["button-accent-background"],
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 1,
                    }}
                >
                    <BoldText style={{ fontSize: 20, color: "white" }}>
                        알겠습니다.
                    </BoldText>
                </TouchableOpacity>
            }
        >
            <DialogContent>
                <Container>{children}</Container>
            </DialogContent>
        </Dialog>
    );
};
