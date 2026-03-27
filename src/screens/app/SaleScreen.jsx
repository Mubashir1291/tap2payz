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
import { IconSize12 } from '../../utils/IconSizes';
import {
  CategoriesIcon,
  ImageFrameIcon,
  LeftArrowIcon,
  RightArrowIcon,
  SearchIcon,
} from '../../assets/Images';
import styles from './SaleScreenStyles';
import SaleCartPanel from '../../components/SaleCartPanel';
import Toast from 'react-native-toast-message';
import { GET_ALL_CATEGORIES, GET_ALL_PRODUCTS_WITH_INVENTORY } from '../../services/ProductService';
import { useSelector } from 'react-redux';
import useDebounce from '../../utils/useDebounce';

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
  // eslint-disable-next-line unused-imports/no-unused-vars
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
  const debouncedValue = useDebounce(searchQuery, 500);

  const handleFetchAllCategories = async query => {
    try {
      const response = await GET_ALL_CATEGORIES(query);

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
    const existing = cart.find(c => c._id === item._id);

    if (existing) {
      setCart(cart.map(c => (c._id === item._id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, item.quantitySold >= item.quantity && styles.outOfStockCard]}
      activeOpacity={0.5}
      onPress={() => {
        if (item.quantitySold >= item.quantity) {
          Toast.show({
            type: 'error',
            text1: 'Out of Stock',
            text2: `${item.product_name} is currently out of stock.`,
          });
        } else {
          addToCart(item);
        }
      }}
    >
      <View style={styles.priceTag}>
        <Text style={[styles.priceText, Caption]}>${item.price}</Text>
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

  const handleFilterByCategory = cat => {
    if (cat?._id === selectedCategory?._id) {
      setSelectedCategory(null);
      setProductSearchQuery(prev => ({ ...prev, category_id: '' }));
    } else {
      setSelectedCategory(cat);
      setProductSearchQuery(prev => ({ ...prev, category_id: cat?._id }));
    }
  };

  const handleSearchTextChange = text => {
    setSearchQuery(text);
  };

  useEffect(() => {
    if (isAllCategoriesView) {
      setCategorySearchQuery(prev => ({
        ...prev,
        searchText: debouncedValue,
        page: 1,
      }));
    } else {
      setProductSearchQuery(prev => ({
        ...prev,
        searchText: debouncedValue,
        page: 1,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

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
              onChangeText={handleSearchTextChange}
            />
          </View>

          {/* All Categories */}
          <TouchableOpacity
            style={styles.allCategoryBtn}
            onPress={() => {
              setIsAllCategoriesView(!isAllCategoriesView);
              setSelectedCategory(null);
              setSearchQuery('');
              setProductSearchQuery(prev => ({ ...prev, category_id: '' }));
              setCategorySearchQuery(prev => ({ ...prev, searchText: '' }));
            }}
          >
            <Image source={CategoriesIcon} style={[IconSize12, styles.categoryIcon]} />
            <Text style={[styles.allCategoryText, Subtitle2]}>
              All {isAllCategoriesView ? 'Products' : 'Categories'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        {isAllCategoriesView ? (
          <View style={{ marginBottom: VS(16), paddingHorizontal: S(6) }}>
            <Text style={[Subtitle1, { color: Colors.black }]}>
              Total Categories: {categoriesData?.totalItems}
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
                  onPress={() => handleFilterByCategory(cat)}
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

        {/* Grid View */}
        {isAllCategoriesView ? (
          <FlatList
            data={categoriesItems}
            keyExtractor={item => item?._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryGridCard}
                activeOpacity={0.5}
                onPress={() => {
                  handleFilterByCategory(item);
                  setIsAllCategoriesView(false);
                }}
              >
                <Text style={[styles.categoryGridText, Subtitle2]}>{item?.name}</Text>
              </TouchableOpacity>
            )}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productListContent}
            // onEndReached={loadMoreProducts}
            // ListFooterComponent={
            //   isLoadingMore ? (
            //     <View style={styles.listFooterLoadingView}>
            //       <ActivityIndicator size="large" color={Colors.primary} />
            //     </View>
            //   ) : null
            // }
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
