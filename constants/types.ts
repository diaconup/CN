export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Filter: { itemName: string };
  Map: { latitude: number; longitude: number; itemName: string };
};
