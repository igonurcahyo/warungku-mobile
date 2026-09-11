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
import { registerApi } from '@/api/auth';

export default function RegisterScreen() {
  const router = useRouter();

  // Form values
  const [ownerName, setOwnerName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Field errors
  const [ownerNameError, setOwnerNameError] = useState('');
  const [storeNameError, setStoreNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // API Feedback state
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Field validators
  const validateOwnerName = (val: string): string => {
    if (!val.trim()) {
      return 'Nama pemilik wajib diisi';
    }
    return '';
  };

  const validateStoreName = (val: string): string => {
    if (!val.trim()) {
      return 'Nama warung wajib diisi';
    }
    return '';
  };

  const validateEmail = (val: string): string => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'Email wajib diisi';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Format email tidak valid';
    }
    return '';
  };

  const validatePassword = (val: string): string => {
    if (!val) {
      return 'Kata sandi wajib diisi';
    }
    if (val.length < 6) {
      return 'Kata sandi minimal 6 karakter';
    }
    return '';
  };

  const validateConfirmPassword = (val: string, passVal = password): string => {
    if (!val) {
      return 'Konfirmasi kata sandi wajib diisi';
    }
    if (val !== passVal) {
      return 'Kata sandi tidak sama';
    }
    return '';
  };

  // Change handlers with dynamic validation update if error already exists
  const handleOwnerNameChange = (text: string) => {
    setOwnerName(text);
    if (ownerNameError) {
      setOwnerNameError(validateOwnerName(text));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleStoreNameChange = (text: string) => {
    setStoreName(text);
    if (storeNameError) {
      setStoreNameError(validateStoreName(text));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(validateEmail(text));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(validatePassword(text));
    }
    if (confirmPassword && confirmPasswordError) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, text));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      setConfirmPasswordError(validateConfirmPassword(text, password));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    setRegisterSuccess(false);
    setErrorMsg('');

    const errOwner = validateOwnerName(ownerName);
    const errStore = validateStoreName(storeName);
    const errEmail = validateEmail(email);
    const errPass = validatePassword(password);
    const errConfirm = validateConfirmPassword(confirmPassword, password);

    setOwnerNameError(errOwner);
    setStoreNameError(errStore);
    setEmailError(errEmail);
    setPasswordError(errPass);
    setConfirmPasswordError(errConfirm);

    if (errOwner || errStore || errEmail || errPass || errConfirm) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerApi({
        name: ownerName.trim(),
        storeName: storeName.trim(),
        email: email.trim(),
        password,
        passwordConfirmation: confirmPassword,
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Pendaftaran gagal. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      setRegisterSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Gagal menghubungi server.');
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
            {/* Header / Logo */}
            <View style={styles.headerSection}>
              <WarungkuLogo />
              <Text style={styles.pageTitle}>Daftar sebagai Pemilik</Text>
              <Text style={styles.pageSubtitle}>
                Buat akun untuk mulai mengelola warung Anda
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              {/* Error Banner */}
              {!!errorMsg && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerTitle}>Pendaftaran Gagal</Text>
                  <Text style={styles.errorBannerSubtitle}>{errorMsg}</Text>
                </View>
              )}

              {/* Success Banner */}
              {registerSuccess && (
                <View style={styles.successBanner}>
                  <Text style={styles.successBannerTitle}>Pendaftaran Berhasil</Text>
                  <Text style={styles.successBannerSubtitle}>
                    Akun pemilik &ldquo;{ownerName.trim()}&rdquo; untuk warung &ldquo;{storeName.trim()}&rdquo; berhasil didaftarkan.
                  </Text>
                  <TouchableOpacity
                    style={styles.successActionButton}
                    onPress={() => router.replace('/')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.successActionText}>Masuk ke Akun Sekarang</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* 1. Nama Pemilik */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Pemilik</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'ownerName' && styles.inputWrapperFocused,
                    !!ownerNameError && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan nama pemilik"
                    placeholderTextColor={WarungkuColors.outline}
                    value={ownerName}
                    onChangeText={handleOwnerNameChange}
                    onFocus={() => setFocusedField('ownerName')}
                    onBlur={() => {
                      setFocusedField(null);
                      setOwnerNameError(validateOwnerName(ownerName));
                    }}
                    editable={!isLoading}
                  />
                </View>
                {!!ownerNameError && (
                  <Text style={styles.errorText}>{ownerNameError}</Text>
                )}
              </View>

              {/* 2. Nama Warung */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Warung</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'storeName' && styles.inputWrapperFocused,
                    !!storeNameError && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan nama warung"
                    placeholderTextColor={WarungkuColors.outline}
                    value={storeName}
                    onChangeText={handleStoreNameChange}
                    onFocus={() => setFocusedField('storeName')}
                    onBlur={() => {
                      setFocusedField(null);
                      setStoreNameError(validateStoreName(storeName));
                    }}
                    editable={!isLoading}
                  />
                </View>
                {!!storeNameError && (
                  <Text style={styles.errorText}>{storeNameError}</Text>
                )}
              </View>

              {/* 3. Email */}
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
                    placeholder="Masukkan email"
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

              {/* 4. Kata Sandi */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kata Sandi</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'password' && styles.inputWrapperFocused,
                    !!passwordError && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    placeholder="Masukkan kata sandi"
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
                {!!passwordError && (
                  <Text style={styles.errorText}>{passwordError}</Text>
                )}
              </View>

              {/* 5. Konfirmasi Kata Sandi */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'confirmPassword' && styles.inputWrapperFocused,
                    !!confirmPasswordError && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    placeholder="Ulangi kata sandi"
                    placeholderTextColor={WarungkuColors.outline}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => {
                      setFocusedField(null);
                      setConfirmPasswordError(validateConfirmPassword(confirmPassword, password));
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.showPasswordButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.showPasswordText}>
                      {showConfirmPassword ? 'Tutup' : 'Lihat'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {!!confirmPasswordError && (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isLoading || registerSuccess) && styles.submitButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading || registerSuccess}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color={WarungkuColors.onPrimary} />
                    <Text style={styles.submitButtonText}>Mendaftarkan...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>Daftar</Text>
                )}
              </TouchableOpacity>

              {/* Footer Login Link */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                  Sudah punya akun?{' '}
                  <Text
                    style={styles.footerLink}
                    onPress={() => {
                      if (router.canGoBack()) {
                        router.back();
                      } else {
                        router.replace('/');
                      }
                    }}
                  >
                    Masuk
                  </Text>
                </Text>
              </View>
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
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginTop: 14,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  card: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 22,
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
    padding: 14,
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
    marginTop: 3,
    lineHeight: 16,
  },
  successBanner: {
    backgroundColor: WarungkuColors.successContainer,
    borderRadius: 12,
    padding: 14,
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
    marginTop: 3,
    lineHeight: 16,
  },
  successActionButton: {
    backgroundColor: WarungkuColors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  successActionText: {
    color: WarungkuColors.onPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: WarungkuColors.text,
    marginBottom: 6,
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
    fontSize: 14,
    color: WarungkuColors.text,
    paddingVertical: 10,
  },
  passwordInput: {
    paddingRight: 8,
  },
  showPasswordButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    minHeight: 32,
    justifyContent: 'center',
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
  submitButton: {
    backgroundColor: WarungkuColors.primary,
    borderRadius: 12,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.75,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
    letterSpacing: 0.3,
  },
  footerContainer: {
    marginTop: 18,
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
});
