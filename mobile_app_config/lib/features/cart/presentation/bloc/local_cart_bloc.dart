import 'dart:convert';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Represents an item in the local cart
class LocalCartItem extends Equatable {
  final String id; // productId/batchId combination
  final String productId;
  final String productName;
  final double price;
  final double? discountValue;
  final int quantity;
  final String imageUrl;
  final String sellerId;
  final String sellerName;
  final String? batchId;
  final String? batchName;

  const LocalCartItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.price,
    this.discountValue,
    required this.quantity,
    required this.imageUrl,
    required this.sellerId,
    required this.sellerName,
    this.batchId,
    this.batchName,
  });

  double get finalPrice => price - (discountValue ?? 0);
  double get totalPrice => finalPrice * quantity;
  bool get hasDiscount => discountValue != null && discountValue! > 0;

  LocalCartItem copyWith({
    String? id,
    String? productId,
    String? productName,
    double? price,
    double? discountValue,
    int? quantity,
    String? imageUrl,
    String? sellerId,
    String? sellerName,
    String? batchId,
    String? batchName,
  }) {
    return LocalCartItem(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      price: price ?? this.price,
      discountValue: discountValue ?? this.discountValue,
      quantity: quantity ?? this.quantity,
      imageUrl: imageUrl ?? this.imageUrl,
      sellerId: sellerId ?? this.sellerId,
      sellerName: sellerName ?? this.sellerName,
      batchId: batchId ?? this.batchId,
      batchName: batchName ?? this.batchName,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'productId': productId,
        'productName': productName,
        'price': price,
        'discountValue': discountValue,
        'quantity': quantity,
        'imageUrl': imageUrl,
        'sellerId': sellerId,
        'sellerName': sellerName,
        'batchId': batchId,
        'batchName': batchName,
      };

  factory LocalCartItem.fromJson(Map<String, dynamic> json) {
    return LocalCartItem(
      id: json['id'] as String,
      productId: json['productId'] as String,
      productName: json['productName'] as String,
      price: (json['price'] as num).toDouble(),
      discountValue: json['discountValue'] != null
          ? (json['discountValue'] as num).toDouble()
          : null,
      quantity: json['quantity'] as int,
      imageUrl: json['imageUrl'] as String,
      sellerId: json['sellerId'] as String,
      sellerName: json['sellerName'] as String,
      batchId: json['batchId'] as String?,
      batchName: json['batchName'] as String?,
    );
  }

  @override
  List<Object?> get props => [
        id,
        productId,
        productName,
        price,
        discountValue,
        quantity,
        imageUrl,
        sellerId,
        sellerName,
        batchId,
        batchName,
      ];
}

// ==================== EVENTS ====================

abstract class LocalCartEvent extends Equatable {
  const LocalCartEvent();

  @override
  List<Object?> get props => [];
}

class LoadLocalCart extends LocalCartEvent {
  const LoadLocalCart();
}

class AddToLocalCart extends LocalCartEvent {
  final LocalCartItem item;

  const AddToLocalCart(this.item);

  @override
  List<Object?> get props => [item];
}

class UpdateLocalCartQuantity extends LocalCartEvent {
  final String itemId;
  final int quantity;

  const UpdateLocalCartQuantity({
    required this.itemId,
    required this.quantity,
  });

  @override
  List<Object?> get props => [itemId, quantity];
}

class IncrementLocalCartQuantity extends LocalCartEvent {
  final String itemId;

  const IncrementLocalCartQuantity(this.itemId);

  @override
  List<Object?> get props => [itemId];
}

class DecrementLocalCartQuantity extends LocalCartEvent {
  final String itemId;

  const DecrementLocalCartQuantity(this.itemId);

  @override
  List<Object?> get props => [itemId];
}

class RemoveFromLocalCart extends LocalCartEvent {
  final String itemId;

  const RemoveFromLocalCart(this.itemId);

  @override
  List<Object?> get props => [itemId];
}

class ClearLocalCart extends LocalCartEvent {
  const ClearLocalCart();
}

// Selection Events
class ToggleCartItemSelection extends LocalCartEvent {
  final String itemId;

  const ToggleCartItemSelection(this.itemId);

  @override
  List<Object?> get props => [itemId];
}

class ToggleCartSellerSelection extends LocalCartEvent {
  final String sellerId;

  const ToggleCartSellerSelection(this.sellerId);

  @override
  List<Object?> get props => [sellerId];
}

class SelectAllCartItems extends LocalCartEvent {
  const SelectAllCartItems();
}

class DeselectAllCartItems extends LocalCartEvent {
  const DeselectAllCartItems();
}

// ==================== STATES ====================

abstract class LocalCartState extends Equatable {
  const LocalCartState();

  @override
  List<Object?> get props => [];
}

class LocalCartInitial extends LocalCartState {
  const LocalCartInitial();
}

class LocalCartLoading extends LocalCartState {
  const LocalCartLoading();
}

class LocalCartLoaded extends LocalCartState {
  final List<LocalCartItem> items;
  final Set<String> selectedItemIds;

  const LocalCartLoaded(
    this.items, {
    this.selectedItemIds = const {},
  });

  int get totalItems => items.fold(0, (sum, item) => sum + item.quantity);

  double get totalAmount =>
      items.fold(0.0, (sum, item) => sum + item.totalPrice);

  bool get isEmpty => items.isEmpty;
  bool get isNotEmpty => items.isNotEmpty;

  // Selection getters
  int get selectedItemsCount => items
      .where((item) => selectedItemIds.contains(item.id))
      .fold(0, (sum, item) => sum + item.quantity);

  double get selectedTotalAmount => items
      .where((item) => selectedItemIds.contains(item.id))
      .fold(0.0, (sum, item) => sum + item.totalPrice);

  bool get isAllSelected =>
      items.isNotEmpty && selectedItemIds.length == items.length;

  bool isSellerSelected(String sellerId) {
    final sellerItems = items.where((item) => item.sellerId == sellerId);
    if (sellerItems.isEmpty) return false;
    return sellerItems.every((item) => selectedItemIds.contains(item.id));
  }

  @override
  List<Object?> get props => [items, selectedItemIds];
}

class LocalCartError extends LocalCartState {
  final String message;

  const LocalCartError(this.message);

  @override
  List<Object?> get props => [message];
}

// ==================== BLOC ====================

/// LocalCartBloc manages cart state with SharedPreferences persistence
/// This mimics the frontend's Redux + localStorage approach
class LocalCartBloc extends Bloc<LocalCartEvent, LocalCartState> {
  final SharedPreferences _prefs;
  static const String _storageKey = 'local_cart_items';

  LocalCartBloc(this._prefs) : super(const LocalCartInitial()) {
    on<LoadLocalCart>(_onLoadCart);
    on<AddToLocalCart>(_onAddToCart);
    on<UpdateLocalCartQuantity>(_onUpdateQuantity);
    on<IncrementLocalCartQuantity>(_onIncrementQuantity);
    on<DecrementLocalCartQuantity>(_onDecrementQuantity);
    on<RemoveFromLocalCart>(_onRemoveFromCart);
    on<ClearLocalCart>(_onClearCart);
    // Selection handlers
    on<ToggleCartItemSelection>(_onToggleItemSelection);
    on<ToggleCartSellerSelection>(_onToggleSellerSelection);
    on<SelectAllCartItems>(_onSelectAll);
    on<DeselectAllCartItems>(_onDeselectAll);

    // Auto-load cart on initialization
    add(const LoadLocalCart());
  }

  Future<void> _onLoadCart(
    LoadLocalCart event,
    Emitter<LocalCartState> emit,
  ) async {
    print('DEBUG: Loading local cart...');
    emit(const LocalCartLoading());
    try {
      final items = _loadFromStorage();
      print('DEBUG: Loaded ${items.length} items from storage');
      emit(LocalCartLoaded(items));
    } catch (e) {
      print('DEBUG: Error loading cart: $e');
      emit(LocalCartError('Không thể tải giỏ hàng: $e'));
    }
  }

  Future<void> _onAddToCart(
    AddToLocalCart event,
    Emitter<LocalCartState> emit,
  ) async {
    print(
        'DEBUG: Adding to cart: ${event.item.productName} (id: ${event.item.id})');
    // Get current items from state or load from storage
    List<LocalCartItem> currentItems;
    Set<String> currentSelection = {};

    final currentState = state;
    if (currentState is LocalCartLoaded) {
      currentItems = List.from(currentState.items);
      currentSelection = Set.from(currentState.selectedItemIds);
    } else {
      // Load from storage if state is not LocalCartLoaded
      currentItems = _loadFromStorage();
    }

    // Check if item already exists (same id = productId/batchId)
    final existingIndex = currentItems.indexWhere((i) => i.id == event.item.id);

    if (existingIndex >= 0) {
      // Update quantity
      final existing = currentItems[existingIndex];
      currentItems[existingIndex] = existing.copyWith(
        quantity: existing.quantity + event.item.quantity,
      );
      print('DEBUG: Updated quantity for existing item');
    } else {
      // Add new item
      currentItems.add(event.item);
      // Auto-select newly added item
      currentSelection.add(event.item.id);
      print('DEBUG: Added new item. Total items: ${currentItems.length}');
    }

    _saveToStorage(currentItems);
    emit(LocalCartLoaded(currentItems, selectedItemIds: currentSelection));
  }

  Future<void> _onUpdateQuantity(
    UpdateLocalCartQuantity event,
    Emitter<LocalCartState> emit,
  ) async {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      final List<LocalCartItem> updatedItems = currentState.items.map((item) {
        if (item.id == event.itemId) {
          return item.copyWith(quantity: event.quantity);
        }
        return item;
      }).toList();

      _saveToStorage(updatedItems);
      emit(LocalCartLoaded(updatedItems,
          selectedItemIds: currentState.selectedItemIds));
    }
  }

  Future<void> _onIncrementQuantity(
    IncrementLocalCartQuantity event,
    Emitter<LocalCartState> emit,
  ) async {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      final List<LocalCartItem> updatedItems = currentState.items.map((item) {
        if (item.id == event.itemId) {
          return item.copyWith(quantity: item.quantity + 1);
        }
        return item;
      }).toList();

      _saveToStorage(updatedItems);
      emit(LocalCartLoaded(updatedItems,
          selectedItemIds: currentState.selectedItemIds));
    }
  }

  Future<void> _onDecrementQuantity(
    DecrementLocalCartQuantity event,
    Emitter<LocalCartState> emit,
  ) async {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      final List<LocalCartItem> updatedItems = [];

      for (final item in currentState.items) {
        if (item.id == event.itemId) {
          if (item.quantity > 1) {
            updatedItems.add(item.copyWith(quantity: item.quantity - 1));
          }
          // If quantity is 1, remove the item (don't add to list)
        } else {
          updatedItems.add(item);
        }
      }

      _saveToStorage(updatedItems);
      // Clean up selection if item removed
      final updatedSelection = Set<String>.from(currentState.selectedItemIds)
        ..retainAll(updatedItems.map((e) => e.id));

      emit(LocalCartLoaded(updatedItems, selectedItemIds: updatedSelection));
    }
  }

  Future<void> _onRemoveFromCart(
    RemoveFromLocalCart event,
    Emitter<LocalCartState> emit,
  ) async {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      final updatedItems =
          currentState.items.where((item) => item.id != event.itemId).toList();
      _saveToStorage(updatedItems);

      final updatedSelection = Set<String>.from(currentState.selectedItemIds)
        ..remove(event.itemId);

      emit(LocalCartLoaded(updatedItems, selectedItemIds: updatedSelection));
    }
  }

  Future<void> _onClearCart(
    ClearLocalCart event,
    Emitter<LocalCartState> emit,
  ) async {
    _saveToStorage([]);
    emit(const LocalCartLoaded([]));
  }

  Future<void> _onToggleItemSelection(
    ToggleCartItemSelection event,
    Emitter<LocalCartState> emit,
  ) async {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      final newSelection = Set<String>.from(currentState.selectedItemIds);
      if (newSelection.contains(event.itemId)) {
        newSelection.remove(event.itemId);
      } else {
        newSelection.add(event.itemId);
      }
      emit(LocalCartLoaded(currentState.items, selectedItemIds: newSelection));
    }
  }

  Future<void> _onToggleSellerSelection(
    ToggleCartSellerSelection event,
    Emitter<LocalCartState> emit,
  ) async {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      final sellerItems =
          currentState.items.where((item) => item.sellerId == event.sellerId);
      final sellerItemIds = sellerItems.map((e) => e.id).toSet();
      final newSelection = Set<String>.from(currentState.selectedItemIds);

      final allSelected =
          sellerItemIds.every((id) => newSelection.contains(id));

      if (allSelected) {
        // Deselect all items from this seller
        newSelection.removeAll(sellerItemIds);
      } else {
        // Select all items from this seller
        newSelection.addAll(sellerItemIds);
      }
      emit(LocalCartLoaded(currentState.items, selectedItemIds: newSelection));
    }
  }

  Future<void> _onSelectAll(
    SelectAllCartItems event,
    Emitter<LocalCartState> emit,
  ) async {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      final allIds = currentState.items.map((e) => e.id).toSet();
      emit(LocalCartLoaded(currentState.items, selectedItemIds: allIds));
    }
  }

  Future<void> _onDeselectAll(
    DeselectAllCartItems event,
    Emitter<LocalCartState> emit,
  ) async {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      emit(LocalCartLoaded(currentState.items, selectedItemIds: const {}));
    }
  }

  List<LocalCartItem> _loadFromStorage() {
    final jsonString = _prefs.getString(_storageKey);
    if (jsonString == null || jsonString.isEmpty) {
      print('DEBUG: No cart data in storage');
      return [];
    }

    try {
      final List<dynamic> jsonList = json.decode(jsonString);
      return jsonList
          .map((item) => LocalCartItem.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      print('DEBUG: Error parsing cart from storage: $e');
      return [];
    }
  }

  void _saveToStorage(List<LocalCartItem> items) {
    try {
      final jsonList = items.map((item) => item.toJson()).toList();
      _prefs.setString(_storageKey, json.encode(jsonList));
      print('DEBUG: Saved ${items.length} items to storage');
    } catch (e) {
      print('DEBUG: Error saving cart to storage: $e');
    }
  }

  /// Get current cart items
  List<LocalCartItem> get items {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      return currentState.items;
    }
    return [];
  }

  /// Get total items count
  int get totalItems {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      return currentState.totalItems;
    }
    return 0;
  }

  /// Get total amount
  double get totalAmount {
    final currentState = state;
    if (currentState is LocalCartLoaded) {
      return currentState.totalAmount;
    }
    return 0.0;
  }
}
