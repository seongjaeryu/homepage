import {IC_DOOBOOLAB, IC_DOOBOOLAB_DARK} from '../../../utils/Icons';
import React, {FC, ReactElement, RefObject, useState} from 'react';
import {ThemeType, useTheme} from 'dooboo-ui';
import styled, {css} from 'styled-components/native';

import Hoverable from '../../../utils/Hoverable';
import {ScrollView} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import {fbt} from 'fbt';
import {useNavigation} from '@react-navigation/native';

//eslint-disable-next-line
fbt;

const Container = styled.View`
  width: 100%;
  padding: 0 24px;
  background-color: ${({theme}) => theme.background};

  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  ${({theme: {isDesktop}}) =>
    isDesktop &&
    css`
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    `}
`;

const LogoTouch = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const Logo = styled.Image`
  width: 124px;
  height: 52px;
  margin: 12px 0;
  align-self: center;

  ${({theme: {isDesktop}}) =>
    isDesktop &&
    css`
      width: 112px;
      height: 48px;
      align-self: stretch;
    `}
`;

const LinkWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 14px;

  ${({theme: {isDesktop}}) =>
    isDesktop &&
    css`
      margin-right: 48px;
      margin-bottom: 0px;
    `}
`;

const LinkTouch = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const LinkText = styled.Text`
  font-size: 18px;
  padding: 0 28px;
  color: ${({theme}) => theme.text};
`;

const SwitchWrapper = styled.View`
  position: absolute;
  right: 20px;
  top: 25px;
`;

type LinkProps = {
  onPress?: () => void;
  text: string;
};

const Link: FC<LinkProps> = ({onPress, text}): ReactElement => {
  const {theme} = useTheme();

  return (
    <Hoverable>
      {(isHovered) => (
        <LinkTouch
          style={{marginHorizontal: 10}}
          activeOpacity={0.7}
          onPress={onPress}>
          <LinkText
            style={
              isHovered && {
                color: theme.heading,
                textDecorationLine: 'underline',
              }
            }>
            {text}
          </LinkText>
        </LinkTouch>
      )}
    </Hoverable>
  );
};

type Props = {
  scrollRef?: RefObject<ScrollView>;
  hideMenus?: boolean;
};

const Header: FC<Props> = ({scrollRef, hideMenus}) => {
  const navigation = useNavigation();
  const {theme, changeThemeType, themeType} = useTheme();
  const [switchOn, setSwitchOn] = useState(themeType === ThemeType.DARK);

  return (
    <Container>
      <Hoverable>
        {(isHovered) => (
          <LogoTouch
            onPress={() =>
              hideMenus
                ? navigation.navigate('Home')
                : scrollRef?.current?.scrollTo({y: 0})
            }>
            <Logo
              style={
                isHovered && {
                  shadowColor: theme.primary,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.24,
                  shadowRadius: 16,
                }
              }
              source={
                themeType === ThemeType.LIGHT ? IC_DOOBOOLAB : IC_DOOBOOLAB_DARK
              }
            />
          </LogoTouch>
        )}
      </Hoverable>
      <LinkWrapper>
        {!hideMenus && (
          <>
            <Link
              text={fbt('Story', 'story')}
              onPress={() => {
                scrollRef?.current?.scrollTo({y: 400});
              }}
            />
            <Link
              text={fbt('Work', 'work')}
              onPress={() => {
                scrollRef?.current?.scrollTo({y: 1720});
              }}
            />
            <Link
              text={fbt('Contact', 'contact')}
              onPress={() => {
                scrollRef?.current?.scrollTo({y: 2420});
              }}
            />
          </>
        )}
      </LinkWrapper>
      <SwitchWrapper>
        <ToggleSwitch
          isOn={switchOn}
          onToggle={(val: boolean) => {
            setSwitchOn(val);
            changeThemeType();
          }}
          onColor={theme.textContrast}
        />
      </SwitchWrapper>
    </Container>
  );
};

export default Header;
