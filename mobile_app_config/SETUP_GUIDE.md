# Flutter Mobile App - Setup Guide

## 📱 Agricultural E-commerce Mobile Application

Clean Architecture Flutter app with agricultural green theme matching web frontend.

---

## 🚀 Getting Started

### Prerequisites

- Flutter SDK: >= 3.0.0
- Dart SDK: >= 3.0.0
- Android Studio / Xcode
- VS Code or Android Studio IDE

### Installation Steps

#### 1. Flutter Project Created

The Flutter project has been created at:
```
d:\LUANVAN\Project\test\project-ecommerce-farm\mobile_app\
```

#### 2. Replace Configuration Files

All template files are in `mobile_app_config/`. Copy them to the actual `mobile_app/` directory:

```bash
# Copy pubspec.yaml
copy mobile_app_config\pubspec_template.yaml mobile_app\pubspec.yaml

# Copy lib folder structure
xcopy /E /I mobile_app_config\lib mobile_app\lib
```

#### 3. Install Dependencies

```bash
cd mobile_app
flutter pub get
```

#### 4. Run Code Generation

```bash
# Generate injectable, json_serializable, hive, etc.
flutter pub run build_runner build --delete-conflicting-outputs
```

#### 5. Setup Assets

Create these folders:
```
mobile_app/
├── assets/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── fonts/      # Add Inter font files here
```

Download Inter font from [Google Fonts](https://fonts.google.com/specimen/Inter) and place in `assets/fonts/`.

#### 6. Android Configuration

**File**: `android/app/src/main/AndroidManifest.xml`

Add permissions:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
```

#### 7. iOS Configuration

**File**: `ios/Runner/Info.plist`

Add permissions:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to find nearby stores</string>
<key>NSCameraUsageDescription</key>
<string>We need camera access for product photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to upload images</string>
```

---

## 📁 Project Structure

```
mobile_app/lib/
├── core/                       ✅ COMPLETED
│   ├── constants/
│   │   ├── api_constants.dart
│   │   └── app_constants.dart
│   ├── error/
│   │   ├── exceptions.dart
│   │   └── failures.dart
│   ├── network/
│   │   ├── dio_client.dart
│   │   ├── auth_interceptor.dart
│   │   └── network_info.dart    ⏸️ TODO
│   ├── theme/
│   │   ├── app_colors.dart
│   │   ├── app_typography.dart
│   │   └──app_theme.dart
│   └── usecases/
│       └── usecase.dart
│
├── features/                    ⏸️ TODO (Phase 2+)
│   ├── auth/
│   ├── home/
│   ├── product/
│   └── ...
│
├── shared/                      ⏸️ TODO
│   └── widgets/
│
├── routes/                      ⏸️ TODO
│   ├── app_router.dart
│   └── route_names.dart
│
├── injection_container.dart     ⏸️ TODO
└── main.dart                    ⏸️ TODO
```

---

## ✅ Completed Files

### Core Infrastructure (Phase 1)

1. **Theme System**
   - ✅ `lib/core/theme/app_colors.dart` - Color palette
   - ✅ `lib/core/theme/app_typography.dart` - Typography
   - ✅ `lib/core/theme/app_theme.dart` - ThemeData config

2. **Constants**
   - ✅ `lib/core/constants/api_constants.dart` - API endpoints
   - ✅ `lib/core/constants/app_constants.dart` - App-wide constants

3. **Error Handling**
   - ✅ `lib/core/error/failures.dart` - Failure classes
   - ✅ `lib/core/error/exceptions.dart` - Exception classes

4. **Network**
   - ✅ `lib/core/network/dio_client.dart` - HTTP client
   - ✅ `lib/core/network/auth_interceptor.dart` - JWT interceptor

5. **Use Cases**
   - ✅ `lib/core/usecases/usecase.dart` - Base UseCase

6. **Dependencies**
   - ✅ `pubspec_template.yaml` - All dependencies configured

---

## 🎨 Theme Colors

The app uses agricultural green theme:

```dart
Primary:        #599146  // Main green
Primary Light:  #90C577
Primary Lighter:#ACCC8B
Primary Dark:   #44703D
Secondary:      #74A65D
```

---

## 🔧 Next Steps

### TODO - Phase 1 Remaining

- [ ] Create `lib/core/network/network_info.dart`
- [ ] Setup Dependency Injection (`injection_container.dart`)
- [ ] Create routing configuration
- [ ] Create `main.dart`
- [ ] Test app runs successfully

### Phase 2 - Authentication (Next)

See `task.md` for detailed breakdown.

---

## 🏃 Running the App

```bash
# Run on Android
flutter run

# Run on iOS
flutter run

# Run in release mode
flutter run --release

# Run with specific device
flutter run -d <device_id>

# List devices
flutter devices
```

---

## 📦 Dependencies Overview

| Category | Package | Purpose |
|----------|---------|---------|
| State | `flutter_bloc` | BLoC pattern |
| DI | `get_it`, `injectable` | Dependency injection |
| Network | `dio`, `retrofit` | HTTP client |
| Storage | `hive`, `shared_preferences` | Local storage |
| Navigation | `go_router` | Routing |
| UI | `cached_network_image`, `shimmer` | UI components |
| Maps | `google_maps_flutter` | Maps integration |
| Firebase | `firebase_core`, `firebase_analytics` | Analytics |

---

## 🐛 Troubleshooting

### Flutter doctor issues
```bash
flutter doctor -v
```

### Clear build cache
```bash
flutter clean
flutter pub get
```

### Code generation errors
```bash
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs
```

---

## 📝 Notes

- Backend URL is set to `http://localhost:4200/api` in `api_constants.dart`
- Change this to your actual backend URL before deployment
- All API endpoints are defined in `ApiConstants`
- Theme colors match the web frontend exactly

---

**Status**: Phase 1 - Core Infrastructure ✅ 85% Complete

**Next**: Complete remaining Phase 1 tasks, then proceed to Phase 2 (Authentication)
