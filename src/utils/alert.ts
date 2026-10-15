import { Alert as NativeAlert, Platform, type AlertButton } from 'react-native';

/**
 * `Alert.alert` multiplateforme.
 *
 * Sur le web, react-native-web n'implémente pas `Alert.alert` (l'appel est ignoré) :
 * on se rabat sur `window.alert` / `window.confirm`. Avec une seule action en plus
 * d'« Annuler », la confirmation déclenche cette action ; sinon la première action.
 */
function alert(title: string, message?: string, buttons?: AlertButton[]): void {
  if (Platform.OS !== 'web') {
    NativeAlert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;
  const cancel = buttons?.find((b) => b.style === 'cancel');
  const action = buttons?.find((b) => b.style !== 'cancel');

  if (!cancel || !action) {
    window.alert(text);
    (action ?? cancel)?.onPress?.();
    return;
  }

  if (window.confirm(text)) action.onPress?.();
  else cancel.onPress?.();
}

export const Alert = { alert };
