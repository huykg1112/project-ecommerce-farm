import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/token.dart';

part 'token_model.g.dart';

/// Token model - Data layer
@JsonSerializable()
class TokenModel extends Token {
  const TokenModel({
    required super.accessToken,
    required super.refreshToken,
    required super.accessTokenExpiresAt,
    required super.refreshTokenExpiresAt,
  });

  factory TokenModel.fromJson(Map<String, dynamic> json) =>
      _$TokenModelFromJson(json);

  Map<String, dynamic> toJson() => _$TokenModelToJson(this);

  factory TokenModel.fromEntity(Token token) {
    return TokenModel(
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    );
  }

  Token toEntity() {
    return Token(
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt,
      refreshTokenExpiresAt: refreshTokenExpiresAt,
    );
  }
}
