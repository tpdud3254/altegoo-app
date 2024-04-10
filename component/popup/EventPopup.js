import styled from "styled-components/native";
import { color } from "../../styles";
import { Image, TouchableOpacity, View } from "react-native";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import RegularText from "../text/RegularText";
import Button from "../button/Button";
import { GetCurrentDateTime, SetAsyncStorageEventPopupTime } from "../../utils";

const Container = styled.View`
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    justify-content: space-between;
`;

const CloseButton = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: center;
`;

const NoMoreButton = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: -5px;
`;

export const EventPopup = ({ visible, onClose, width, height, url }) => {
    const noMore = () => {
        const now = GetCurrentDateTime();

        now.setUTCHours(23);
        now.setUTCMinutes(59);
        now.setUTCSeconds(59);
        now.setUTCMilliseconds(999);

        SetAsyncStorageEventPopupTime(now);
        onClose();
    };

    return (
        <Dialog
            visible={visible}
            onTouchOutside={onClose}
            onHardwareBackPress={onClose}
            overlayBackgroundColor="#00000044"
            width={width ? width - 20 : undefined}
            height={height ? height - 100 : undefined}
        >
            <DialogContent>
                <Container>
                    <NoMoreButton>
                        <TouchableOpacity onPress={noMore}>
                            <RegularText
                                style={{
                                    fontSize: 15,
                                    color: color["page-grey-text"],
                                }}
                            >
                                오늘은 그만보기
                            </RegularText>
                        </TouchableOpacity>
                    </NoMoreButton>

                    <Image
                        source={{
                            uri: url,
                        }}
                        style={{
                            width: width - 50,
                            height: height - 210,
                        }}
                        resizeMode="contain"
                    />
                    <CloseButton>
                        <Button
                            onPress={onClose}
                            style={{ width: 70, height: 40 }}
                            text="닫기"
                            textStyle={{ fontSize: 15 }}
                        />
                    </CloseButton>
                </Container>
            </DialogContent>
        </Dialog>
    );
};
