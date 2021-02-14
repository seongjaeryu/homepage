import {Alert, ScrollView, View} from 'react-native';
import IAPCard, {IAPCardProps} from '../UI/molecules/IAPCard';
import {IC_COFFEE, IC_DOOBOO_IAP, IC_LOGO} from '../../utils/Icons';
import type {
  Product,
  ProductPurchase,
  Purchase,
  Subscription,
} from 'react-native-iap';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {requestPurchase, requestSubscription, useIAP} from 'react-native-iap';

import Header from '../UI/molecules/Header';
import {RootStackNavigationProps} from '../navigations/RootStackNavigator';
import {fbt} from 'fbt';
import firebase from 'firebase';
import styled from 'styled-components/native';
import {useAuthContext} from '../../providers/AuthProvider';
import {useTheme} from 'dooboo-ui';
import {withScreen} from '../../utils/wrapper';

const consumableSkus = [
  'com.dooboolab.bean',
  'com.dooboolab.coffee1',
  'com.dooboolab.coffee3',
  'com.dooboolab.coffee5',
  'com.dooboolab.coffee10',
  'com.dooboolab.coffee20',
  'com.dooboolab.coffee50',
];

const membershipSkus = ['com.dooboolab.lite', 'com.dooboolab.pro'];

const iapSkus = [...consumableSkus, ...membershipSkus];

const subSkus = [
  'com.dooboolab.skeleton',
  'com.dooboolab.iron',
  'com.dooboolab.bronze',
  'com.dooboolab.silver',
  'com.dooboolab.gold',
  'com.dooboolab.platinum',
  'com.dooboolab.diamond',
];

const Container = styled.SafeAreaView`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}): string => theme.background};

  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const StyledText = styled.Text`
  color: ${({theme}): string => theme.text};
`;

const ListContainer = styled.View`
  margin-bottom: 40px;

  flex-direction: column;
`;

type Props = {
  navigation: RootStackNavigationProps<'Sponsor'>;
};

type ItemType = 'onetime' | 'subscription' | 'membership';

const itemTypes: ItemType[] = ['onetime', 'subscription', 'membership'];

const Sponsor: FC<Props> = ({navigation}) => {
  const {theme} = useTheme();

  const {
    state: {user},
  } = useAuthContext();

  const {
    connected,
    products,
    subscriptions,
    getProducts,
    getSubscriptions,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  const sortedProducts = useMemo(
    () =>
      products.sort((a, b) => parseInt(a.price, 10) - parseInt(b.price, 10)),
    [products],
  );

  const sortedSubscriptions = useMemo(
    () =>
      subscriptions.sort(
        (a, b) => parseInt(a.price, 10) - parseInt(b.price, 10),
      ),
    [subscriptions],
  );

  useEffect(() => {
    getProducts(iapSkus);
    getSubscriptions(subSkus);
  }, [getProducts, getSubscriptions]);

  useEffect(() => {
    const checkCurrentPurchase = async (purchase?: Purchase): Promise<void> => {
      if (purchase) {
        if (user) {
          firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .collection('purchases')
            .add(purchase);

          const db = firebase.firestore();

          db.collection('sponsors').add({
            purchase,
            user,
          });
        }

        const receipt = purchase.transactionReceipt;

        if (receipt)
          try {
            const ackResult = await finishTransaction(purchase);

            console.log('ackResult', ackResult);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
      }
    };

    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction, user]);

  useEffect(() => {
    if (currentPurchaseError)
      Alert.alert(
        'purchase error',
        JSON.stringify(currentPurchaseError?.message),
      );
  }, [currentPurchaseError, currentPurchaseError?.message]);

  const purchase = (item: Product | Subscription): void => {
    if (item.type === 'iap') requestPurchase(item.productId);
    else requestSubscription(item.productId);
  };

  const renderIntro = (): ReactElement => {
    return (
      <StyledText
        style={{
          fontSize: 14,
          color: theme.primary,
          fontWeight: 'bold',
          marginTop: 48,
          marginLeft: 12,
          marginBottom: 8,
          textAlign: 'center',
          lineHeight: 18,
          paddingHorizontal: 32,
        }}>
        {fbt(
          // eslint-disable-next-line max-len
          'Your sponsoring will be noted in our homepage and app when transaction is completed 🎉. Your interests will make our community much valuable 🙏.',
          'transaction warning note',
        )}
      </StyledText>
    );
  };

  const renderWarningTextBox = (): ReactElement => {
    return (
      <StyledText
        style={{
          fontSize: 12,
          color: theme.negative,
          marginTop: 16,
          marginLeft: 12,
          marginBottom: 8,
          textAlign: 'center',
          paddingHorizontal: 20,
        }}>
        {fbt(
          'Note that once purchased, it will not be refunded. Please watch out before you continue transactions.',
          'transaction warning note',
        )}
      </StyledText>
    );
  };

  return (
    <Container>
      <ScrollView>
        {renderIntro()}
        <View
          style={{
            alignSelf: 'stretch',
            paddingTop: 20,
            paddingBottom: 40,
            backgroundColor: theme.background,
            marginHorizontal: 16,
          }}>
          {itemTypes.map((type) => {
            return (
              <ListContainer key={type}>
                <StyledText
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    marginTop: 32,
                    marginLeft: 12,
                    marginBottom: 8,
                    textAlign: 'center',
                  }}>
                  {type === 'onetime'
                    ? fbt('One-time sponsoring', 'one time sponsoring')
                    : type === 'subscription'
                    ? fbt('Monthly donation', 'monthly donation')
                    : fbt('Forever membership', 'forever membership')}
                </StyledText>
                <ScrollView
                  horizontal
                  style={{
                    backgroundColor: theme.paper,
                    borderRadius: 8,
                  }}
                  contentContainerStyle={{
                    paddingVertical: 28,
                    backgroundColor: theme.paper,
                    paddingHorizontal: 40,
                  }}>
                  {type === 'onetime'
                    ? sortedProducts.map((item, i) => {
                        if (membershipSkus.includes(item.productId)) return;

                        return (
                          <IAPCard
                            key={i.toString()}
                            price={parseFloat(item.price)}
                            priceString={item.localizedPrice}
                            name={item.title}
                            icon={IC_COFFEE}
                            style={{marginRight: 16}}
                            onPress={() => purchase(item)}
                          />
                        );
                      })
                    : type === 'subscription'
                    ? sortedSubscriptions.map((item, i) => {
                        return (
                          <IAPCard
                            type="subscription"
                            key={i.toString()}
                            price={parseFloat(item.price)}
                            priceString={item.localizedPrice}
                            name={item.title}
                            icon={IC_DOOBOO_IAP}
                            style={{marginRight: 16}}
                          />
                        );
                      })
                    : sortedProducts.map((item, i) => {
                        if (consumableSkus.includes(item.productId)) return;

                        return (
                          <IAPCard
                            type="forever"
                            key={i.toString()}
                            price={parseFloat(item.price)}
                            priceString={item.localizedPrice}
                            name={item.title}
                            icon={IC_LOGO}
                            style={{marginRight: 16}}
                          />
                        );
                      })}
                </ScrollView>
                {renderWarningTextBox()}
              </ListContainer>
            );
          })}
        </View>
      </ScrollView>
    </Container>
  );
};

export default withScreen(Sponsor);