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
  ActivityIndicator,
  StyleSheet,
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
import ShimmerEffect from '../../components/ShimmerEffect';

const SaleScreen = () => {
  const navigation = useNavigation();
  const { store_id } = useSelector(state => state.user);

  const [cart, setCart] = useState([]);
  const [isAllCategoriesView, setIsAllCategoriesView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);
  const isLoadingProductsRef = useRef(false);

  const [categorySearchQuery, setCategorySearchQuery] = useState({
    page: 1,
    itemsPerPage: 20,
    searchText: '',
    getAll: 'false',
    limited: 'false',
    storeId: store_id,
  });
  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState(null);
  const [isLoadingMoreCategories, setIsLoadingMoreCategories] = useState(false);
  const isLoadingCategoriesRef = useRef(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryScrollRef = useRef(null);
  const scrollOffset = useRef(0);
  const debouncedValue = useDebounce(searchQuery, 500);

  const handleFetchAllCategories = async (query, loadMore = false) => {
    isLoadingCategoriesRef.current = true;
    if (loadMore) {
      setIsLoadingMoreCategories(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response = await GET_ALL_CATEGORIES(query);

      if (loadMore) {
        setCategories(prev => [...prev, ...(response?.items || [])]);
      } else {
        setCategories(response?.items || []);
      }
      setCategoriesData(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching categories',
        text2: error.message,
      });
    } finally {
      if (loadMore) {
        setIsLoadingMoreCategories(false);
      } else {
        setIsLoading(false);
      }
      isLoadingCategoriesRef.current = false;
    }
  };

  const handleFetchAllProducts = async (query, loadMore = false) => {
    isLoadingProductsRef.current = true;
    if (loadMore) {
      setIsLoadingMoreProducts(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response = await GET_ALL_PRODUCTS_WITH_INVENTORY(query);

      if (loadMore) {
        setProducts(prev => [...prev, ...(response?.items || [])]);
      } else {
        setProducts(response?.items || []);
      }
      setProductsData(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching products',
        text2: error.message,
      });
    } finally {
      if (loadMore) {
        setIsLoadingMoreProducts(false);
      } else {
        setIsLoading(false);
      }
      isLoadingProductsRef.current = false;
    }
  };

  useEffect(() => {
    handleFetchAllCategories(categorySearchQuery, categorySearchQuery.page > 1);
  }, [categorySearchQuery]);
  useEffect(() => {
    handleFetchAllProducts(productSearchQuery, productSearchQuery.page > 1);
  }, [productSearchQuery]);

  const addToCart = item => {
    const itemId = item._id || item.id || item.productId;
    const existing = cart.find(c => (c._id || c.id || c.productId) === itemId);

    if (existing) {
      setCart(
        cart.map(c => ((c._id || c.id || c.productId) === itemId ? { ...c, qty: c.qty + 1 } : c)),
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        item.quantity <= 0 && styles.outOfStockCard,
        item.quantity <= 0 && internalStyles.outOfStockBg,
      ]}
      activeOpacity={0.5}
      onPress={() => {
        if (item.quantity <= 0) {
          Toast.show({
            type: 'error',
            text1: 'Out of Stock',
            text2: `${item.name} is currently out of stock.`,
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
      <Text style={[styles.productName, Subtitle2, item.quantity <= 0 && internalStyles.redText]}>
        {item.name}
      </Text>
      {item.quantity <= 0 && (
        <Text style={[Caption, internalStyles.outOfStockLabel]}>Out of Stock</Text>
      )}
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
      setProductSearchQuery(prev => ({ ...prev, category_id: '', page: 1 }));
    } else {
      setSelectedCategory(cat);
      setProductSearchQuery(prev => ({ ...prev, category_id: cat?._id, page: 1 }));
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

  const loadMoreProducts = () => {
    if (
      isLoadingMoreProducts ||
      isLoadingProductsRef.current ||
      !productsData ||
      !productsData.hasNextPage
    ) {
      return;
    }
    isLoadingProductsRef.current = true;
    setProductSearchQuery(prev => ({ ...prev, page: prev.page + 1 }));
  };

  const loadMoreCategories = () => {
    if (
      isLoadingMoreCategories ||
      isLoadingCategoriesRef.current ||
      !categoriesData ||
      !categoriesData.hasNextPage
    ) {
      return;
    }
    isLoadingCategoriesRef.current = true;
    setCategorySearchQuery(prev => ({ ...prev, page: prev.page + 1 }));
  };

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
            <Image source={SearchIcon} style={[IconSize12, internalStyles.searchIcon]} />
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
              setIsLoading(true);
              setIsAllCategoriesView(!isAllCategoriesView);
              setSelectedCategory(null);
              setSearchQuery('');
              setProductSearchQuery(prev => ({
                ...prev,
                category_id: '',
                page: 1,
                searchText: '',
              }));
              setCategorySearchQuery(prev => ({ ...prev, searchText: '', page: 1 }));
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
          <View style={internalStyles.categoryCountContainer}>
            <Text style={[Subtitle1, internalStyles.blackText]}>
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
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <View key={i} style={[styles.categoryBtn, { backgroundColor: 'transparent', borderWidth: 0 }]}>
                    <ShimmerEffect width={100} height={40} borderRadius={25} />
                  </View>
                ))
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(null);
                      setProductSearchQuery(prev => ({ ...prev, category_id: '', page: 1 }));
                    }}
                    style={[styles.categoryBtn, selectedCategory === null && styles.activeCategory]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        Body3,
                        selectedCategory === null && styles.activeCategoryText,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
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
                </>
              )}
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
          isLoading ? (
            <FlatList
              data={Array.from({ length: 25 }, (_, i) => i)}
              keyExtractor={item => item.toString()}
              renderItem={() => (
                <View style={[styles.categoryGridCard, { backgroundColor: 'transparent' }]}>
                  <ShimmerEffect width="100%" height="100%" borderRadius={14} />
                </View>
              )}
              numColumns={5}
              contentContainerStyle={styles.productListContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={categoriesItems}
              keyExtractor={(item, index) => (item?._id ? String(item._id) : `category-${index}`)}
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
              onEndReached={loadMoreCategories}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                isLoadingMoreCategories ? (
                  <View style={internalStyles.footerLoader}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                  </View>
                ) : null
              }
            />
          )
        ) : isLoading ? (
          <FlatList
            data={Array.from({ length: 25 }, (_, i) => i)}
            keyExtractor={item => item.toString()}
            renderItem={() => (
              <View style={[styles.productCard, { backgroundColor: 'transparent' }]}>
                <ShimmerEffect width="100%" height="100%" borderRadius={14} />
              </View>
            )}
            numColumns={5}
            contentContainerStyle={styles.productListContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={productItems}
            keyExtractor={(item, index) => (item?._id ? String(item._id) : `product-${index}`)}
            renderItem={renderProduct}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productListContent}
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              isLoadingMoreProducts ? (
                <View style={internalStyles.footerLoader}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              ) : null
            }
          />
        )}
      </View>

      {/* ───── RIGHT CART PANEL ───── */}
      <SaleCartPanel cart={cart} setCart={setCart} onAddToCart={addToCart} />
    </View>
  );
};

const internalStyles = StyleSheet.create({
  outOfStockBg: {
    backgroundColor: '#E0E0E0',
  },
  redText: {
    color: 'red',
  },
  outOfStockLabel: {
    color: 'red',
    textAlign: 'center',
  },
  searchIcon: {
    marginRight: S(8),
  },
  categoryCountContainer: {
    marginBottom: VS(16),
    paddingHorizontal: S(6),
  },
  blackText: {
    color: Colors.black,
  },
  footerLoader: {
    padding: 20,
  },
});

export default SaleScreen;
