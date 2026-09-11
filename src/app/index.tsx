import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WarungkuColors } from '@/constants/colors';
import { WarungkuLogo } from '@/components/warungku-logo';
import { loginApi } from '@/api/auth';
import { useStore } from '@/context/store-context';

export default function LoginScreen() {
  const router = useRouter();
  const { loginUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  // Auth feedback state
  const [authError, setAuthError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateEmail = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Email wajib diisi';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Format email tidak valid (contoh: owner@warungku.id)';
    }
    return '';
  };

  const validatePassword = (value: string): string => {
    if (!value) {
      return 'Kata sandi wajib diisi';
    }
    if (value.length < 6) {
      return 'Kata sandi minimal 6 karakter';
    }
    return '';
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(validateEmail(text));
    }
    if (authError) setAuthError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(validatePassword(text));
    }
    if (authError) setAuthError('');
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    setAuthError('');
    setLoginSuccess(false);

    const errEmail = validateEmail(email);
    const errPass = validatePassword(password);

    setEmailError(errEmail);
    setPasswordError(errPass);

    if (errEmail || errPass) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginApi({
        email: email.trim(),
        password,
      });

      if (!result.success || !result.user) {
        setAuthError(result.error || 'Login gagal, periksa email dan kata sandi Anda.');
        setIsLoading(false);
        return;
      }

      // Success: Save auth state to context
      loginUser(result.user, result.store ?? null);
      setLoginSuccess(true);
      setIsLoading(false);

      // Navigate to tabs dashboard
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    } catch (err: any) {
      setIsLoading(false);
      setAuthError(err?.message || 'Gagal menghubungi server backend.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <View style={styles.headerSection}>
              <WarungkuLogo />
              <Text style={styles.pageTitle}>Masuk ke Akun</Text>
              <Text style={styles.pageSubtitle}>
                Kelola kasir, stok, dan laporan warung Anda dengan mudah.
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              {/* Error Banner */}
              {!!authError && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerTitle}>Gagal Masuk</Text>
                  <Text style={styles.errorBannerSubtitle}>{authError}</Text>
                </View>
              )}

              {/* Success Banner */}
              {loginSuccess && (
                <View style={styles.successBanner}>
                  <Text style={styles.successBannerTitle}>Login Berhasil</Text>
                  <Text style={styles.successBannerSubtitle}>
                    Selamat datang kembali, {email.trim()}!
                  </Text>
                </View>
              )}

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'email' && styles.inputWrapperFocused,
                    !!emailError && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="nama@warungku.id"
                    placeholderTextColor={WarungkuColors.outline}
                    value={email}
                    onChangeText={handleEmailChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => {
                      setFocusedField(null);
                      setEmailError(validateEmail(email));
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </View>
                {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.passwordLabelRow}>
                  <Text style={styles.label}>Kata Sandi</Text>
                  <TouchableOpacity
                    onPress={() => {}}
                    disabled={isLoading}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.forgotPasswordText}>Lupa sandi?</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'password' && styles.inputWrapperFocused,
                    !!passwordError && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor={WarungkuColors.outline}
                    value={password}
                    onChangeText={handlePasswordChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => {
                      setFocusedField(null);
                      setPasswordError(validatePassword(password));
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.showPasswordButton}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.showPasswordText}>
                      {showPassword ? 'Tutup' : 'Lihat'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color={WarungkuColors.onPrimary} />
                    <Text style={styles.loginButtonText}>Memproses...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>Masuk</Text>
                )}
              </TouchableOpacity>

              {/* Footer text */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                  Belum punya akun warung?{' '}
                  <Text
                    style={styles.footerLink}
                    onPress={() => router.push('/register')}
                  >
                    Daftar sebagai Pemilik
                  </Text>
                </Text>
              </View>

              {/* Preview Dashboard Demo Button */}
              <TouchableOpacity
                style={styles.previewDashboardButton}
                activeOpacity={0.8}
                onPress={() => router.replace('/(tabs)')}
              >
                <Text style={styles.previewDashboardText}>
                  Masuk ke Dashboard (Preview) →
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WarungkuColors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginTop: 16,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  card: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: WarungkuColors.surfaceContainer,
  },
  errorBanner: {
    backgroundColor: WarungkuColors.errorContainer,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.error,
  },
  errorBannerSubtitle: {
    fontSize: 12,
    color: WarungkuColors.error,
    marginTop: 2,
  },
  successBanner: {
    backgroundColor: WarungkuColors.successContainer,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#a3e8cc',
  },
  successBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.success,
  },
  successBannerSubtitle: {
    fontSize: 12,
    color: WarungkuColors.success,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: WarungkuColors.text,
    marginBottom: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '500',
    color: WarungkuColors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    minHeight: 48,
  },
  inputWrapperFocused: {
    borderColor: WarungkuColors.primary,
    backgroundColor: '#ffffff',
  },
  inputWrapperError: {
    borderColor: WarungkuColors.error,
    backgroundColor: WarungkuColors.errorContainer,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: WarungkuColors.text,
    paddingVertical: 10,
  },
  passwordInput: {
    paddingRight: 8,
  },
  showPasswordButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  showPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.primary,
  },
  errorText: {
    fontSize: 12,
    color: WarungkuColors.error,
    marginTop: 4,
    marginLeft: 2,
  },
  loginButton: {
    backgroundColor: WarungkuColors.primary,
    borderRadius: 14,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.75,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
    letterSpacing: 0.3,
  },
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  previewDashboardButton: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  previewDashboardText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
});
