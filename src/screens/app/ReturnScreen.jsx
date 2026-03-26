import React, { useState, useMemo } from 'react';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { S } from '../../utils/Responsive';
import { Caption, Body2, Body3, Subtitle1, Subtitle2, H4, ButtonText } from '../../utils/fonts';
import { IconSize12, IconSize20 } from '../../utils/IconSizes';
import { RefreshICon, ChipIcon, DeleteIcon, SearchIcon, ImageFrameIcon } from '../../assets/Images';

import InvoiceModal from '../../components/InvoiceModal';
import SwipeableCartItem from '../../components/SwipeableCartItem';
import styles from './ReturnScreenStyles';

// Dummy past invoices for demonstration
const dummyInvoices = {
  'INV-001': {
    buyerInfo: {
      firstName: 'Michel',
      lastName: 'James',
      email: 'michelj@gmail.com',
      phone: '+923098487880',
    },
    items: [
      { id: 'inv1-1', name: 'Cola (25cl)', price: 16.23, qty: 2 },
      { id: 'inv1-2', name: 'Margherita Pizza', price: 85.0, qty: 1 },
      { id: 'inv1-3', name: 'Cheese Burger', price: 65.0, qty: 3 },
    ],
  },
  'INV-002': {
    buyerInfo: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah@gmail.com',
      phone: '+1234567890',
    },
    items: [
      { id: 'inv2-1', name: 'Orange Juice', price: 18.5, qty: 1 },
      { id: 'inv2-2', name: 'Pepperoni Pizza', price: 95.0, qty: 2 },
      { id: 'inv2-3', name: 'Mineral Water', price: 12.0, qty: 4 },
    ],
  },
  'INV-003': {
    buyerInfo: null,
    items: [
      { id: 'inv3-1', name: 'Frozen Fries (1kg)', price: 40.0, qty: 1 },
      { id: 'inv3-2', name: 'Ice Cream Tub', price: 90.0, qty: 2 },
    ],
  },
};

const ReturnScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [foundInvoice, setFoundInvoice] = useState(null);
  // const [invoiceNumber, setInvoiceNumber] = useState('');
  const [returnCart, setReturnCart] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleSearch = () => {
    const query = searchQuery.trim().toUpperCase();
    if (dummyInvoices[query]) {
      setFoundInvoice(dummyInvoices[query]);
      // setInvoiceNumber(query);
    } else {
      setFoundInvoice(null);
      // setInvoiceNumber('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFoundInvoice(null);
    // setInvoiceNumber('');
    setReturnCart([]);
  };

  const addToReturnCart = item => {
    const existing = returnCart.find(c => c.id === item.id);
    const invoiceItem = foundInvoice.items.find(i => i.id === item.id);
    const maxQty = invoiceItem ? invoiceItem.qty : 1;

    if (existing) {
      if (existing.qty < maxQty) {
        setReturnCart(returnCart.map(c => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
      }
    } else {
      setReturnCart([...returnCart, { ...item, qty: 1 }]);
    }
  };

  const removeFromReturnCart = id => {
    const existing = returnCart.find(c => c.id === id);
    if (existing.qty === 1) {
      setReturnCart(returnCart.filter(c => c.id !== id));
    } else {
      setReturnCart(returnCart.map(c => (c.id === id ? { ...c, qty: c.qty - 1 } : c)));
    }
  };

  const deleteFromReturnCart = id => {
    setReturnCart(returnCart.filter(c => c.id !== id));
  };

  const clearReturnCart = () => {
    setReturnCart([]);
  };

  const returnTotal = useMemo(() => {
    return returnCart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
  }, [returnCart]);

  const handleProceedReturn = () => {
    if (returnCart.length === 0) {
      return;
    }
    setShowInvoiceModal(true);
  };

  const handlePrintReceipt = () => {
    setShowInvoiceModal(false);
    setReturnCart([]);
    setFoundInvoice(null);
    setSearchQuery('');
    // setInvoiceNumber('');
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => addToReturnCart(item)}
    >
      <View style={styles.priceTag}>
        <Text style={[styles.priceText, Caption]}>$ {item.price}</Text>
      </View>
      <Image source={ImageFrameIcon} style={styles.productImage} />
      <Text style={[styles.productName, Subtitle2]}>{item.name}</Text>
      <Text style={[styles.qtyLabel, Caption]}>Qty: {item.qty}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* ───── LEFT PANEL ───── */}
      <View style={styles.leftPanel}>
        {/* Header */}
        <View style={styles.header}>
          {/* Hamburger */}
          <TouchableOpacity style={styles.hamburgerBtn} onPress={() => navigation.openDrawer()}>
            <View style={styles.hamburgerLine} />
            <View style={[styles.hamburgerLine, styles.hamburgerLineShort]} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Image source={SearchIcon} style={[IconSize12, { marginRight: S(8) }]} />
            <TextInput
              style={[styles.searchInput, Body3]}
              placeholder="Search Invoice Number..."
              placeholderTextColor={'#999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>

          {/* Clear Button */}
          <TouchableOpacity style={styles.clearSearchBtn} onPress={handleClearSearch}>
            <Text style={[styles.clearSearchText, Subtitle2]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Products from Invoice */}
        {foundInvoice ? (
          <FlatList
            data={foundInvoice.items}
            keyExtractor={item => item.id}
            renderItem={renderProduct}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productListContent}
          />
        ) : (
          <View style={styles.emptySearch}>
            <Text style={[styles.emptySearchText, Subtitle1]}>
              Search Invoice Number{'\n'}to Start Return!
            </Text>
          </View>
        )}
      </View>

      {/* ───── RIGHT CART PANEL ───── */}
      <View style={styles.cartPanel}>
        {/* Cart Header Icons */}
        <View style={styles.cartHeader}>
          <TouchableOpacity>
            <Image source={RefreshICon} style={[IconSize20, styles.cartHeaderIcon]} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={ChipIcon} style={[IconSize20, styles.cartHeaderIcon]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearReturnCart}>
            <Image source={DeleteIcon} style={[IconSize20, styles.cartHeaderIcon]} />
          </TouchableOpacity>
        </View>

        {returnCart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={[styles.emptyCartText, H4]}>Add items to Return!</Text>
          </View>
        ) : (
          <FlatList
            data={returnCart}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <SwipeableCartItem onDelete={() => deleteFromReturnCart(item.id)}>
                <View style={styles.cartItem}>
                  <View>
                    <Text style={[styles.cartItemName, Subtitle2]}>{item.name}</Text>
                    <Text style={[styles.cartItemPrice, Body3]}>
                      $ {item.price} x {item.qty}
                    </Text>
                  </View>

                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      onPress={() => removeFromReturnCart(item.id)}
                      style={styles.qtyBtn}
                    >
                      <Text style={[styles.qtyBtnText, ButtonText]}>−</Text>
                    </TouchableOpacity>

                    <Text style={[styles.qtyText, Body2]}>{item.qty}</Text>

                    <TouchableOpacity onPress={() => addToReturnCart(item)} style={styles.qtyBtn}>
                      <Text style={[styles.qtyBtnText, ButtonText]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </SwipeableCartItem>
            )}
          />
        )}

        {/* Refund Amount & Proceed */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, Subtitle1]}>Refund Amount (Cash)</Text>
            <Text style={[styles.refundAmount, H4]}>
              {returnCart.length > 0 ? `$-${returnTotal}` : 'CAD 00.00'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.proceedBtn, returnCart.length === 0 && styles.proceedBtnDisabled]}
            onPress={handleProceedReturn}
            disabled={returnCart.length === 0}
          >
            <Text style={[styles.proceedBtnText, ButtonText]}>Proceed to Return</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Invoice Modal for refunded items */}
      <InvoiceModal
        visible={showInvoiceModal}
        buyerInfo={foundInvoice?.buyerInfo || null}
        cartItems={returnCart}
        totalAmount={parseFloat(returnTotal)}
        onPrintReceipt={handlePrintReceipt}
        onClose={() => setShowInvoiceModal(false)}
      />
    </View>
  );
};

export default ReturnScreen;
