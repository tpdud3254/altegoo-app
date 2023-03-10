import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { theme } from "../../styles";

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export default function LoadingLayout() {
    return (
        <Container>
            <ActivityIndicator size={50} color={theme.main} />
        </Container>
    );
}
