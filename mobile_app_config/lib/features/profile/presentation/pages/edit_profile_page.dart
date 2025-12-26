import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../injection_container.dart';
import '../../../../shared/widgets/common/app_button.dart';
import '../../../../shared/widgets/common/app_text_field.dart';
import '../../../../shared/widgets/common/cached_image.dart';
import '../../../../shared/widgets/common/custom_snackbar.dart';
import '../../../auth/domain/entities/user.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_event.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../../data/datasources/profile_remote_datasource.dart';
import '../../data/models/update_profile_dto.dart';

/// Edit Profile Page
class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final _imagePicker = ImagePicker();

  late TextEditingController _fullNameController;
  late TextEditingController _phoneController;
  late TextEditingController _emailController;
  late TextEditingController _cccdController;

  bool _isSaving = false;
  bool _isUploadingAvatar = false;
  File? _selectedImage;
  User? _currentUser;

  @override
  void initState() {
    super.initState();
    _fullNameController = TextEditingController();
    _phoneController = TextEditingController();
    _emailController = TextEditingController();
    _cccdController = TextEditingController();

    // Fetch current user data when page loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchUserData();
    });
  }

  void _fetchUserData() {
    // First try to get from current state
    final authState = context.read<AuthBloc>().state;
    if (authState is Authenticated) {
      _initializeFromUser(authState.user);
    } else {
      // Request fresh user data
      context.read<AuthBloc>().add(const GetCurrentUserRequested());
    }
  }

  void _initializeFromUser(User user) {
    setState(() {
      _currentUser = user;
      _fullNameController.text = user.fullName ?? '';
      _phoneController.text = user.phoneNumber ?? '';
      _emailController.text = user.email;
      _cccdController.text = user.cccd ?? '';
    });
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _cccdController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chỉnh sửa thông tin'),
        centerTitle: true,
      ),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is Authenticated && _currentUser == null) {
            _initializeFromUser(state.user);
          }
        },
        builder: (context, state) {
          // Use cached user if available
          final user =
              _currentUser ?? (state is Authenticated ? state.user : null);

          // Show loading state while fetching profile
          if (user == null) {
            if (state is AuthLoading || state is AuthInitial) {
              return _buildLoadingState();
            }
            return _buildErrorState();
          }

          return _buildContent(user);
        },
      ),
    );
  }

  /// Loading state with skeleton UI
  Widget _buildLoadingState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Loading avatar placeholder
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.grey[200],
            ),
            child: const Center(
              child: CircularProgressIndicator(),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Đang tải thông tin...',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.mutedForeground,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Vui lòng đợi trong giây lát',
            style: AppTextStyles.labelSmall.copyWith(
              color: AppColors.mutedForeground,
            ),
          ),
        ],
      ),
    );
  }

  /// Error state when cannot load user
  Widget _buildErrorState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'Không thể tải thông tin người dùng',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.mutedForeground,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            AppButton.primary(
              text: 'Thử lại',
              icon: const Icon(Icons.refresh, color: Colors.white, size: 18),
              onPressed: () {
                context.read<AuthBloc>().add(const GetCurrentUserRequested());
              },
            ),
            const SizedBox(height: 12),
            AppButton.secondary(
              text: 'Quay lại',
              onPressed: () => context.pop(),
            ),
          ],
        ),
      ),
    );
  }

  /// Main content with form
  Widget _buildContent(User user) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            _buildAvatarSection(user),
            const SizedBox(height: 32),
            _buildFormFields(user),
            const SizedBox(height: 32),
            AppButton.primary(
              text: 'Lưu thay đổi',
              isLoading: _isSaving,
              isFullWidth: true,
              onPressed: _handleSave,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAvatarSection(User user) {
    return Stack(
      alignment: Alignment.bottomRight,
      children: [
        Container(
          width: 120,
          height: 120,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.primary, width: 3),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipOval(
            child: _isUploadingAvatar
                ? Container(
                    color: Colors.black26,
                    child: const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    ),
                  )
                : _selectedImage != null
                    ? Image.file(
                        _selectedImage!,
                        fit: BoxFit.cover,
                        width: 114,
                        height: 114,
                      )
                    : (user.avatar != null && user.avatar!.isNotEmpty
                        ? AvatarImage(
                            imageUrl: user.avatar,
                            name: user.fullName ?? user.username,
                            size: 114,
                          )
                        : Container(
                            color: AppColors.muted,
                            child: Center(
                              child: Text(
                                _getInitials(user.fullName ?? user.username),
                                style: AppTextStyles.h2.copyWith(
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                          )),
          ),
        ),
        Positioned(
          bottom: 0,
          right: 0,
          child: InkWell(
            onTap: _showImagePickerOptions,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
              ),
              child:
                  const Icon(Icons.camera_alt, color: Colors.white, size: 20),
            ),
          ),
        ),
      ],
    );
  }

  String _getInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    } else if (parts.isNotEmpty && parts.first.isNotEmpty) {
      return parts.first[0].toUpperCase();
    }
    return 'U';
  }

  Widget _buildFormFields(User user) {
    return Column(
      children: [
        AppTextField(
          controller: _fullNameController,
          label: 'Họ và tên',
          hint: 'Nhập họ và tên',
          prefixIcon: const Icon(Icons.person_outline),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Vui lòng nhập họ và tên';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        AppTextField.phone(
          controller: _phoneController,
          label: 'Số điện thoại',
        ),
        const SizedBox(height: 16),
        AppTextField.email(
          controller: _emailController,
          label: 'Email',
          enabled: false,
        ),
        const SizedBox(height: 16),
        AppTextField(
          controller: _cccdController,
          label: 'Căn cước công dân',
          hint: 'Nhập số CCCD',
          prefixIcon: const Icon(Icons.badge_outlined),
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 16),
        _buildInfoRow(
          icon: Icons.verified_user_outlined,
          label: 'Vai trò',
          value: user.roleName ?? 'Người dùng',
        ),
      ],
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.muted,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.mutedForeground, size: 20),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.labelSmall.copyWith(
                  color: AppColors.mutedForeground,
                ),
              ),
              Text(
                value,
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showImagePickerOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              Text('Chọn ảnh đại diện', style: AppTextStyles.h4),
              const SizedBox(height: 16),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.camera_alt, color: AppColors.primary),
                ),
                title: const Text('Chụp ảnh'),
                subtitle: const Text('Sử dụng camera'),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child:
                      const Icon(Icons.photo_library, color: AppColors.primary),
                ),
                title: const Text('Chọn từ thư viện'),
                subtitle: const Text('Chọn ảnh có sẵn'),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickImage(ImageSource.gallery);
                },
              ),
              if (_selectedImage != null || _currentUser?.avatar != null)
                ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.delete_outline, color: Colors.red),
                  ),
                  title: const Text('Xóa ảnh',
                      style: TextStyle(color: Colors.red)),
                  subtitle: const Text('Sử dụng ảnh mặc định'),
                  onTap: () {
                    Navigator.pop(ctx);
                    setState(() => _selectedImage = null);
                    CustomSnackBar.showInfo(context,
                        message: 'Đã xóa ảnh đại diện');
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await _imagePicker.pickImage(
        source: source,
        maxWidth: 512,
        maxHeight: 512,
        imageQuality: 80,
      );

      if (pickedFile != null) {
        setState(() => _selectedImage = File(pickedFile.path));
        CustomSnackBar.showSuccess(
          context,
          message: 'Đã chọn ảnh. Nhấn "Lưu thay đổi" để cập nhật.',
        );
      }
    } catch (e) {
      CustomSnackBar.showError(
        context,
        message: 'Không thể chọn ảnh: ${e.toString()}',
      );
    }
  }

  void _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);

    try {
      final dataSource = ProfileRemoteDataSourceImpl(sl());
      String? avatarUrl;

      // Upload avatar if selected
      if (_selectedImage != null) {
        setState(() => _isUploadingAvatar = true);
        try {
          final result = await dataSource.uploadAvatar(_selectedImage!.path);
          avatarUrl = result['avatar'] as String?;
        } finally {
          if (mounted) {
            setState(() => _isUploadingAvatar = false);
          }
        }
      }

      // Create update DTO
      final dto = UpdateProfileDto(
        fullName: _fullNameController.text.trim(),
        phoneNumber: _phoneController.text.trim(),
        cccd: _cccdController.text.trim(),
        avatar: avatarUrl,
      );

      // Call update profile API
      await dataSource.updateProfile(dto);

      if (mounted) {
        // Refresh user data
        context.read<AuthBloc>().add(const GetCurrentUserRequested());
        CustomSnackBar.showSuccess(context,
            message: 'Cập nhật thông tin thành công');
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        CustomSnackBar.showError(context,
            message: 'Có lỗi xảy ra: ${e.toString()}');
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSaving = false;
          _isUploadingAvatar = false;
        });
      }
    }
  }
}
