import styled from "styled-components/native";
import { color } from "../../styles";
import Dialog, {
    DialogButton,
    DialogContent,
    DialogFooter,
} from "react-native-popup-dialog";
import { FONT_OFFSET } from "../../constant";

const Container = styled.View`
    padding-top: 20px;
    margin-bottom: -10px;
`;

export const PopupWithButtons = ({
    children,
    visible,
    onTouchOutside,
    onClick,
    negativeButtonLabel,
}) => {
    return (
        <Dialog
            visible={visible}
            onTouchOutside={onTouchOutside}
            onHardwareBackPress={onTouchOutside}
            overlayBackgroundColor="#000000cc"
            footer={
                <DialogFooter bordered={false}>
                    <DialogButton
                        text={
                            negativeButtonLabel ? negativeButtonLabel : "닫기"
                        }
                        onPress={onTouchOutside}
                        style={{
                            backgroundColor: color["image-area-background"],
                            marginTop: 1,
                        }}
                        textStyle={{
                            fontSize: 20 + FONT_OFFSET,
                            fontFamily: "SpoqaHanSansNeo-Bold",
                            color: color["page-black-text"],
                        }}
                        bordered={false}
                    />
                    <DialogButton
                        text="확인"
                        onPress={onClick}
                        style={{
                            backgroundColor: color["button-accent-background"],
                            marginTop: 1,
                        }}
                        textStyle={{
                            fontSize: 20 + FONT_OFFSET,
                            fontFamily: "SpoqaHanSansNeo-Bold",
                            color: "white",
                        }}
                        bordered={false}
                    />
                </DialogFooter>
            }
        >
            <DialogContent>
                <Container>{children}</Container>
            </DialogContent>
        </Dialog>
    );
};
