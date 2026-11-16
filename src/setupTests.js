import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// react-router очікує TextEncoder/TextDecoder, яких немає в jsdom цієї версії Jest.
Object.assign(global, { TextEncoder, TextDecoder });
