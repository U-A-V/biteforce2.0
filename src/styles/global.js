import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    width: 280,
  },
  errorText: {
    color: 'crimson',
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
});
