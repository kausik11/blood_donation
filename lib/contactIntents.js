import { Alert, Linking, Platform } from "react-native";

function normalizePhone(phone) {
  return String(phone ?? "").replace(/\D/g, "");
}

function getWhatsAppPhone(phone) {
  const normalizedPhone = normalizePhone(phone);

  if (normalizedPhone.length === 10) {
    return `91${normalizedPhone}`;
  }

  return normalizedPhone;
}

function getSmsUrl(phone, message) {
  const separator = Platform.OS === "ios" ? "&" : "?";
  return `sms:${normalizePhone(phone)}${separator}body=${encodeURIComponent(message)}`;
}

export async function openPhoneDialer(phone) {
  const callUrl = `tel:${normalizePhone(phone)}`;
  const supported = await Linking.canOpenURL(callUrl);

  if (!supported) {
    throw new Error("Calling is not available");
  }

  return Linking.openURL(callUrl);
}

export async function openWhatsAppOrSms({ phone, message }) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappPhone = getWhatsAppPhone(phone);

  if (Platform.OS === "web") {
    return Linking.openURL(`https://wa.me/${whatsappPhone}?text=${encodedMessage}`);
  }

  const whatsappUrl = `whatsapp://send?phone=${whatsappPhone}&text=${encodedMessage}`;

  if (await Linking.canOpenURL(whatsappUrl)) {
    return Linking.openURL(whatsappUrl);
  }

  const smsUrl = getSmsUrl(phone, message);

  if (await Linking.canOpenURL(smsUrl)) {
    return Linking.openURL(smsUrl);
  }

  Alert.alert("Messaging is not available right now");
  throw new Error("Messaging is not available");
}
