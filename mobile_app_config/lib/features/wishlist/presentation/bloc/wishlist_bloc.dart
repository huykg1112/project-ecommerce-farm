import 'dart:convert';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../domain/entities/wishlist_item.dart';
import 'wishlist_event.dart';
import 'wishlist_state.dart';

/// WishlistBloc manages wishlist state with local storage persistence
class WishlistBloc extends Bloc<WishlistEvent, WishlistState> {
  final SharedPreferences _prefs;
  static const String _storageKey = 'wishlist_items';

  WishlistBloc(this._prefs) : super(const WishlistInitial()) {
    on<LoadWishlist>(_onLoadWishlist);
    on<AddToWishlist>(_onAddToWishlist);
    on<RemoveFromWishlist>(_onRemoveFromWishlist);
    on<ToggleWishlist>(_onToggleWishlist);
    on<ClearWishlist>(_onClearWishlist);

    // Auto-load wishlist on initialization
    add(const LoadWishlist());
  }

  Future<void> _onLoadWishlist(
    LoadWishlist event,
    Emitter<WishlistState> emit,
  ) async {
    emit(const WishlistLoading());

    try {
      final items = _loadFromStorage();
      emit(WishlistLoaded(items));
    } catch (e) {
      emit(WishlistError('Không thể tải danh sách yêu thích: $e'));
    }
  }

  Future<void> _onAddToWishlist(
    AddToWishlist event,
    Emitter<WishlistState> emit,
  ) async {
    final currentState = state;
    if (currentState is WishlistLoaded) {
      // Check if already exists
      if (currentState.isInWishlist(event.item.productId)) {
        return;
      }

      final updatedItems = [...currentState.items, event.item];
      _saveToStorage(updatedItems);
      emit(WishlistLoaded(updatedItems));
    }
  }

  Future<void> _onRemoveFromWishlist(
    RemoveFromWishlist event,
    Emitter<WishlistState> emit,
  ) async {
    final currentState = state;
    if (currentState is WishlistLoaded) {
      final updatedItems = currentState.items
          .where((item) => item.productId != event.productId)
          .toList();
      _saveToStorage(updatedItems);
      emit(WishlistLoaded(updatedItems));
    }
  }

  Future<void> _onToggleWishlist(
    ToggleWishlist event,
    Emitter<WishlistState> emit,
  ) async {
    final currentState = state;
    if (currentState is WishlistLoaded) {
      final exists = currentState.isInWishlist(event.item.productId);

      if (exists) {
        add(RemoveFromWishlist(event.item.productId));
      } else {
        add(AddToWishlist(event.item));
      }
    }
  }

  Future<void> _onClearWishlist(
    ClearWishlist event,
    Emitter<WishlistState> emit,
  ) async {
    _saveToStorage([]);
    emit(const WishlistLoaded([]));
  }

  List<WishlistItem> _loadFromStorage() {
    final jsonString = _prefs.getString(_storageKey);
    if (jsonString == null || jsonString.isEmpty) {
      return [];
    }

    try {
      final List<dynamic> jsonList = json.decode(jsonString);
      return jsonList
          .map((item) => WishlistItem.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      return [];
    }
  }

  void _saveToStorage(List<WishlistItem> items) {
    final jsonList = items.map((item) => item.toJson()).toList();
    _prefs.setString(_storageKey, json.encode(jsonList));
  }

  /// Helper method to check if product is in wishlist
  bool isInWishlist(String productId) {
    final currentState = state;
    if (currentState is WishlistLoaded) {
      return currentState.isInWishlist(productId);
    }
    return false;
  }

  /// Get current wishlist items
  List<WishlistItem> get items {
    final currentState = state;
    if (currentState is WishlistLoaded) {
      return currentState.items;
    }
    return [];
  }
}
