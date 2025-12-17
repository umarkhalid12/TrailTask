import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { tradingData } from './dummyData';

const screenWidth = Dimensions.get('window').width;

const Home = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(
    tradingData.selectedTimeframe
  );
  const [orderType, setOrderType] = useState(tradingData.orderType);
  const [activeTab, setActiveTab] = useState('Positions');
  const [amount, setAmount] = useState('');

  // Prepare chart data for trading chart
  const chartValues = tradingData.chart.data.map((point) => point.close);
  const minValue = Math.min(...chartValues);
  const maxValue = Math.max(...chartValues);
  const valueRange = maxValue - minValue;
  const lastValue = chartValues[chartValues.length - 1];
  const chartHeight = 150;
  const topPadding = 10;
  const bottomPadding = 10;
  const usableHeight = chartHeight - topPadding - bottomPadding;
  
  // Calculate dot position to match exactly where the line ends
  // react-native-chart-kit uses approximately 15-18px padding on right side
  const chartRightPadding = 15;
  const chartTopPadding = 10;
  const chartBottomPadding = 10;
  const chartUsableHeight = chartHeight - chartTopPadding - chartBottomPadding;
  // Calculate Y position: chart is inverted (max at top, min at bottom)
  // Subtract 4 to center the 8px dot (half of dot size)
  const dotYPosition = chartTopPadding + ((maxValue - lastValue) / valueRange) * chartUsableHeight - 4;
  
  const chartData = {
    labels: tradingData.chart.data.map(() => ''),
    datasets: [
      {
        data: chartValues,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#000000',
    backgroundGradientFrom: '#000000',
    backgroundGradientTo: '#000000',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, 1)`, // Darker, fully opaque green
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 3, // Thicker line for darker appearance
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4CAF50',
      fill: '#4CAF50',
    },
  };

  const formatPrice = (price) => {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (      
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBottom}>
          <TouchableOpacity>
            <Icon name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.pairContainer}>
            <Image 
              source={require('./assets/bitcoin.png')} 
              style={styles.bitcoinLogo} 
            />
            <Text style={styles.pairText}>{tradingData.pair.fullName}</Text>
          </View>
          <TouchableOpacity>
            <Icon name="more-vert" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.priceText}>
            {formatPrice(tradingData.price.current)}
          </Text>
          <View style={styles.changeContainer}>
            <Icon
              name="arrow-upward"
              size={14}
              color="#4CAF50"
              style={styles.arrowIcon}
            />
            <Text style={styles.changeText}>
              {tradingData.price.change}%
            </Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={150}
            chartConfig={chartConfig}
            bezier
            withDots={false}
            withShadow={false}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            withInnerLines={false}
            withOuterLines={false}
            style={styles.chart}
            fromZero={false}
          />
        </View>

        {/* Timeframe Buttons */}
        <View style={styles.timeframeContainer}>
          {tradingData.timeframes.map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.timeframeButton,
                selectedTimeframe === timeframe && styles.timeframeButtonActive,
              ]}
              onPress={() => setSelectedTimeframe(timeframe)}>
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === timeframe && styles.timeframeTextActive,
                ]}>
                {timeframe}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Buy/Sell Buttons and Leverage */}
        <View style={styles.actionButtonsContainer}>
          <View style={styles.buySellContainer}>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sellButton}>
              <Text style={styles.sellButtonText}>Sell</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.leverageSelector}>
            <Text style={styles.leverageValue}>{tradingData.leverage}x</Text>
            <Icon name="arrow-drop-down" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Order Type and Available Balance */}
        <View style={styles.orderTypeContainer}>
          <View style={styles.orderTypeButtons}>
            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderType === 'Market' && styles.orderTypeButtonActive,
              ]}
              onPress={() => setOrderType('Market')}>
              <Text
                style={[
                  styles.orderTypeText,
                  orderType === 'Market' && styles.orderTypeTextActive,
                ]}>
                Market
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderType === 'Limit' && styles.orderTypeButtonActive,
              ]}
              onPress={() => setOrderType('Limit')}>
              <Text
                style={[
                  styles.orderTypeText,
                  orderType === 'Limit' && styles.orderTypeTextActive,
                ]}>
                Limit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>Available</Text>
            <Text style={styles.balanceAmount}>{tradingData.availableBalance} USDT</Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter Amount"
              placeholderTextColor="#666"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.currencySelector}>
              <Text style={styles.currencyText}>{tradingData.currency}</Text>
              <Icon name="arrow-drop-down" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderDots}>
              <View style={styles.sliderDot} />
              <View style={styles.sliderDot} />
              <View style={styles.sliderDot} />
              <View style={styles.sliderDot} />
              <View style={styles.sliderDot} />
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'Positions' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('Positions')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Positions' && styles.tabTextActive,
              ]}>
              Positions ({tradingData.positions.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Open Orders' && styles.tabActive]}
            onPress={() => setActiveTab('Open Orders')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Open Orders' && styles.tabTextActive,
              ]}>
              Open Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Hide Other Pairs' && styles.tabActive]}
            onPress={() => setActiveTab('Hide Other Pairs')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'Hide Other Pairs' && styles.tabTextActive,
              ]}>
              Hide Other Pairs
            </Text>
          </TouchableOpacity>
        </View>

        {/* Position Card */}
        {tradingData.positions.length > 0 && activeTab === 'Positions' && (
          <View style={styles.positionCard}>
            <View style={styles.positionHeader}>
              <View style={styles.positionTitleContainer}>
                <Image 
                  source={require('./assets/bitcoin.png')} 
                  style={styles.positionLogo} 
                />
                <Text style={styles.positionTitle}>
                  {tradingData.positions[0].pair}
                </Text>
                <Text style={styles.positionType}>
                  {tradingData.positions[0].type}
                </Text>
                <Text style={styles.positionLeverage}>
                  {tradingData.positions[0].leverage}x
                </Text>
              </View>
            </View>
            <View style={styles.positionDetails}>
              <View style={styles.positionRow}>
                <Text style={styles.positionLabel}>Unrealized PNL</Text>
                <Text style={styles.positionValuePositive}>
                  +{tradingData.positions[0].unrealizedPNL} USDT /{' '}
                  {tradingData.positions[0].unrealizedPNLPercent}%
                </Text>
              </View>
              <View style={styles.positionRow}>
                <Text style={styles.positionLabel}>Size</Text>
                <Text style={styles.positionValue}>
                  {tradingData.positions[0].size} BTC / $
                  {tradingData.positions[0].sizeUSD}
                </Text>
              </View>
              <View style={styles.positionRow}>
                <Text style={styles.positionLabel}>Margin({tradingData.positions[0].marginType})</Text>
                <Text style={styles.positionValue}>
                  ${tradingData.positions[0].margin} USDT
                </Text>
              </View>
              <View style={styles.positionRow}>
                <Text style={styles.positionLabel}>Entry Price</Text>
                <Text style={styles.positionValue}>
                  {tradingData.positions[0].entryPrice.toLocaleString()}
                </Text>
              </View>
              <View style={styles.positionRow}>
                <Text style={styles.positionLabel}>Liq. Price</Text>
                <Text style={styles.positionValue}>
                  {tradingData.positions[0].liquidationPrice.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#000000',
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bitcoinLogo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  pairText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  priceSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    marginRight: 4,
  },
  changeText: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '600',
  },
  chartContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: -30,
    marginRight: 0,
    marginVertical: 8,
    width: '100%',
    alignItems: 'flex-start',
  },
  chart: {
    marginVertical: 0,
    marginHorizontal: 0,
    borderRadius: 0,
  },
  lastDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#000000',
  },
  timeframeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  timeframeButtonActive: {
    backgroundColor: '#FFC107',
  },
  timeframeText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  timeframeTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buySellContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buyButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sellButton: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  sellButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  orderTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  orderTypeButtonActive: {
    backgroundColor: '#2A2A2A',
  },
  orderTypeText: {
    color: '#666',
    fontSize: 12,
  },
  orderTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  leverageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  leverageLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginRight: 8,
  },
  leverageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leverageValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  balanceContent: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    color: '#999',
    fontSize: 12,
    textAlign: 'right',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'right',
  },
  amountContainer: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  amountLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  amountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sliderContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 10,
    alignItems: 'center',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFC107',
  },
  tabText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FFC107',
    fontWeight: '600',
  },
  positionCard: {
    backgroundColor: '#2A2A2A',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    padding: 12,
  },
  positionHeader: {
    marginBottom: 10,
  },
  positionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  positionLogo: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  positionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  positionType: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  positionLeverage: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  positionDetails: {
    gap: 8,
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positionLabel: {
    color: '#999',
    fontSize: 12,
  },
  positionValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  positionValuePositive: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FFC107',
    marginHorizontal: 16,
    marginVertical: 15,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Home;

