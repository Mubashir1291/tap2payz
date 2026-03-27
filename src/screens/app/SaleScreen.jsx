/* eslint-disable unused-imports/no-unused-vars */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  // ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { S, VS } from '../../utils/Responsive';
import { Caption, Body3, Subtitle1, Subtitle2 } from '../../utils/fonts';
import { IconSize12, IconSize40, IconSize20 } from '../../utils/IconSizes';
import {
  CategoriesIcon,
  ImageFrameIcon,
  LeftArrowIcon,
  RightArrowIcon,
  SearchIcon,
  ListIcon,
} from '../../assets/Images';
import styles from './SaleScreenStyles';
import SaleCartPanel from '../../components/SaleCartPanel';
import Toast from 'react-native-toast-message';
import { GET_ALL_CATEGORIES, GET_ALL_PRODUCTS_WITH_INVENTORY } from '../../services/ProductService';
import { useSelector } from 'react-redux';
import { Get_Inventory_Status } from '../../services/Transaction';

const SaleScreen = () => {
  const navigation = useNavigation();
  const { store_id } = useSelector(state => state.user);

  const [cart, setCart] = useState([]);
  const [isAllCategoriesView, setIsAllCategoriesView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [productSearchQuery, setProductSearchQuery] = useState({
    page: 1,
    itemsPerPage: 20,
    searchText: '',
    getAll: 'false',
    limited: 'false',
    storeId: store_id,
    category_id: '',
  });
  const [products, setProducts] = useState([]);
  const [productsData, setProductsData] = useState(null);

  const [categorySearchQuery, setCategorySearchQuery] = useState({
    page: 1,
    itemsPerPage: 10,
    searchText: '',
    getAll: 'false',
    limited: 'false',
    storeId: store_id,
  });
  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryScrollRef = useRef(null);
  const scrollOffset = useRef(0);

  const handleGetInventoryStatus = async () => {
    try {
      // Prepare products from cart
      const products = cartItems.map(item => ({
        pid: item.id,
        quantity: item.qty,
      }));

      // Prepare payload
      const payload = {
        transactionType: 'SALE',
        products,
        sale_store: storeID,
        deviceID: deviceid,
      };

      console.log('Payload:', payload);

      // Call API
      const response = await Get_Inventory_Status(payload);

      console.log(response, 'Get inventory status response');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching inventory status',
        text2: error.message,
      });
    }
  };

  const handleFetchAllCategories = async query => {
    try {
      const response = await GET_ALL_CATEGORIES(query);
      console.log(response, 'Get all category response');

      setCategories(response?.items);
      setCategoriesData(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching categories',
        text2: error.message,
      });
    }
  };

  const handleFetchAllProducts = async query => {
    try {
      const response = await GET_ALL_PRODUCTS_WITH_INVENTORY(query);
      console.log(response, 'Get all product with inventory response');

      setProducts(response?.items);
      setProductsData(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching products',
        text2: error.message,
      });
    }
  };

  useEffect(() => {
    handleFetchAllCategories(categorySearchQuery);
  }, [categorySearchQuery]);

  useEffect(() => {
    handleFetchAllProducts(productSearchQuery);
  }, [productSearchQuery]);

  const addToCart = item => {
    const existing = cart.find(c => c.id === item.id);

    if (existing) {
      setCart(cart.map(c => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.5}
      onPress={() => addToCart(item)}
    >
      <View style={styles.priceTag}>
        <Text style={[styles.priceText, Caption]}>$ {item.price}</Text>
      </View>
      <Image source={ImageFrameIcon} style={styles.productImage} />
      <Text style={[styles.productName, Subtitle2]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const categoriesItems = useMemo(() => {
    return categories?.map(cat => ({
      _id: cat?._id,
      name: cat?.category_name,
    }));
  }, [categories]);

  const productItems = useMemo(() => {
    return products?.map(product => ({
      _id: product?._id,
      name: product?.product_name,
      price: product?.price,
      quantity: product?.quantity,
      quantitySold: product?.quantitySold,
      bar_code: product?.bar_code,
    }));
  }, [products]);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* ───── LEFT PRODUCT PANEL ───── */}
      <View style={styles.leftPanel}>
        {/* Header */}
        <View style={styles.header}>
          {/* Hamburger Menu */}
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
              placeholder="Search..."
              placeholderTextColor={'#999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* All Categories */}
          <TouchableOpacity
            style={styles.allCategoryBtn}
            onPress={() => setIsAllCategoriesView(!isAllCategoriesView)}
          >
            <Image source={CategoriesIcon} style={[IconSize12, styles.categoryIcon]} />
            <Text style={[styles.allCategoryText, Subtitle2]}>All Categories</Text>
          </TouchableOpacity>

          {/* Grid/List Toggle */}
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => {
              setSelectedCategory('All');
              setIsAllCategoriesView(false);
            }}
          >
            <Image source={ListIcon} style={[IconSize20, styles.viewToggleIcon]} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        {isAllCategoriesView ? (
          <View style={{ marginBottom: VS(16), paddingHorizontal: S(6) }}>
            <Text style={[Subtitle1, { color: Colors.black }]}>
              Total Categories: {categories.length - 1}
            </Text>
          </View>
        ) : (
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={styles.categoryArrow}
              onPress={() => {
                const prevX = Math.max(0, scrollOffset.current - 200);
                categoryScrollRef.current?.scrollTo({ x: prevX, animated: true });
              }}
            >
              <Image source={LeftArrowIcon} style={[IconSize12, styles.arrowIcon]} />
            </TouchableOpacity>

            <ScrollView
              ref={categoryScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={e => {
                scrollOffset.current = e.nativeEvent.contentOffset.x;
              }}
              scrollEventThrottle={16}
            >
              {categoriesItems?.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryBtn,
                    selectedCategory?._id === cat?._id && styles.activeCategory,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      Body3,
                      selectedCategory?._id === cat?._id && styles.activeCategoryText,
                    ]}
                  >
                    {cat?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.categoryArrow}
              onPress={() => {
                const nextX = scrollOffset.current + 200;
                categoryScrollRef.current?.scrollTo({ x: nextX, animated: true });
              }}
            >
              <Image source={RightArrowIcon} style={[IconSize12, styles.arrowIcon]} />
            </TouchableOpacity>
          </View>
        )}

        {/* Product Grid */}
        {isAllCategoriesView ? (
          <FlatList
            data={categories.filter(c => c !== 'All')}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryGridCard}
                activeOpacity={0.5}
                onPress={() => {
                  setSelectedCategory(item);
                  setIsAllCategoriesView(false);
                }}
              >
                <Text style={[styles.categoryGridText, Subtitle2]}>{item}</Text>
              </TouchableOpacity>
            )}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productListContent}
          />
        ) : (
          <FlatList
            data={productItems}
            keyExtractor={item => item?._id}
            renderItem={renderProduct}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productListContent}
            // onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
            // ListFooterComponent={
            //   isLoadingMore ? (
            //     <View style={styles.listFooterLoadingView}>
            //       <ActivityIndicator size="large" color={Colors.primary} />
            //     </View>
            //   ) : null
            // }
          />
        )}
      </View>

      {/* ───── RIGHT CART PANEL ───── */}
      <SaleCartPanel cart={cart} setCart={setCart} onAddToCart={addToCart} />
    </View>
  );
};

export default SaleScreen;
