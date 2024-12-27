import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef:any = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.error('Navigation ref is not ready yet');
  }
}